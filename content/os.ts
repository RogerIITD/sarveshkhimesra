// Single source of truth for sarvesh-os: bio, apps, photos.
// Edit copy here — components only render it.

export const BIO = {
  name: 'Sarvesh Khimesra',
  title: 'AI Engineer · Office of the COO, Razorpay',
  lines: [
    "I work on business transformation in the COO's office — finding where AI can redesign how the company runs, building the tools that do it, and shaping the AI strategy behind them.",
    'Before this: UPSC prep, a lot of history and economics, and a habit of connecting dots across domains.',
  ],
  focus: ['business transformation', 'process excellence', 'ai strategy'],
  offClock: 'shayari, tennis, squash, cricket (RCB forever), and long trips with a camera.',
  headshot: { src: '/images/os/headshot.jpg', caption: 'Official headshot. Ironed the shirt for exactly this photo.' },
  casual: { src: '/images/os/headshot.jpg', caption: 'Ironed the shirt for exactly this photo.' },
};

export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', handle: 'in/sarvesh-khimesra', href: 'https://www.linkedin.com/in/sarvesh-khimesra/' },
  { id: 'twitter', label: 'X / Twitter', handle: '@SKhimesra', href: 'https://x.com/SKhimesra' },
  { id: 'instagram', label: 'Instagram', handle: '@sarveshrf', href: 'https://www.instagram.com/sarveshrf/' },
];

export const HERO = {
  src: '/images/os/landing-bg.jpg',
  alt: 'Sarvesh mid star-jump, silhouetted against the sun over the Atlantic',
  caption: 'Ireland, mid star-jump. The Atlantic did not flinch.',
};

export const WALLPAPER = {
  src: '/images/os/nebula.jpg',
  caption: 'Two developers, one galaxy projector, zero bugs found.',
};

/** `src` is the image (or a video's poster frame); `video` makes it a silent looping clip. */
// Looping clip on the opening screen.
export const GANG: Photo = {
  src: '/images/os/gang-poster.jpg',
  video: '/images/os/gang.mp4',
  alt: 'Friends laughing and fooling around on a balcony',
  caption: 'The gang, mid-bit. Nobody remembers the joke; everyone remembers the laugh.',
};

export type Photo = { src: string; alt: string; caption: string; video?: string };

export const CAMERA_ROLL: Photo[] = [
  { src: '/images/os/office-trio.jpg', alt: 'Sarvesh with two colleagues in the Razorpay office', caption: 'Office of the COO starter pack: one polo, one black shirt, one watch worth more than my laptop.' },
  { src: '/images/os/graduation.jpg', alt: 'Sarvesh in a convocation gown holding his IIT Delhi degree', caption: "IIT Delhi convocation. The gown was rented; the smile wasn't." },
  { src: '/images/os/cheers-yash.jpg', alt: 'Sarvesh and Yash clinking glasses at a bar', caption: 'Yash, my not-so-college roommate. Two glasses, one toast, zero regrets.' },
  { src: '/images/os/blr-birthday.jpg', alt: 'Friends gathered in a living room decorated for a birthday', caption: "Bengaluru culture: one balloon wall, a living room full of friends, and everyone 'leaving by 11'." },
  { src: '/images/os/krishvi-first-bday.jpg', alt: "Family photo at little Krishvi's first birthday", caption: "Little Krishvi turns one. Whole family in one frame — the real milestone." },
  { src: '/images/os/park-phone.jpg', alt: 'Sarvesh sitting on grass in a park, holding a phone', caption: 'Touching grass. Still holding the phone. Baby steps.' },
  { src: '/images/os/redbull-selfie.jpg', alt: 'Selfie with teammates and Red Bull cans', caption: 'Sprint planning. Red Bull was a key stakeholder.' },
  { src: '/images/os/green-lasers.jpg', alt: 'Two silhouettes under green laser stars', caption: 'Production is down. Vibes are up.' },
  { src: '/images/os/park-selfie.jpg', alt: 'Park selfie with two friends', caption: 'Three engineers, zero sunscreen, one shared brain cell.' },
  { src: '/images/os/navratri.jpg', alt: 'Sarvesh in a black kurta at a Navratri venue', caption: 'Garba-ready. Footwork still in beta.' },
  { src: '/images/os/navratri-duo.jpg', alt: 'Sarvesh and a friend in kurtas at a Navratri venue', caption: 'Kurta coordination: unplanned. Garba coordination: also unplanned.' },
  { src: '/images/os/polaroid-baby.jpg', alt: 'Polaroid of Sarvesh holding a baby', caption: 'Most important stakeholder I report to. Zero tolerance for delays.' },
  { src: '/images/os/sherwani-selfie.jpg', alt: 'Laughing selfie in a sherwani at a wedding', caption: 'Wedding season. Laughed at a joke I did not hear.' },
  { src: '/images/os/pink-party.jpg', alt: 'Two friends in white shirts under pink light', caption: 'The guy in the back was not part of the frame plan.' },
];

export const SPORTS: { tab: string; photos: Photo[]; note?: string }[] = [
  {
    tab: 'the wall',
    photos: [
      { src: '/images/os/desk-wall.jpg', alt: 'Desk wall with Ronaldo, Kohli and Kobe posters', caption: 'CR7, Kohli, Kobe — my 9 a.m. standup, every single day.' },
    ],
  },
  {
    tab: 'tennis',
    photos: [
      { src: '/images/os/tennis-forehand.jpg', alt: 'Sarvesh stretching for a forehand on a night court', caption: "Full-stretch forehand. My partner's face says it was going out." },
      { src: '/images/photos/tennis-duo.jpg', alt: 'Tennis with a partner', caption: 'Lost the match, won the photo.' },
    ],
  },
  {
    tab: 'squash',
    photos: [
      { src: '/images/os/squash-racket.jpg', alt: 'View of a squash court through a squash racket', caption: 'Squash: tennis, but the walls are also against you.' },
    ],
  },
  {
    tab: 'cricket',
    photos: [
      { src: '/images/os/rcb-stadium.jpg', alt: 'Sarvesh and a friend in RCB jerseys at a cricket stadium', caption: 'Matching RCB jerseys. Ee sala cup namde — we said it, we meant it, we waited.' },
    ],
  },
];

export const TRAVEL: { tab: string; photos: Photo[] }[] = [
  {
    tab: 'india',
    photos: [
      { src: '/images/photos/trip-2026/lakefront-dusk.jpg', alt: 'Lakefront at dusk', caption: 'Lakefront at dusk. Phone at 4%. Worth it.' },
      { src: '/images/photos/trip-2026/courtyard-lounge.jpg', alt: 'Courtyard lounge', caption: 'Courtyard afternoon. Out-of-office, mentally and physically.' },
      { src: '/images/photos/IMG_8028.jpg', alt: 'Sarvesh in the Himalayas', caption: 'Himachal. The mountains did not ask about my OKRs.' },
      { src: '/images/os/hill-terrace.jpg', alt: 'Friends relaxing on a hill-station terrace', caption: 'Hill-station terrace. Agenda: none. Attendance: full.' },
      { src: '/images/os/mahakal.jpg', alt: 'Friends at the Mahakal temple with tilak on their foreheads', caption: 'Mahakal darshan. Best-dressed foreheads in Ujjain.' },
    ],
  },
  {
    tab: 'ireland',
    photos: [
      { src: '/images/os/sea-rocks-poster.jpg', video: '/images/os/sea-rocks.mp4', alt: 'Sarvesh balancing on sea rocks, arms out', caption: 'Balancing on the Atlantic edge. The sea was not impressed.' },
      { src: '/images/os/ie-sunset-duo.jpg', alt: 'Sarvesh and a friend at sunset by a railing', caption: 'Sunset duo. Matching poses, unmatched jackets.' },
      { src: '/images/os/ferry-poster.jpg', video: '/images/os/ferry.mp4', alt: 'A ferry sailing across grey water', caption: 'A ferry leaving exactly on time. Took notes for the next sprint.' },
      { src: '/images/os/ie-promenade.jpg', alt: 'Seafront promenade with rocks at dusk', caption: 'Seafront promenade. Rocks: stacked. Clouds: dramatic. Me: underdressed.' },
      { src: '/images/os/ie-lake-trees.jpg', alt: 'A lake framed by bare trees and mountains', caption: 'Lake, bare trees, mountains. Ireland showing off again.' },
      { src: '/images/os/ie-valley-walk.jpg', alt: 'A walking path through a green valley', caption: 'Valley walk. The path knew where it was going; we just followed.' },
      { src: '/images/os/ie-hill-stairs.jpg', alt: 'Stone stairs climbing a grassy hill', caption: 'Stairs to nowhere in particular. Climbed them anyway.' },
      { src: '/images/os/ie-night-welcome.jpg', alt: 'Sarvesh with two people holding flowers at night', caption: 'Flowers, hugs and a freezing car park. Best welcome in Ireland.' },
      { src: '/images/photos/IMG_6775.jpg', alt: 'Dublin bridge at dusk', caption: 'Dublin, blue hour. Literally and emotionally.' },
      { src: '/images/photos/IMG_8226.jpg', alt: 'Irish village', caption: 'An Irish village with more sheep than Wi-Fi.' },
      { src: '/images/photos/IMG_8033.jpg', alt: 'Sheep by a lake', caption: 'Sheep, lake, silence. The original low-latency system.' },
      { src: '/images/photos/IMG_8254.jpg', alt: 'Wild Atlantic coast', caption: 'Wild Atlantic Way. The wind had opinions.' },
      { src: '/images/photos/IMG_8218.jpg', alt: "Murphy's Bar pub", caption: "Murphy's Bar. Research purposes only." },
      { src: '/images/photos/IMG_8402.jpg', alt: 'Thatched cottage', caption: 'Thatched roof, zero tech debt, still in production.' },
      { src: '/images/photos/ireland-group.jpg', alt: 'Group photo in Ireland', caption: 'Winter squad. Combined layers of clothing: 47.' },
      { src: '/images/photos/IMG_7532.jpg', alt: 'Ice skating rink', caption: 'Ice skating. Fell exactly as many times as expected.' },
      { src: '/images/photos/IMG_7444.jpg', alt: 'Rocky Irish coastline', caption: 'Where the land runs out of ideas and hands over to the sea.' },
      { src: '/images/photos/IMG_7721.jpg', alt: 'Irish countryside stream', caption: 'Countryside wandering. Google Maps gave up first.' },
      { src: '/images/photos/IMG_8870.jpg', alt: 'Pint of Guinness', caption: "First Guinness. Won't be the last. Won't be the best either — that was the second." },
      { src: '/images/photos/IMG_7949.jpg', alt: 'Seaside pier', caption: 'By the harbour, pretending to be in an indie film.' },
      { src: '/images/photos/IMG_7944.jpg', alt: 'Ireland landscape', caption: 'Somewhere in Ireland. The sign was in Irish.' },
      { src: '/images/photos/IMG_2279.jpg', alt: 'Sarvesh in Ireland at night', caption: 'Late night, Ireland. Body in Dublin, timezone in Bengaluru.' },
    ],
  },
];

export type AppId = 'about' | 'shayari' | 'maafi' | 'sports' | 'travel' | 'camera' | 'terminal' | 'contact';

export type AppMeta = {
  id: AppId;
  label: string; // icon label (file-ish name)
  title: string; // window title
  icon: string; // emoji glyph
  tint: string; // tile colour
  size: { w: number; h: number };
};

export const APPS: AppMeta[] = [
  { id: 'about', label: 'about.txt', title: 'about.txt — sarvesh', icon: '👤', tint: '#3b82f6', size: { w: 520, h: 490 } },
  { id: 'shayari', label: 'shayari.app', title: 'shayari.app', icon: '📜', tint: '#f59e0b', size: { w: 480, h: 470 } },
  { id: 'maafi', label: 'maafi.mp3', title: 'maafi.mp3 — now playing', icon: '🎵', tint: '#ec4899', size: { w: 420, h: 300 } },
  { id: 'sports', label: 'sports/', title: '~/sports', icon: '🏏', tint: '#22c55e', size: { w: 640, h: 520 } },
  { id: 'travel', label: 'travel/', title: '~/travel', icon: '✈️', tint: '#06b6d4', size: { w: 680, h: 540 } },
  { id: 'camera', label: 'camera-roll/', title: '~/camera-roll', icon: '📷', tint: '#a855f7', size: { w: 680, h: 540 } },
  { id: 'terminal', label: 'terminal', title: 'sarvesh@razorpay: ~', icon: '>_', tint: '#10b981', size: { w: 600, h: 440 } },
  { id: 'contact', label: 'contact', title: 'contact — say hi', icon: '✉️', tint: '#64748b', size: { w: 400, h: 320 } },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppMeta>;

// Opened automatically on a first desktop visit so the good stuff is seen.
export const FIRST_VISIT_APPS: AppId[] = ['about', 'shayari'];

// "05 — my people" in the story: friends, family, and a couple of me. L = landscape card, P = portrait.
const ALL_PHOTOS = [...CAMERA_ROLL, ...TRAVEL.flatMap((t) => t.photos)];
const pick = (file: string) => ALL_PHOTOS.find((p) => p.src.endsWith(file))!;
export const PEOPLE: { photo: Photo; shape: 'L' | 'P' }[] = [
  { photo: pick('krishvi-first-bday.jpg'), shape: 'L' },
  { photo: pick('blr-birthday.jpg'), shape: 'L' },
  { photo: pick('cheers-yash.jpg'), shape: 'P' },
  { photo: pick('park-selfie.jpg'), shape: 'L' },
  { photo: pick('redbull-selfie.jpg'), shape: 'L' },
  { photo: pick('mahakal.jpg'), shape: 'P' },
  { photo: pick('graduation.jpg'), shape: 'P' },
  { photo: pick('hill-terrace.jpg'), shape: 'P' },
  { photo: pick('sherwani-selfie.jpg'), shape: 'P' },
];
