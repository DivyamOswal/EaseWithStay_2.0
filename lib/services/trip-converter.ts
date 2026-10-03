import 'server-only';
import { prisma } from '@/lib/db/client';
import type { TripPlan, TripPlanItem } from '@/lib/ai/schemas/trip-plan';

export type CreateTripFromPlanInput = {
  plan: TripPlan;
  userId: string;
  destinationId: string | null;
};

/**
 * Persist a validated AI-generated TripPlan as real Trip / TripDay /
 * ItineraryItem rows.
 *
 * Design decisions:
 * - AI time strings ("14:30") live in `metadata`, not `startTime`, because
 *   the plan is often generated before exact travel dates are known.
 * - `order` is derived from array index — the LLM does not provide it.
 * - `costMinor` is nullable on ItineraryItem; we only set it when > 0.
 */
export async function createTripFromPlan(input: CreateTripFromPlanInput) {
  const { plan, userId, destinationId } = input;

  const trip = await prisma.trip.create({
    data: {
      userId,
      destinationId,
      title: plan.title,
      currency: plan.currency,
      status: 'READY',
      budgetMinor: plan.totalCostMinor,
      days: {
        create: plan.days.map((day) => ({
          dayIndex: day.dayIndex,
          title: day.title,
          notes: day.location || null,
          items: {
            create: day.items.map((item, itemIndex) => ({
              type: mapItemType(item.type),
              source: 'AI' as const,
              title: item.title,
              notes: item.notes || null,
              order: itemIndex,
              costMinor: item.costMinor > 0 ? item.costMinor : null,
              currency: plan.currency,
              metadata: {
                startTime: item.startTime || null,
                endTime: item.endTime || null,
                aiGenerated: true,
              },
            })),
          },
        })),
      },
    },
    include: {
      days: { include: { items: true } },
    },
  });

  return trip;
}

/**
 * TripPlan item types and ItineraryItemType enum values match exactly,
 * but this guard prevents a schema drift from silently breaking things.
 */
function mapItemType(
  aiType: TripPlanItem['type'],
):
  | 'HOTEL'
  | 'FLIGHT'
  | 'ACTIVITY'
  | 'RESTAURANT'
  | 'TRANSPORT'
  | 'NOTE' {
  switch (aiType) {
    case 'HOTEL':
    case 'FLIGHT':
    case 'ACTIVITY':
    case 'RESTAURANT':
    case 'TRANSPORT':
    case 'NOTE':
      return aiType;
    default:
      return 'NOTE';
  }
}