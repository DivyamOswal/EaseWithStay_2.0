import { z } from 'zod';

export const destinationSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  country: z.string().min(2, 'Country is required').max(80),
  region: z.string().max(120).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  heroImageId: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export type DestinationInput = z.infer<typeof destinationSchema>;