import { z } from 'zod';

export const restaurantSchema = z.object({
  destinationId: z.string().min(1, 'Pick a destination'),
  name: z.string().min(2, 'Name is required').max(160),
  cuisine: z.string().optional().or(z.literal('')),
  dietary: z.string().optional().or(z.literal('')),
  lat: z.coerce.number().optional().or(z.literal('')),
  lng: z.coerce.number().optional().or(z.literal('')),
  priceLevel: z.coerce.number().int().min(1).max(4).optional().or(z.literal('')),
  rating: z.coerce.number().min(0).max(5).optional().or(z.literal('')),
  imageId: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});