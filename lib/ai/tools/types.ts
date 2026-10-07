export type ToolName =
  | 'searchHotels'
  | 'searchActivities'
  | 'searchRestaurants';

export type HotelResult = {
  id: string;
  name: string;
  starRating: number | null;
  amenities: string[];
  address: string | null;
  description: string | null;
};

export type ActivityResult = {
  id: string;
  name: string;
  durationMin: number | null;
  priceMinor: number;
  minAge: number | null;
  tags: string[];
  description: string | null;
};

export type RestaurantResult = {
  id: string;
  name: string;
  cuisine: string[];
  dietary: string[];
  rating: number | null;
  priceLevel: number | null;
};

export type ToolResult =
  | { tool: 'searchHotels'; results: HotelResult[] }
  | { tool: 'searchActivities'; results: ActivityResult[] }
  | { tool: 'searchRestaurants'; results: RestaurantResult[] };