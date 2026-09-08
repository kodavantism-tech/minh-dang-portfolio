import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Cv } from '@/components/Cv';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'CV',
  description: `One-page CV for ${profile.nameLatin}, Unity game developer in Hanoi. Print or save as PDF straight from the page.`,
  alternates: { canonical: '/cv' },
};

export default function CvPage() {
  return (
    <>
      <Nav />
      <Cv />
    </>
  );
}
