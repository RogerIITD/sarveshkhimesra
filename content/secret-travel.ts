export type Photo = { src: string; alt: string; caption: string; place: 'india' | 'ireland' };

export const TRAVEL_INDIA: Photo[] = [
  { src: '/images/photos/trip-2026/lakefront-dusk.jpg',   alt: 'Lakefront at dusk',  caption: 'lakefront, dusk',     place: 'india' },
  { src: '/images/photos/trip-2026/courtyard-lounge.jpg', alt: 'Courtyard lounge',   caption: 'courtyard afternoon', place: 'india' },
];

export const TRAVEL_IRELAND: Photo[] = [
  { src: '/images/photos/IMG_6775.jpg',     alt: 'Dublin bridge at dusk',         caption: 'dublin, blue hour',           place: 'ireland' },
  { src: '/images/photos/IMG_8226.jpg',     alt: 'Irish village',                 caption: 'irish village vibes',         place: 'ireland' },
  { src: '/images/photos/IMG_8033.jpg',     alt: 'Sheep by a lake',               caption: 'sheep, lakes & solitude',     place: 'ireland' },
  { src: '/images/photos/IMG_8254.jpg',     alt: 'Wild Atlantic coast',           caption: 'wild atlantic coast',         place: 'ireland' },
  { src: '/images/photos/IMG_8218.jpg',     alt: "Murphy's Bar pub",              caption: "murphy's bar, cheers",        place: 'ireland' },
  { src: '/images/photos/IMG_8402.jpg',     alt: 'Thatched cottage',              caption: 'old ireland, still standing', place: 'ireland' },
  { src: '/images/photos/ireland-group.jpg', alt: 'Group photo in Ireland',       caption: 'winter squad',                place: 'ireland' },
  { src: '/images/photos/IMG_7532.jpg',     alt: 'Ice skating rink',              caption: 'ice skating vibes',           place: 'ireland' },
  { src: '/images/photos/IMG_7444.jpg',     alt: 'Rocky Irish coastline',         caption: 'where the land meets the sea',place: 'ireland' },
  { src: '/images/photos/IMG_7721.jpg',     alt: 'Irish countryside stream',      caption: 'countryside wandering',       place: 'ireland' },
  { src: '/images/photos/IMG_8870.jpg',     alt: 'Pint of Guinness',              caption: "first guinness, won't be the last", place: 'ireland' },
  { src: '/images/photos/IMG_7949.jpg',     alt: 'Seaside pier',                  caption: 'by the harbour',              place: 'ireland' },
  { src: '/images/photos/IMG_8028.jpg',     alt: 'Mountains in Ireland',          caption: 'irish mountains',             place: 'ireland' },
  { src: '/images/photos/IMG_7944.jpg',     alt: 'Ireland landscape',             caption: 'somewhere in ireland',        place: 'ireland' },
  { src: '/images/photos/IMG_2279.jpg',     alt: 'Sarvesh in Ireland',            caption: 'late night, ireland',         place: 'ireland' },
];

export const TRAVEL_ALL: Photo[] = [...TRAVEL_INDIA, ...TRAVEL_IRELAND];
