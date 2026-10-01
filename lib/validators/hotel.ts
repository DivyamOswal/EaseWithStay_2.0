import { z } from 'zod';

export const hotelSchema = z.object({
  destinationId: z.string().min(1, 'Pick a destination'),
  name: z.string().min(2, 'Name is required').max(160),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .max(160)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  starRating: z.coerce.number().min(0).max(5).optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  imageId: z.string().max(500).optional().or(z.literal('')),
  amenities: z.string().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export type HotelFormInput = z.infer<typeof hotelSchema>;