import { z } from 'zod';

export const tripPlanItemSchema = z.object({
  type: z.enum(['HOTEL', 'FLIGHT', 'ACTIVITY', 'RESTAURANT', 'TRANSPORT', 'NOTE']),
  title: z.string().min(1).max(200),
  notes: z.string().max(600).optional().default(''),
  startTime: z.string().max(20).optional().default(''),
  endTime: z.string().max(20).optional().default(''),
  costMinor: z.number().int().min(0).optional().default(0),
});

export const tripPlanDaySchema = z.object({
  dayIndex: z.number().int().min(0),
  title: z.string().min(1).max(120),
  location: z.string().max(120).optional().default(''),
  items: z.array(tripPlanItemSchema).min(1).max(10),
});

export const tripPlanSchema = z.object({
  title: z.string().min(2).max(120),
  destination: z.string().min(2).max(120),
  summary: z.string().min(10).max(800),
  currency: z.string().length(3).default('INR'),
  totalCostMinor: z.number().int().min(0).default(0),
  days: z.array(tripPlanDaySchema).min(1).max(21),
  tips: z.array(z.string().max(300)).max(8).default([]),
});

export type TripPlanItem = z.infer<typeof tripPlanItemSchema>;
export type TripPlanDay = z.infer<typeof tripPlanDaySchema>;
export type TripPlan = z.infer<typeof tripPlanSchema>;