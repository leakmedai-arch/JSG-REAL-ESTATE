export type StreamSourceType = 'youtube' | 'twitch' | 'kick' | 'hls' | 'video' | 'iframe';

export interface ParsedStream {
  type: StreamSourceType;
  originalUrl: string;
  embedUrl?: string;
  streamUrl?: string;
  channelOrId?: string;
  isValid: boolean;
  warning?: string;
  suggestedFix?: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  badge?: 'mod' | 'sub' | 'vip' | 'streamer';
  color: string;
  text: string;
  timestamp: string;
}

export interface SiteCloneRequest {
  url: string;
  siteName: string;
  category: 'gaming' | 'podcast' | 'sports' | 'music' | 'webinar' | 'general';
  brokenReason: string;
  desiredFeatures: string[];
  notes: string;
}
