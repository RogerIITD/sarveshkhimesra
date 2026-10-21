// One entry point for analytics events. Never throws, never blocks the UI.
// Today: forwards to Google Analytics. Next: also batches to /api/track.

export type TrackEvent =
  | { name: 'app_open'; app: string; via: 'icon' | 'dock' | 'auto' | 'terminal' | 'mobile' | 'link' | 'persona' }
  | { name: 'app_close'; app: string; seconds: number }
  | { name: 'audio_play'; track: string }
  | { name: 'audio_progress'; track: string; pct: 25 | 50 | 75 | 100 }
  | { name: 'photo_open'; src: string }
  | { name: 'link_click'; target: string }
  | { name: 'terminal_cmd'; cmd: string }
  | { name: 'persona_switch'; persona: string }
  | { name: 'story_chapter'; chapter: string }
  | { name: 'enter_os'; via: 'scroll' | 'skip' | 'button' };

type Gtag = (cmd: 'event', name: string, params: Record<string, unknown>) => void;

export function track(event: TrackEvent): void {
  try {
    const { name, ...params } = event;
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    gtag?.('event', name, params);
  } catch {
    // analytics must never break the site
  }
}
