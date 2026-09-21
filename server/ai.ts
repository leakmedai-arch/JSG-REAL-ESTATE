import { GoogleGenAI } from '@google/genai';
import { db } from './db';
import { syncManager } from './sync';

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export async function processAIChat(messages: Array<{ role: 'user' | 'model' | 'assistant'; text: string }>, clientContext?: any): Promise<{
  reply: string;
  leadCaptured?: boolean;
  appointmentBooked?: boolean;
  recommendedPropertyIds?: number[];
}> {
  const aiSettings = db.getAISettings();
  if (!aiSettings.enabled) {
    return {
      reply: 'The AI assistant is currently in maintenance mode. Please call our private desk directly at ' + db.getSettings().contact.phone
    };
  }

  const client = getAI();
  const properties = db.getProperties().filter(p => p.status === 'active');
  const settings = db.getSettings();

  // Prepare contextual knowledge for Gemini
  const propertiesSummary = properties.map(p => 
    `• ID: ${p.id} | Title: "${p.title}" | Price: AED ${p.price.toLocaleString()} | Type: ${p.type} (${p.category}) | Location: ${p.location} | Beds: ${p.beds} | Baths: ${p.baths} | Area: ${p.area} sqft | Features: ${p.features.join(', ')}`
  ).join('\n');

  const systemInstruction = `
${aiSettings.systemPrompt}
Tone of Voice: ${aiSettings.tone}.
Agency Details:
- Company: ${settings.contact.company}
- Founder: ${db.getSections().founder.name} (${db.getSections().founder.title})
- RERA License: ${settings.reraLicense}
- Office: ${settings.contact.location}
- Official Phone: ${settings.contact.phone}
- WhatsApp: ${settings.contact.whatsapp}
- Email: ${settings.contact.email}

CURRENT ACTIVE VERIFIED PROPERTIES IN DUBAI INVENTORY:
${propertiesSummary}

CRITICAL RULES:
1. Always be polite, professional, and sophisticated.
2. Recommend specific properties from the inventory above when user asks about villas, apartments, investments, or specific budgets.
3. If the user provides their contact details (name, phone, email) or requests a viewing/call back/consultation, acknowledge it warmly and confirm that our senior property advisor will reach out promptly.
4. Also format an internal JSON block at the very end of your response IF the user provided contact details or viewing intent:
\`\`\`lead_json
{
  "name": "<Customer Name or Guest>",
  "phone": "<Phone number if provided or ''>",
  "email": "<Email if provided or ''>",
  "propertyTitle": "<Property title if discussing one>",
  "purpose": "Property Viewing" | "Call Back" | "VIP Consultation",
  "requirement": "<brief summary of customer inquiry>",
  "preferredDate": "<date or 'Next available slot'>",
  "preferredTime": "<time or 'Morning/Afternoon'>"
}
\`\`\`
`.trim();

  // If Gemini API Key is missing, provide a smart fallback response
  if (!client) {
    const lastUserMsg = messages[messages.length - 1]?.text || '';
    const lower = lastUserMsg.toLowerCase();

    // Check for property keywords
    const matched = properties.filter(p => 
      lower.includes(p.type) || 
      lower.includes(p.location.toLowerCase()) || 
      lower.includes(p.community.toLowerCase())
    );

    let fallbackReply = `Welcome to JSG Real Estate. We currently feature ${properties.length} prime Dubai listings including trophy waterfront villas on Palm Jumeirah and luxury residences in Dubai Marina and Downtown.`;

    if (matched.length > 0) {
      const top = matched[0];
      fallbackReply = `I recommend exploring "${top.title}" in ${top.location}, listed at AED ${top.price.toLocaleString()} (${top.beds} Beds, ${top.area} sqft). Would you like to schedule a private viewing with our founder Jasmeet S. Gulati? You can also reach us directly via WhatsApp at ${settings.contact.whatsapp}.`;
    } else if (lower.includes('visa') || lower.includes('golden')) {
      fallbackReply = `Under UAE regulations, purchasing properties valued at AED 2 Million or higher qualifies you for the 10-Year Golden Visa with 100% foreign ownership. We can arrange a full investor advisory consultation.`;
    }

    return {
      reply: fallbackReply,
      recommendedPropertyIds: matched.slice(0, 2).map(p => Number(p.id))
    };
  }

  try {
    // Format conversation history
    const contents: any[] = [];
    for (const m of messages) {
      contents.push({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const rawText = response.text || '';

    // Check if lead JSON was extracted
    let cleanedReply = rawText;
    let leadCaptured = false;
    let appointmentBooked = false;

    const jsonMatch = rawText.match(/```lead_json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const leadData = JSON.parse(jsonMatch[1]);
        cleanedReply = rawText.replace(/```lead_json[\s\S]*?```/, '').trim();

        if (leadData.phone || leadData.email) {
          db.addLead({
            name: leadData.name || 'Website Visitor',
            phone: leadData.phone || '',
            email: leadData.email || '',
            interestedProperty: leadData.propertyTitle || 'General Dubai Real Estate',
            requirement: leadData.requirement || 'Inquiry captured via AI Concierge',
            source: 'AI Assistant',
            status: 'New',
            priority: 'High'
          });
          leadCaptured = true;

          if (leadData.purpose === 'Property Viewing' || leadData.purpose === 'Call Back') {
            db.addAppointment({
              customerName: leadData.name || 'Website Visitor',
              phone: leadData.phone || '',
              email: leadData.email || '',
              purpose: leadData.purpose,
              preferredDate: leadData.preferredDate || new Date().toISOString().split('T')[0],
              preferredTime: leadData.preferredTime || '14:00',
              propertyTitle: leadData.propertyTitle,
              status: 'Pending',
              notes: `Auto-captured by ${aiSettings.assistantName}`
            });
            appointmentBooked = true;
          }

          syncManager.broadcast('LEAD_CAPTURED', { lead: leadData });
        }
      } catch (err) {
        console.error('Failed to parse AI lead JSON:', err);
      }
    }

    // Match recommended properties
    const recommendedIds: number[] = [];
    for (const p of properties) {
      if (cleanedReply.includes(p.title) || cleanedReply.includes(String(p.price))) {
        recommendedIds.push(Number(p.id));
      }
    }

    return {
      reply: cleanedReply,
      leadCaptured,
      appointmentBooked,
      recommendedPropertyIds: recommendedIds
    };
  } catch (err) {
    console.error('Error generating AI response:', err);
    return {
      reply: `Thank you for contacting JSG Real Estate. We are experiencing high inquiry volume. Please contact our desk directly at ${settings.contact.phone} or on WhatsApp at ${settings.contact.whatsapp}.`
    };
  }
}
