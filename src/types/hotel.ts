export interface Hotel {
    hotelId: number;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    starRating: number;
    amenities: string[];
    startingPrice: number;
  }