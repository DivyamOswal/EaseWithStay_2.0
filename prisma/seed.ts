import { config as loadEnv } from 'dotenv';
import path from 'node:path';

loadEnv({ path: path.resolve(process.cwd(), '.env.local') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const destinations = [
  {
    slug: 'goa',
    name: 'Goa, India',
    country: 'India',
    region: 'West coast · Konkan region',
    description:
      "North Goa's beaches, family-friendly resorts and easy flight connections make it one of the most booked short trips on EaseWithStay.",
    heroImageId: '/images/goa.jpg',
  },
  {
    slug: 'munnar',
    name: 'Munnar, Kerala',
    country: 'India',
    region: 'Western Ghats · Kerala',
    description:
      "Munnar's rolling tea plantations, cool climate, and quiet resorts make it ideal for families who want to slow down.",
    heroImageId: '/images/munnar.jpg',
  },
  {
    slug: 'jaipur',
    name: 'Jaipur, Rajasthan',
    country: 'India',
    region: 'Northwest · Rajasthan',
    description:
      'The Pink City balances heritage, food, and shopping in a compact footprint.',
    heroImageId: '/images/jaipur.jpg',
  },
  {
    slug: 'coorg',
    name: 'Coorg, Karnataka',
    country: 'India',
    region: 'Karnataka · Western Ghats',
    description:
      'Coffee estates, misty mornings, and forest trails. Coorg rewards travellers who want a slower, greener trip.',
    heroImageId: '/images/coorg.jpg',
  },
  {
    slug: 'delhi',
    name: 'Delhi, India',
    country: 'India',
    region: 'North India · NCR',
    description:
      'Mughal monuments, street food that is genuinely worth the trip, and excellent connectivity.',
    heroImageId: '/images/delhi.jpeg',
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    region: 'Deccan plateau · Telangana',
    description:
      'Biryani, Charminar, and the Golconda Fort. A strong 3–4 day city break.',
    heroImageId: '/images/hyderabad.avif',
  },
  {
    slug: 'manali',
    name: 'Manali, Himachal Pradesh',
    country: 'India',
    region: 'Himachal · Kullu valley',
    description:
      'The most family-friendly Himalayan option: apple orchards, river walks, and easy access to Solang.',
    heroImageId: '/images/manali.jpeg',
  },
  {
    slug: 'bali',
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    region: 'Southeast Asia',
    description:
      'Beach clubs, rice terraces, temples, and a hospitality culture that makes first-time international family travel easy.',
    heroImageId: '/images/goa_2.jpg',
  },
];

async function main() {
  console.log('Seeding destinations…');
  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        country: d.country,
        region: d.region,
        description: d.description,
        heroImageId: d.heroImageId,
      },
      create: {
        ...d,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
    console.log('  ✓', d.slug);
  }
  console.log(`Done. ${destinations.length} destinations seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });