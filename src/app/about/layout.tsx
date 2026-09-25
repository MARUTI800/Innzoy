import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — INNZOY Hotels & Resorts',
  description:
    'The architectural philosophy, honest materials, and quiet hospitality behind the INNZOY collective.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
