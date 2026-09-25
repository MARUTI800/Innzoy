export interface RoomType {
  name: string;
  price: string;
  note: string;
  size?: string;
  guests?: number;
  bed?: string;
  image?: string;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  type: 'hotel' | 'guesthouse' | 'villa' | 'penthouse';
  chapter: string;
  isMarquee?: boolean;
  location: string;
  neighborhood: string;
  address: string;
  tagline: string;
  editorialSnippet: string;
  architectureDescription?: string;
  startingPrice: number;
  formattedPrice: string;
  heroImage: string;
  gallery: string[];
  features: string[];
  roomTypes: RoomType[];
  coordinates: string;
  diningSnippet?: string;
  wellnessSnippet?: string;
}

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  category: 'Dining' | 'Wellness' | 'Culture' | 'Nature' | 'Adventure' | 'Craft';
  description: string;
  image: string;
  location: string;
  duration?: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  coverImage: string;
  excerpt: string;
  content: string[];
}

export interface GuestReview {
  quote: string;
  guest: string;
  rating: string;
  stay: string;
  verifiedSource: string;
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
}
