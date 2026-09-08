import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { Work, Experience, Skills, Contact, Footer } from '@/components/Sections';
import { JsonLd } from '@/components/JsonLd';
import { personSchema, worksListSchema } from '@/lib/schema';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: { en: '/', vi: '/vi' },
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={personSchema()} />
      <JsonLd data={worksListSchema()} />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
