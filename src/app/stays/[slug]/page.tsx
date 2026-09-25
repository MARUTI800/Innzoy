import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PROPERTIES, DESTINATIONS } from '@/data/innzoyData';
import PropertyDetailClient from './PropertyDetailClient';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);
  if (!property) return { title: 'Sanctuary Not Found — INNZOY' };

  return {
    title: `${property.name} — INNZOY Hotels & Resorts`,
    description: property.editorialSnippet,
    openGraph: {
      title: `${property.name} | INNZOY`,
      description: property.editorialSnippet,
      images: [{ url: property.heroImage }],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);

  if (!property) {
    notFound();
  }

  const destination = DESTINATIONS.find((d) => d.id === property.destinationId);

  // Serialize the data for the client component
  const propertyData = {
    slug: property.slug,
    name: property.name,
    heroImage: property.heroImage,
    tagline: property.tagline,
    region: property.region,
    coordinates: property.coordinates,
    elevation: property.elevation,
    editorialSnippet: property.editorialSnippet,
    architectureDescription: property.architectureDescription,
    architect: property.architect,
    yearOpened: property.yearOpened,
    materialsUsed: property.materialsUsed,
    features: property.features,
    roomTypes: property.roomTypes,
    gallery: property.gallery,
    diningSnippet: property.diningSnippet,
    wellnessSnippet: property.wellnessSnippet,
    formattedPrice: property.formattedPrice,
    destinationId: property.destinationId,
  };

  const destinationData = destination
    ? {
        id: destination.id,
        name: destination.name,
        region: destination.region,
        coordinates: destination.coordinates,
        climate: destination.climate,
      }
    : undefined;

  return (
    <PropertyDetailClient
      property={propertyData}
      destination={destinationData}
    />
  );
}
