import 'server-only';
import type { ToolName } from './types';
import {
  handleSearchHotels,
  handleSearchActivities,
  handleSearchRestaurants,
} from './handlers';

export async function executeTool(
  name: ToolName,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case 'searchHotels':
      return handleSearchHotels({
        destinationName: String(args.destinationName ?? ''),
        maxPriceMinor:
          typeof args.maxPriceMinor === 'number' ? args.maxPriceMinor : undefined,
      });
    case 'searchActivities':
      return handleSearchActivities({
        destinationName: String(args.destinationName ?? ''),
        minAge: typeof args.minAge === 'number' ? args.minAge : undefined,
        maxPriceMinor:
          typeof args.maxPriceMinor === 'number' ? args.maxPriceMinor : undefined,
      });
    case 'searchRestaurants':
      return handleSearchRestaurants({
        destinationName: String(args.destinationName ?? ''),
        dietary: typeof args.dietary === 'string' ? args.dietary : undefined,
      });
    default:
      return { error: `Unknown tool: ${name}` };
  }
}