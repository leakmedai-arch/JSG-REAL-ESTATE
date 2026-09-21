import { ParsedStream, StreamSourceType } from '../types';

export function parseStreamUrl(rawUrl: string, currentHost: string = 'localhost'): ParsedStream {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      type: 'hls',
      originalUrl: '',
      isValid: false,
      warning: 'No URL provided'
    };
  }

  // Check for HLS (.m3u8)
  if (trimmed.includes('.m3u8')) {
    const isHttp = trimmed.startsWith('http://');
    return {
      type: 'hls',
      originalUrl: trimmed,
      streamUrl: trimmed,
      isValid: true,
      warning: isHttp
        ? 'Mixed Content Warning: This stream is on HTTP. In HTTPS environments, browsers may block HTTP streams unless served via HTTPS or a proxy.'
        : undefined,
      suggestedFix: isHttp ? 'Convert stream endpoint to HTTPS (SSL) to avoid browser blocking.' : undefined
    };
  }

  // Check for direct MP4 or WebM
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'video',
      originalUrl: trimmed,
      streamUrl: trimmed,
      isValid: true
    };
  }

  // YouTube detection
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      originalUrl: trimmed,
      channelOrId: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`,
      isValid: true
    };
  }

  // YouTube live stream by channel or direct live link
  if (trimmed.includes('youtube.com/live/')) {
    const parts = trimmed.split('/live/');
    const id = parts[1]?.split(/[?#&]/)[0];
    if (id) {
      return {
        type: 'youtube',
        originalUrl: trimmed,
        channelOrId: id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1`,
        isValid: true
      };
    }
  }

  // Twitch detection
  if (trimmed.includes('twitch.tv/')) {
    const cleanUrl = trimmed.split('?')[0].replace(/\/$/, '');
    const channelName = cleanUrl.split('twitch.tv/').pop();
    const host = currentHost || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
    
    if (channelName && !channelName.includes('/')) {
      return {
        type: 'twitch',
        originalUrl: trimmed,
        channelOrId: channelName,
        embedUrl: `https://player.twitch.tv/?channel=${channelName}&parent=${host}&muted=true&autoplay=true`,
        isValid: true,
        warning: `Twitch requires the exact parent domain (currently: ${host}) in the embed code. If this was missing on your previous site, Twitch would display a blank or error screen.`
      };
    }
  }

  // Kick detection
  if (trimmed.includes('kick.com/')) {
    const cleanUrl = trimmed.split('?')[0].replace(/\/$/, '');
    const channelName = cleanUrl.split('kick.com/').pop();
    if (channelName && !channelName.includes('/')) {
      return {
        type: 'kick',
        originalUrl: trimmed,
        channelOrId: channelName,
        embedUrl: `https://player.kick.com/${channelName}?muted=true&autoplay=true`,
        isValid: true
      };
    }
  }

  // Generic website URL
  let validWebUrl = trimmed;
  if (!/^https?:\/\//i.test(validWebUrl)) {
    validWebUrl = `https://${validWebUrl}`;
  }

  try {
    new URL(validWebUrl);
    return {
      type: 'iframe',
      originalUrl: trimmed,
      embedUrl: validWebUrl,
      isValid: true,
      warning: 'Websites often set X-Frame-Options: SAMEORIGIN or Content-Security-Policy headers which block them from being viewed inside an iframe.',
      suggestedFix: 'To rebuild this site, we replicate the layout and UI directly with responsive React components rather than relying on an iframe embed.'
    };
  } catch {
    return {
      type: 'video',
      originalUrl: trimmed,
      isValid: false,
      warning: 'Invalid URL format'
    };
  }
}

export const SAMPLE_STREAMS = [
  {
    name: 'Tears of Steel (4K HLS Test)',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'hls' as StreamSourceType,
    title: 'Live Creative Production Broadcast',
    author: 'Studio Open Stream'
  },
  {
    name: 'Big Buck Bunny (HLS Stream)',
    url: 'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8',
    type: 'hls' as StreamSourceType,
    title: 'High-Bitrate Test Channel',
    author: 'Akamai Live Edge'
  },
  {
    name: 'NASA / Space Stream (YouTube)',
    url: 'https://www.youtube.com/watch?v=21X5lGlDOfg',
    type: 'youtube' as StreamSourceType,
    title: 'Live ISS Earth Views from Space',
    author: 'NASA Official'
  },
  {
    name: 'Twitch Channel Test (Riot Games)',
    url: 'https://www.twitch.tv/riotgames',
    type: 'twitch' as StreamSourceType,
    title: 'Championship Live Arena',
    author: 'Riot Games'
  }
];
