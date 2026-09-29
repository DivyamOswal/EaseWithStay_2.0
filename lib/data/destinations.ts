export type Destination = {
  slug: string;
  name: string;
  country: string;
  region: string;
  img: string;
  price: string;
  tags: string[];
  bestTime: string;
  budget: string;
  flightTime: string;
  overview: string;
  goodFor: string[];
  activities: string;
};

export const destinations: Destination[] = [
  {
    slug: 'goa',
    name: 'Goa, India',
    country: 'India',
    region: 'West coast · Konkan region',
    img: '/images/goa.jpg',
    price: 'From ₹21,000 / person',
    tags: ['Beaches', 'Family-friendly', 'Budget'],
    bestTime: 'Nov – Feb',
    budget: '₹18K–24K / person',
    flightTime: '~1h 20m from Mumbai',
    overview:
      "North Goa's beaches, family-friendly resorts and easy flight connections make it one of the most booked short trips on EaseWithStay — especially with kids, given the number of shallow, calm beaches near Calangute and Candolim.",
    goodFor: ['Family trips', 'Beaches', 'Short weekends', 'Food'],
    activities:
      'Dolphin-watching cruises, spice plantation tours, water sports at Baga, sunset dinner cruises, and heritage walks through Old Goa.',
  },
  {
    slug: 'munnar',
    name: 'Munnar, Kerala',
    country: 'India',
    region: 'Western Ghats · Kerala',
    img: '/images/munnar.jpg',
    price: 'From ₹14,000 / person',
    tags: ['Mountains', 'Family-friendly', 'Budget'],
    bestTime: 'Sep – Mar',
    budget: '₹12K–16K / person',
    flightTime: '~1h 30m from Bengaluru',
    overview:
      "Munnar's rolling tea plantations, cool climate, and quiet resorts make it ideal for families who want to slow down. Flight and road connectivity from Kochi is simple, and the pace is a world away from a beach holiday.",
    goodFor: ['Couples', 'Family trips', 'Nature', 'Slow travel'],
    activities:
      'Tea plantation walks, Eravikulam National Park, Mattupetty Dam, Attukad waterfalls, and spice garden tours.',
  },
  {
    slug: 'jaipur',
    name: 'Jaipur, Rajasthan',
    country: 'India',
    region: 'Northwest · Rajasthan',
    img: '/images/jaipur.jpg',
    price: 'From ₹18,500 / person',
    tags: ['Family-friendly', 'Food'],
    bestTime: 'Oct – Mar',
    budget: '₹16K–22K / person',
    flightTime: '~1h 10m from Delhi',
    overview:
      "The Pink City balances heritage, food, and shopping in a compact footprint. Fort visits, markets, and easy day trips to Amber make it a strong long-weekend choice for families and first-time India travellers.",
    goodFor: ['Family trips', 'History', 'Food', 'Shopping'],
    activities:
      'Amber Fort, Hawa Mahal, City Palace, Johari Bazaar, and a hot-air balloon sunrise over the Aravallis.',
  },
  {
    slug: 'coorg',
    name: 'Coorg, Karnataka',
    country: 'India',
    region: 'Karnataka · Western Ghats',
    img: '/images/coorg.jpg',
    price: 'From ₹12,800 / person',
    tags: ['Mountains', 'Budget', 'Family-friendly'],
    bestTime: 'Oct – Mar',
    budget: '₹11K–15K / person',
    flightTime: '~1h from Bengaluru (then 5h drive)',
    overview:
      'Coffee estates, misty mornings, and forest trails. Coorg rewards travellers who want a slower, greener trip with less itinerary pressure and more walking.',
    goodFor: ['Couples', 'Nature', 'Slow travel', 'Food'],
    activities:
      'Coffee estate tours, Abbey Falls, Dubare Elephant Camp, Raja\'s Seat viewpoint, and Mandalpatti jeep trails.',
  },
  {
    slug: 'delhi',
    name: 'Delhi, India',
    country: 'India',
    region: 'North India · NCR',
    img: '/images/delhi.jpeg',
    price: 'From ₹16,500 / person',
    tags: ['Family-friendly', 'Food'],
    bestTime: 'Oct – Mar',
    budget: '₹14K–20K / person',
    flightTime: 'Major hub · direct flights nationwide',
    overview:
      "Delhi is a base, not a stopover. Mughal monuments, street food that is genuinely worth the trip, and excellent connectivity make it a strong anchor for a longer north-India itinerary.",
    goodFor: ['Family trips', 'History', 'Food', 'Shopping'],
    activities:
      'Red Fort, Qutub Minar, Humayun\'s Tomb, Chandni Chowk food walk, and a day trip to Agra.',
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    region: 'Deccan plateau · Telangana',
    img: '/images/hyderabad.avif',
    price: 'From ₹15,000 / person',
    tags: ['Family-friendly', 'Food'],
    bestTime: 'Oct – Feb',
    budget: '₹13K–18K / person',
    flightTime: '~1h 20m from Mumbai',
    overview:
      "Biryani, Charminar, and the Golconda Fort. Hyderabad balances a strong historic core with modern hotels and excellent food. It works well as a 3–4 day city break.",
    goodFor: ['Family trips', 'Food', 'History', 'Short weekends'],
    activities:
      'Charminar, Golconda Fort, Chowmahalla Palace, Ramoji Film City, and a Laad Bazaar bangle shopping walk.',
  },
  {
    slug: 'manali',
    name: 'Manali, Himachal Pradesh',
    country: 'India',
    region: 'Himachal · Kullu valley',
    img: '/images/manali.jpeg',
    price: 'From ₹15,200 / person',
    tags: ['Mountains', 'Family-friendly'],
    bestTime: 'Mar – Jun, Sep – Nov',
    budget: '₹13K–18K / person',
    flightTime: '~1h 20m from Delhi (then 1h drive)',
    overview:
      'Manali is the most family-friendly Himalayan option: apple orchards, river walks, and easy access to Solang and Rohtang without needing high-altitude fitness.',
    goodFor: ['Family trips', 'Mountains', 'Adventure', 'Honeymoon'],
    activities:
      'Solang Valley, Hadimba Temple, Old Manali cafés, river rafting in Kullu, and Rohtang Pass day trips.',
  },
  {
    slug: 'bali',
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    region: 'Southeast Asia',
    img: '/images/goa_2.jpg',
    price: 'From ₹52,000 / person',
    tags: ['Beaches', 'International', 'Family-friendly'],
    bestTime: 'Apr – Oct',
    budget: '₹45K–65K / person',
    flightTime: '~7h 30m from Mumbai (1 stop)',
    overview:
      'Bali is the most popular international short-haul from India. Beach clubs, rice terraces, temples, and a hospitality culture that makes first-time international family travel easy.',
    goodFor: ['Family trips', 'Beaches', 'Honeymoon', 'Wellness'],
    activities:
      'Ubud rice terraces, Uluwatu Temple, Nusa Penida day trip, and a Mount Batur sunrise trek.',
  },
];

export const allTags = [
  'All',
  'Beaches',
  'Mountains',
  'Family-friendly',
  'Budget',
  'International',
  'Food',
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}