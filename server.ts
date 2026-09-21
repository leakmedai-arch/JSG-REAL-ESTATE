import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { 
  requireAuth, 
  requireRole, 
  checkBruteForce, 
  recordFailedLogin, 
  recordSuccessfulLogin, 
  getLoginAttemptsStatus,
  resetIpLock,
  verifyPassword, 
  hashPassword, 
  createToken, 
  sanitizeInput, 
  AuthenticatedRequest 
} from './server/auth';
import { syncManager } from './server/sync';
import { processAIChat } from './server/ai';

const app = express();
const PORT = 3000;

// Middleware for JSON parsing with 100MB limit for high-res property photos and video uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static directory for uploaded media
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Cache-control and security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Content-Version', String(db.getVersion()));
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https://images.propsearch.ae https://*.unsplash.com; media-src 'self' blob: data:; connect-src 'self' ws: wss:;"
  );
  next();
});

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    version: db.getVersion(), 
    propertiesCount: db.getProperties().length,
    timestamp: new Date().toISOString() 
  });
});

// Central Content Endpoint (Single Source of Truth for Public Site)
app.get('/api/content', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('ETag', `"${db.getVersion()}"`);

  res.json({
    version: db.getVersion(),
    updatedAt: db.getLastUpdatedAt(),
    settings: db.getSettings(),
    sections: db.getSections(),
    properties: db.getProperties().filter(p => p.status !== 'draft'),
    pages: db.getPages().filter(p => p.isPublished),
    communityImages: db.getCommunityImages(),
    aiSettings: {
      enabled: db.getAISettings().enabled,
      assistantName: db.getAISettings().assistantName,
      welcomeMessage: db.getAISettings().welcomeMessage,
      suggestedQuestions: db.getAISettings().suggestedQuestions,
      enableVoice: db.getAISettings().enableVoice
    }
  });
});

// Community Images Management (Central Server Authority)
app.put('/api/community-images', (req: Request, res: Response) => {
  const { name, imageUrl } = req.body;
  if (!name || !imageUrl) {
    return res.status(400).json({ error: 'Community name and imageUrl are required.' });
  }
  const updated = db.updateCommunityImage(name, imageUrl, 'Admin Customizer', req.ip || '127.0.0.1');
  syncManager.broadcast('COMMUNITY_IMAGES_UPDATED', { communityImages: updated, version: db.getVersion() });
  res.json({ success: true, communityImages: updated, version: db.getVersion() });
});

app.delete('/api/community-images/:name', (req: Request, res: Response) => {
  const name = decodeURIComponent(req.params.name);
  const updated = db.resetCommunityImage(name, 'Admin Customizer', req.ip || '127.0.0.1');
  syncManager.broadcast('COMMUNITY_IMAGES_UPDATED', { communityImages: updated, version: db.getVersion() });
  res.json({ success: true, communityImages: updated, version: db.getVersion() });
});

// Property Images Management (Primary + Multi-angle Gallery)
app.put('/api/properties/:id/images', (req: Request, res: Response) => {
  const { images, primaryImage } = req.body;
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Images array is required.' });
  }
  const prop = db.updatePropertyImages(req.params.id, images, primaryImage, 'Gallery Customizer', req.ip || '127.0.0.1');
  if (!prop) return res.status(404).json({ error: 'Property not found.' });
  syncManager.broadcast('PROPERTY_UPDATED', { property: prop, version: db.getVersion() });
  res.json({ success: true, property: prop, version: db.getVersion() });
});

// Founder Section Infinite Scroll Cards & Slides Management
app.put('/api/sections/founder-card', (req: Request, res: Response) => {
  const { cardId, newUrl } = req.body;
  if (!cardId || !newUrl) {
    return res.status(400).json({ error: 'cardId and newUrl are required.' });
  }
  const sections = db.updateFounderCard(cardId, newUrl, 'Founder Card Editor', req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
  res.json({ success: true, sections, version: db.getVersion() });
});

app.post('/api/sections/founder-card/reset', (req: Request, res: Response) => {
  const { cardId } = req.body;
  if (!cardId) {
    return res.status(400).json({ error: 'cardId is required.' });
  }
  const sections = db.resetFounderCard(cardId, 'Founder Card Editor', req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
  res.json({ success: true, sections, version: db.getVersion() });
});

app.put('/api/sections/showcase-slides', (req: Request, res: Response) => {
  const { slides } = req.body;
  if (!slides || !Array.isArray(slides)) {
    return res.status(400).json({ error: 'slides array is required.' });
  }
  const sections = db.updateShowcaseSlides(slides, 'Showcase Slides Editor', req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
  res.json({ success: true, sections, version: db.getVersion() });
});

// Hero Slider Photo Management (Instant Photo Customization for any slide)
app.put('/api/sections/hero-slider-photo', (req: Request, res: Response) => {
  const { slideId, newUrl } = req.body;
  if (!slideId || !newUrl) {
    return res.status(400).json({ error: 'slideId and newUrl are required.' });
  }
  const sections = db.updateHeroSliderPhoto(slideId, newUrl, 'Hero Slider Editor', req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
  res.json({ success: true, sections, version: db.getVersion() });
});

app.post('/api/sections/hero-slider-photo/reset', (req: Request, res: Response) => {
  const { slideId } = req.body;
  if (!slideId) {
    return res.status(400).json({ error: 'slideId is required.' });
  }
  const sections = db.resetHeroSliderPhoto(slideId, 'Hero Slider Editor', req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
  res.json({ success: true, sections, version: db.getVersion() });
});

// Update construction video URL directly
app.put('/api/sections/construction-video', (req: Request, res: Response) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: 'videoUrl is required' });
  }
  const sections = db.updateConstructionVideoUrl(videoUrl, 'Video Customizer', req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
  res.json({ success: true, sections, version: db.getVersion() });
});

// Reset construction video to official master video
app.post('/api/sections/construction-video/reset', (req: Request, res: Response) => {
  const sections = db.resetConstructionVideoUrl('Video Customizer', req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
  res.json({ success: true, sections, version: db.getVersion() });
});

// Endpoint to upload or update the construction video
app.post('/api/upload-construction-video', (req: Request, res: Response) => {
  const { videoBase64, videoUrl } = req.body;

  if (videoUrl) {
    const sections = db.updateConstructionVideoUrl(videoUrl, 'Video Customizer', req.ip || '127.0.0.1');
    syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });
    return res.json({ success: true, videoUrl, sections, message: 'Construction video URL updated successfully' });
  }

  if (!videoBase64) {
    return res.status(400).json({ error: 'videoBase64 or videoUrl is required' });
  }

  try {
    const base64Data = videoBase64.replace(/^data:video\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const targetPath1 = path.join(process.cwd(), 'public', 'construction.mp4');
    const targetPath2 = path.join(process.cwd(), 'public', 'assets', 'construction.mp4');
    const uploadFilename = `construction-${Date.now()}.mp4`;
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads', uploadFilename);
    
    fs.writeFileSync(targetPath1, buffer);
    try { fs.writeFileSync(targetPath2, buffer); } catch (_) {}
    try { fs.writeFileSync(uploadsPath, buffer); } catch (_) {}

    const updatedUrl = `/construction.mp4?v=${Date.now()}`;
    const sections = db.updateConstructionVideoUrl(updatedUrl, 'Video Uploader', req.ip || '127.0.0.1');
    syncManager.broadcast('SECTIONS_UPDATED', { sections, version: db.getVersion() });

    res.json({ success: true, videoUrl: updatedUrl, sections, message: 'Construction video saved successfully' });
  } catch (err: any) {
    console.error('Error saving uploaded construction video:', err);
    res.status(500).json({ error: err.message });
  }
});

// Real-time Server-Sent Events (SSE) Stream
app.get('/api/sync/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = syncManager.addClient(res);
  req.on('close', () => {
    syncManager.removeClient(clientId);
  });
});

// Polling Sync Status
app.get('/api/sync/status', (req: Request, res: Response) => {
  res.json({
    version: db.getVersion(),
    activeClients: syncManager.getClientCount(),
    timestamp: new Date().toISOString()
  });
});

// Public Lead Capture Form
app.post('/api/leads', (req: Request, res: Response) => {
  const { name, phone, email, interestedProperty, propertyId, requirement, source, budget, note } = req.body;
  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'Name and at least phone or email are required.' });
  }

  const newLead = db.addLead({
    name: sanitizeInput(name),
    phone: sanitizeInput(phone),
    email: sanitizeInput(email),
    interestedProperty: sanitizeInput(interestedProperty),
    propertyId,
    requirement: sanitizeInput(requirement),
    budget: sanitizeInput(budget),
    source: source || 'Contact Form',
    status: 'New',
    priority: 'High',
    note: sanitizeInput(note)
  });

  syncManager.broadcast('LEAD_CREATED', { lead: newLead });
  res.status(201).json({ success: true, lead: newLead });
});

// Public Appointment Booking Request
app.post('/api/appointments', (req: Request, res: Response) => {
  const { customerName, phone, email, purpose, preferredDate, preferredTime, propertyTitle, propertyId, notes } = req.body;
  if (!customerName || !phone || !preferredDate) {
    return res.status(400).json({ error: 'Name, phone number and preferred date are required.' });
  }

  const newApt = db.addAppointment({
    customerName: sanitizeInput(customerName),
    phone: sanitizeInput(phone),
    email: sanitizeInput(email || ''),
    purpose: purpose || 'Property Viewing',
    preferredDate: sanitizeInput(preferredDate),
    preferredTime: sanitizeInput(preferredTime || '14:00'),
    propertyTitle: sanitizeInput(propertyTitle || ''),
    propertyId,
    status: 'Pending',
    notes: sanitizeInput(notes || '')
  });

  syncManager.broadcast('APPOINTMENT_CREATED', { appointment: newApt });
  res.status(201).json({ success: true, appointment: newApt });
});

// Public Real Logo Upload (Supports Instant Header Customization)
app.post('/api/upload-logo', (req: Request, res: Response) => {
  try {
    const { filename, base64Data, mimeType } = req.body;
    if (!base64Data || !filename) {
      return res.status(400).json({ error: 'base64Data and filename are required.' });
    }

    let buffer: Buffer;
    if (base64Data.includes(';base64,')) {
      const parts = base64Data.split(';base64,');
      buffer = Buffer.from(parts[1], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const safeFilename = `logo-${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    const author = 'Header Customizer';
    const ip = req.ip || '127.0.0.1';

    const updated = db.updateSettings({ logoUrl: publicUrl }, author, ip);
    syncManager.broadcast('SETTINGS_UPDATED', { settings: updated });

    res.status(201).json({ success: true, logoUrl: publicUrl, filename: safeFilename });
  } catch (err: any) {
    console.error('Logo upload error:', err);
    res.status(500).json({ error: 'Failed to process logo upload: ' + err.message });
  }
});

// AI Assistant Chat & Lead Extraction
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { messages, clientContext } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const result = await processAIChat(messages, clientContext);
  res.json(result);
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------

// Admin Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { email, password, twoFactorCode } = req.body;

  // Brute force check
  const bruteCheck = checkBruteForce(ip);
  if (!bruteCheck.allowed) {
    return res.status(429).json({ 
      error: `Too many failed login attempts. IP temporarily locked. Please retry in ${bruteCheck.remainingLockSeconds} seconds.`,
      locked: true,
      remainingSeconds: bruteCheck.remainingLockSeconds
    });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Username and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    const failed = recordFailedLogin(ip);
    return res.status(401).json({ 
      error: 'Invalid credentials. Access denied.',
      remainingAttempts: failed.locked ? 0 : 5 - (failed.remainingLockSeconds ? 5 : 1)
    });
  }

  // Check account lock
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    return res.status(403).json({ error: 'This administrator account is temporarily locked.' });
  }

  // Verify password hash
  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }
    db.updateUser(user.id, { 
      failedLoginAttempts: user.failedLoginAttempts, 
      lockedUntil: user.lockedUntil 
    });

    const failed = recordFailedLogin(ip);
    db.logAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'LOGIN_FAILED',
      entityType: 'Auth',
      details: `Failed password attempt for user ${user.email}`,
      ip
    });

    return res.status(401).json({ 
      error: 'Invalid credentials. Access denied.',
      locked: failed.locked,
      remainingSeconds: failed.remainingLockSeconds
    });
  }

  // Check 2FA if enabled
  if (user.is2faEnabled) {
    if (!twoFactorCode || twoFactorCode !== '123456') { // Standard TOTP simulation
      return res.status(403).json({ 
        requires2fa: true, 
        message: 'Two-Factor Authentication (2FA) verification code required.' 
      });
    }
  }

  // Login successful
  recordSuccessfulLogin(ip);
  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  user.lastLogin = new Date().toISOString();
  db.updateUser(user.id, { failedLoginAttempts: 0, lockedUntil: undefined, lastLogin: user.lastLogin });

  const token = createToken(user);

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'LOGIN_SUCCESS',
    entityType: 'Auth',
    details: `Successful admin login from IP ${ip}`,
    ip
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      is2faEnabled: user.is2faEnabled
    }
  });
});

// Admin Current User Profile
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      is2faEnabled: user.is2faEnabled,
      lastLogin: user.lastLogin
    }
  });
});

// Admin Password Change
app.post('/api/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }

  const user = db.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isValid = verifyPassword(currentPassword, user.passwordHash, user.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  const { hash, salt } = hashPassword(newPassword);
  db.updateUser(user.id, { passwordHash: hash, salt });

  db.logAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'PASSWORD_CHANGED',
    entityType: 'Auth',
    details: 'Administrator updated their password',
    ip: req.ip || '127.0.0.1'
  });

  res.json({ success: true, message: 'Password successfully updated.' });
});

// ----------------------------------------------------
// ADMIN CMS & CONTROL CENTER
// ----------------------------------------------------

// Admin Full Overview / State
app.get(['/api/admin/overview', '/api/admin/dashboard'], requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const properties = db.getProperties();
  const leads = db.getLeads();
  const appointments = db.getAppointments();

  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);

  res.json({
    stats: {
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.status === 'active').length,
      soldOrRented: properties.filter(p => p.status === 'sold' || p.status === 'rented').length,
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'New').length,
      viewingsScheduled: appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length,
      pendingAppointments: appointments.filter(a => a.status === 'Pending').length,
      totalInventoryValue: totalValue,
      connectedClients: syncManager.getClientCount(),
      currentVersion: db.getVersion(),
      contentVersion: db.getVersion()
    },
    settings: db.getSettings(),
    sections: db.getSections(),
    properties,
    pages: db.getPages(),
    leads: leads.slice(0, 50),
    appointments: appointments.slice(0, 50),
    recentAudit: db.getAuditLogs(25),
    aiSettings: db.getAISettings()
  });
});

// Update Site Settings
app.put('/api/admin/settings', requireAuth, requireRole(['super_admin', 'property_manager']), (req: AuthenticatedRequest, res: Response) => {
  if (req.body.expectedVersion && req.body.expectedVersion < db.getVersion()) {
    return res.status(409).json({
      conflict: true,
      error: 'Conflict detected: Site settings were updated from another device. Please reload the latest changes before saving.',
      currentVersion: db.getVersion()
    });
  }
  const updated = db.updateSettings(req.body, req.user!.email, req.ip || '127.0.0.1');
  syncManager.broadcast('SETTINGS_UPDATED', { settings: updated, version: db.getVersion() });
  res.json({ success: true, settings: updated, version: db.getVersion() });
});

// Update Sections & Hero Slides
app.put('/api/admin/sections', requireAuth, requireRole(['super_admin', 'property_manager', 'content_editor']), (req: AuthenticatedRequest, res: Response) => {
  if (req.body.expectedVersion && req.body.expectedVersion < db.getVersion()) {
    return res.status(409).json({
      conflict: true,
      error: 'Conflict detected: Sections were updated from another device. Please reload the latest changes before saving.',
      currentVersion: db.getVersion()
    });
  }
  const updated = db.updateSections(req.body, req.user!.email, req.ip || '127.0.0.1');
  syncManager.broadcast('SECTIONS_UPDATED', { sections: updated, version: db.getVersion() });
  res.json({ success: true, sections: updated, version: db.getVersion() });
});

// Property Management: Add Property
app.post('/api/admin/properties', requireAuth, requireRole(['super_admin', 'property_manager']), (req: AuthenticatedRequest, res: Response) => {
  const prop = db.addProperty(req.body, req.user!.email, req.ip || '127.0.0.1');
  syncManager.broadcast('PROPERTY_CREATED', { property: prop, version: db.getVersion() });
  res.status(201).json({ success: true, property: prop, version: db.getVersion() });
});

// Property Management: Update Property
app.put('/api/admin/properties/:id', requireAuth, requireRole(['super_admin', 'property_manager']), (req: AuthenticatedRequest, res: Response) => {
  if (req.body.expectedVersion && req.body.expectedVersion < db.getVersion()) {
    return res.status(409).json({
      conflict: true,
      error: 'Conflict detected: This property was updated from another device. Please reload the latest listing data.',
      currentVersion: db.getVersion()
    });
  }
  const prop = db.updateProperty(req.params.id, req.body, req.user!.email, req.ip || '127.0.0.1');
  if (!prop) return res.status(404).json({ error: 'Property not found.' });
  syncManager.broadcast('PROPERTY_UPDATED', { property: prop, version: db.getVersion() });
  res.json({ success: true, property: prop, version: db.getVersion() });
});

// Property Management: Delete Property
app.delete('/api/admin/properties/:id', requireAuth, requireRole(['super_admin', 'property_manager']), (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteProperty(req.params.id, req.user!.email, req.ip || '127.0.0.1');
  if (!success) return res.status(404).json({ error: 'Property not found.' });
  syncManager.broadcast('PROPERTY_DELETED', { id: req.params.id });
  res.json({ success: true });
});

// Pages Management: List Pages
app.get('/api/admin/pages', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getPages());
});

// Pages Management: Add Page
app.post('/api/admin/pages', requireAuth, requireRole(['super_admin', 'content_editor']), (req: AuthenticatedRequest, res: Response) => {
  const page = db.addPage(req.body, req.user!.email, req.ip || '127.0.0.1');
  syncManager.broadcast('PAGE_CREATED', { page });
  res.status(201).json({ success: true, page });
});

// Pages Management: Update Page
app.put('/api/admin/pages/:id', requireAuth, requireRole(['super_admin', 'content_editor']), (req: AuthenticatedRequest, res: Response) => {
  const page = db.updatePage(req.params.id, req.body, req.user!.email, req.ip || '127.0.0.1');
  if (!page) return res.status(404).json({ error: 'Page not found.' });
  syncManager.broadcast('PAGE_UPDATED', { page });
  res.json({ success: true, page });
});

// Pages Management: Delete Page
app.delete('/api/admin/pages/:id', requireAuth, requireRole(['super_admin', 'content_editor']), (req: AuthenticatedRequest, res: Response) => {
  const success = db.deletePage(req.params.id, req.user!.email, req.ip || '127.0.0.1');
  if (!success) return res.status(404).json({ error: 'Page not found.' });
  syncManager.broadcast('PAGE_DELETED', { id: req.params.id });
  res.json({ success: true });
});

// Leads CRM: Get All Leads
app.get('/api/admin/leads', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getLeads());
});

// Leads CRM: Update Lead
app.put('/api/admin/leads/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const lead = db.updateLead(req.params.id, req.body, req.user!.email, req.ip || '127.0.0.1');
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  syncManager.broadcast('LEAD_UPDATED', { lead });
  res.json({ success: true, lead });
});

// Leads CRM: Add Note
app.post('/api/admin/leads/:id/notes', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Note text is required.' });
  const lead = db.addLeadNote(req.params.id, text, req.user!.name || req.user!.email);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  res.json({ success: true, lead });
});

// Leads CRM: Delete Lead
app.delete('/api/admin/leads/:id', requireAuth, requireRole(['super_admin', 'lead_agent']), (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteLead(req.params.id, req.user!.email, req.ip || '127.0.0.1');
  if (!success) return res.status(404).json({ error: 'Lead not found.' });
  res.json({ success: true });
});

// Appointments Management
app.get('/api/admin/appointments', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getAppointments());
});

app.put('/api/admin/appointments/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const apt = db.updateAppointment(req.params.id, req.body, req.user!.email, req.ip || '127.0.0.1');
  if (!apt) return res.status(404).json({ error: 'Appointment not found.' });
  syncManager.broadcast('APPOINTMENT_UPDATED', { appointment: apt });
  res.json({ success: true, appointment: apt });
});

// Media Library
app.get('/api/admin/media', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getMedia());
});

// Media Library Upload (Base64 file or URL)
app.post('/api/admin/media/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { filename, base64Data, category, url } = req.body;

  if (url) {
    const item = db.addMedia({
      filename: filename || 'Remote Image',
      url,
      size: 0,
      mimeType: 'image/jpeg',
      category: category || 'Other'
    });
    return res.status(201).json({ success: true, media: item });
  }

  if (!base64Data || !filename) {
    return res.status(400).json({ error: 'File data and filename are required.' });
  }

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let mimeType = 'image/jpeg';

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    const item = db.addMedia({
      filename: safeFilename,
      url: publicUrl,
      size: buffer.length,
      mimeType,
      category: category || 'Properties'
    });

    db.logAudit({
      userId: req.user!.id,
      userEmail: req.user!.email,
      action: 'MEDIA_UPLOADED',
      entityType: 'Media',
      entityId: item.id,
      details: `Uploaded media file: ${safeFilename} (${(buffer.length / 1024).toFixed(1)} KB)`,
      ip: req.ip || '127.0.0.1'
    });

    res.status(201).json({ success: true, media: item });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to process file upload: ' + err.message });
  }
});

app.delete('/api/admin/media/:id', requireAuth, requireRole(['super_admin', 'property_manager']), (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteMedia(req.params.id, req.user!.email, req.ip || '127.0.0.1');
  if (!success) return res.status(404).json({ error: 'Media not found.' });
  res.json({ success: true });
});

// Audit Logs
app.get(['/api/admin/audit', '/api/admin/audit-logs'], requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getAuditLogs(100));
});

// Revisions & Snapshots
app.get('/api/admin/revisions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getRevisions());
});

// Create manual snapshot revision
app.post('/api/admin/revisions/snapshot', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title } = req.body;
  const snapshot = db.createRevisionSnapshot(req.user!.email, title || 'Manual Snapshot');
  res.status(201).json({ success: true, snapshot });
});

app.post(['/api/admin/revisions/restore', '/api/admin/revisions/:id/restore'], requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const revisionId = req.params.id || req.body.revisionId;
  if (!revisionId) return res.status(400).json({ error: 'Revision ID is required.' });

  const success = db.restoreRevision(revisionId, req.user!.email, req.ip || '127.0.0.1');
  if (!success) return res.status(404).json({ error: 'Revision snapshot not found.' });

  syncManager.broadcast('REVISION_RESTORED', { revisionId, version: db.getVersion() });
  res.json({ success: true, version: db.getVersion() });
});

// Full System Backup Export & Import
app.get('/api/admin/backup/export', requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const backup = db.exportFullBackup();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=jsg_real_estate_backup_${Date.now()}.json`);
  res.send(JSON.stringify(backup, null, 2));
});

app.post('/api/admin/backup/import', requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const success = db.importFullBackup(req.body, req.user!.email, req.ip || '127.0.0.1');
  if (!success) return res.status(400).json({ error: 'Invalid backup file structure.' });

  syncManager.broadcast('BACKUP_RESTORED', { version: db.getVersion() });
  res.json({ success: true, version: db.getVersion() });
});

// AI Assistant Settings
app.put('/api/admin/ai-settings', requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateAISettings(req.body, req.user!.email, req.ip || '127.0.0.1');
  syncManager.broadcast('AI_SETTINGS_UPDATED', { aiSettings: updated });
  res.json({ success: true, aiSettings: updated });
});

// User Management (Super Admin only)
app.get('/api/admin/users', requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const safeUsers = db.getUsers().map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    name: u.name,
    role: u.role,
    is2faEnabled: u.is2faEnabled,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin
  }));
  res.json(safeUsers);
});

app.post('/api/admin/users', requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const { username, email, password, name, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An administrator with this email or username already exists.' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser = db.addUser({
    username: sanitizeInput(username),
    email: sanitizeInput(email),
    passwordHash: hash,
    salt,
    name: sanitizeInput(name || username),
    role: role || 'content_editor',
    is2faEnabled: false
  }, req.user!.email, req.ip || '127.0.0.1');

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// Update Current Admin Account Settings (MALEEK Profile & 2FA)
app.put('/api/admin/account', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, email, is2faEnabled } = req.body;
  const userId = req.user!.id;

  const updates: any = {};
  if (name !== undefined) updates.name = sanitizeInput(name);
  if (email !== undefined) updates.email = sanitizeInput(email);
  if (is2faEnabled !== undefined) updates.is2faEnabled = Boolean(is2faEnabled);

  const updated = db.updateUser(userId, updates);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.logAudit({
    userId,
    userEmail: req.user!.email,
    action: 'ACCOUNT_UPDATED',
    entityType: 'User',
    entityId: userId,
    details: `Updated account settings: ${JSON.stringify(updates)}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({
    success: true,
    user: {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      is2faEnabled: updated.is2faEnabled
    }
  });
});

// Update Specific Admin User by ID
app.put('/api/admin/users/:id', requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role, is2faEnabled } = req.body;

  const updates: any = {};
  if (name !== undefined) updates.name = sanitizeInput(name);
  if (email !== undefined) updates.email = sanitizeInput(email);
  if (role !== undefined) updates.role = role;
  if (is2faEnabled !== undefined) updates.is2faEnabled = Boolean(is2faEnabled);

  const updated = db.updateUser(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.logAudit({
    userId: req.user!.id,
    userEmail: req.user!.email,
    action: 'USER_UPDATED',
    entityType: 'User',
    entityId: id,
    details: `Updated user ${updated.email}: ${JSON.stringify(updates)}`,
    ip: req.ip || '127.0.0.1'
  });

  res.json({ success: true, user: updated });
});

// Security & Brute Force Rate Limiting Monitor
app.get('/api/admin/security/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const lockouts = getLoginAttemptsStatus();
  res.json({
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 15,
    activeTrackingCount: lockouts.length,
    activeLockouts: lockouts.filter(l => (l.remainingSeconds || 0) > 0),
    allAttempts: lockouts,
    headers: {
      cspActive: true,
      xssProtection: '1; mode=block',
      frameOptions: 'SAMEORIGIN',
      typeOptions: 'nosniff',
      hsts: 'max-age=31536000; includeSubDomains'
    }
  });
});

// Unlock IP / Reset Brute-force Lockout
app.post('/api/admin/security/unlock', requireAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const { ip } = req.body;
  resetIpLock(ip);
  db.logAudit({
    userId: req.user!.id,
    userEmail: req.user!.email,
    action: 'SECURITY_LOCKOUT_RESET',
    entityType: 'Security',
    details: ip ? `Reset brute-force lockout for IP: ${ip}` : 'Reset all brute-force IP lockouts',
    ip: req.ip || '127.0.0.1'
  });
  res.json({ success: true, message: ip ? `Unlocked IP ${ip}` : 'All rate limits reset' });
});

// Dynamic Production XML Sitemap (Requirement 35)
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;

  const properties = db.getProperties().filter(p => p.status !== 'draft');
  const pages = db.getPages().filter(p => p.isPublished);
  const areas = Object.keys(db.getCommunityImages());

  const publicRoutes = [
    '',
    '/buy',
    '/rent',
    '/sell',
    '/new-projects',
    '/mortgage-calculator',
    '/rent-vs-buy',
    '/transactions',
    '/market-reports',
    '/guides',
    '/areas',
    '/agents',
    '/live-showcase'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  publicRoutes.forEach(route => {
    xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  properties.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/buy?property=${p.id}</loc>\n    <lastmod>${(p.updatedAt || new Date().toISOString()).slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  areas.forEach(area => {
    const slug = encodeURIComponent(area);
    xml += `  <url>\n    <loc>${baseUrl}/areas?area=${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  });

  pages.forEach(pg => {
    xml += `  <url>\n    <loc>${baseUrl}/p/${pg.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// ----------------------------------------------------
// VITE INTEGRATION & SERVER BOOTSTRAP
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JSG Real Estate Enterprise Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
