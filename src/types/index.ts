export interface RoomType {
  name: string;
  price: string;
  note: string;
  size?: string;
  guests?: number;
  bed?: string;
  image?: string;
  amenities?: string[];
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  type: 'sanctuary' | 'villa' | 'pavilion' | 'chalet' | 'estate' | 'hotel' | 'penthouse';
  destinationId: string;
  region: string;
  country: string;
  coordinates: string;
  elevation?: string;
  architect?: string;
  yearOpened?: string;
  tagline: string;
  editorialSnippet: string;
  architectureDescription: string;
  materialsUsed?: string[];
  startingPrice: number;
  formattedPrice: string;
  heroImage: string;
  gallery: string[];
  features: string[];
  roomTypes: RoomType[];
  diningSnippet?: string;
  wellnessSnippet?: string;
}

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  category: 'Dining' | 'Wellness' | 'Culture' | 'Nature';
  description: string;
  image: string;
  location: string;
  duration?: string;
  highlights?: string[];
}

export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole?: string;
  coverImage: string;
  secondaryImage?: string;
  excerpt: string;
  content: string[];
  quote?: {
    text: string;
    source: string;
  };
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: string;
  tagline: string;
  description: string;
  image: string;
  propertyCount: number;
  climate?: string;
  highlights?: string[];
}
