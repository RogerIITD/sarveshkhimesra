export type AchievementId =
  | 'first_contact'
  | 'inspector'
  | 'server'
  | 'volley'
  | 'net_shot'
  | 'read_it_all'
  | 'connector'
  | 'shayari_open'
  | 'maafi_played'
  | 'travel_seen'
  | 'sports_seen'
  | 'turbo';

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  xp: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_contact', title: 'first_contact', description: 'You opened the terminal.',         xp: 10 },
  { id: 'inspector',     title: 'inspector',     description: 'Started typing at the prompt.',    xp: 15 },
  { id: 'server',        title: 'server',        description: 'First ball served.',               xp: 15 },
  { id: 'volley',        title: 'volley',        description: 'Kept a ball alive 10 seconds.',    xp: 25 },
  { id: 'net_shot',      title: 'net_shot',      description: 'Hit 3 targets with one serve.',    xp: 30 },
  { id: 'read_it_all',   title: 'read_it_all',   description: 'Scrolled past every section.',    xp: 20 },
  { id: 'connector',     title: 'connector',     description: 'Visited all 3 socials.',           xp: 20 },
  { id: 'shayari_open',  title: 'secret: shayari', description: 'Found the poetry command.',     xp: 50 },
  { id: 'maafi_played',  title: 'secret: maafi',   description: 'Played the song.',              xp: 50 },
  { id: 'travel_seen',   title: 'secret: travel',  description: 'Found the travel gallery.',     xp: 50 },
  { id: 'sports_seen',   title: 'secret: sports',  description: 'Found the sports gallery.',     xp: 50 },
  { id: 'turbo',         title: 'turbo',           description: 'Konami unlocked.',              xp: 75 },
];

const BY_ID: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

export function getAchievement(id: string): Achievement | undefined {
  return BY_ID[id];
}

export function totalXpFor(ids: readonly string[]): number {
  return ids.reduce((sum, id) => sum + (BY_ID[id]?.xp ?? 0), 0);
}
