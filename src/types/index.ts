export type PropertyCategory = 'hotel' | 'guesthouse';

export interface Property {
  id: string;
  name: string;
  slug: string;
  category: PropertyCategory;
  label: string;
  address: string;
  locality: string;
  mapUrl: string;
  description: string;
  heroImage: string;
  gallery: string[];
  amenities: string[];
  weekdayPrice?: string;
  weekendPrice?: string;
  startingPrice?: number;
  whatsapp?: string;
  phoneDisplay?: string;
  bookingUrl?: string;
  comingSoon?: boolean;
}

export interface Review {
  name: string;
  rating: string;
  title: string;
  text: string;
}
