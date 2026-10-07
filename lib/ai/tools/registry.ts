import type { ToolName } from './types';

export type GroqToolDefinition = {
  type: 'function';
  function: {
    name: ToolName;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required: string[];
    };
  };
};

export const TOOL_DEFINITIONS: GroqToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'searchHotels',
      description:
        'Search the EaseWithStay hotel database for published hotels in a destination. Use this to get real hotel names, star ratings, amenities, and addresses. Do NOT invent hotel names.',
      parameters: {
        type: 'object',
        properties: {
          destinationName: {
            type: 'string',
            description:
              'The destination name to search within, e.g. "Goa, India" or "Bali".',
          },
          maxPriceMinor: {
            type: 'number',
            description:
              'Optional maximum price per night in paise (1 rupee = 100 paise). Example: 900000 = Rs 9,000.',
          },
        },
        required: ['destinationName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchActivities',
      description:
        'Search the EaseWithStay activity database for published activities in a destination. Returns names, durations, prices, minimum ages. Use this to get real bookable activities.',
      parameters: {
        type: 'object',
        properties: {
          destinationName: {
            type: 'string',
            description: 'The destination name.',
          },
          minAge: {
            type: 'number',
            description:
              'Optional. Filter to activities suitable for this age and younger. Use the youngest traveler age.',
          },
          maxPriceMinor: {
            type: 'number',
            description:
              'Optional maximum price per person in paise.',
          },
        },
        required: ['destinationName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchRestaurants',
      description:
        'Search the EaseWithStay restaurant database for published restaurants in a destination. Returns names, cuisine, dietary options, ratings. Use this for meal recommendations.',
      parameters: {
        type: 'object',
        properties: {
          destinationName: {
            type: 'string',
            description: 'The destination name.',
          },
          dietary: {
            type: 'string',
            description:
              'Optional dietary filter, e.g. "Vegetarian", "Jain", "Vegan".',
          },
        },
        required: ['destinationName'],
      },
    },
  },
];