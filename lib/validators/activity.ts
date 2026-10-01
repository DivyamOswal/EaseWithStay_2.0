import { z } from 'zod';

export const activitySchema = z.object({
  destinationId: z.string().min(1, 'Pick a destination'),
  name: z.string().min(2, 'Name is required').max(160),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .max(160)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  description: z.string().max(2000).optional().or(z.literal('')),
  durationMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
  priceMinor: z.coerce.number().int().min(0, 'Price is required'),
  minAge: z.coerce.number().int().min(0).max(18).optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  imageId: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});