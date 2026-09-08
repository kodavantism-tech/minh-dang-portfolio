import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { Work, Experience, Skills, Contact, Footer } from '@/components/Sections';
import { JsonLd } from '@/components/JsonLd';
import { personSchema, worksListSchema } from '@/lib/schema';
import { profile } from '@/content/profile';
import { totals, compactInstalls } from '@/lib/games';

/**
 * The Vietnamese home page. The components are the same ones the English tree
 * uses — they read the language from the URL (see components/Lang.tsx), so
 * there is no duplicated markup, only duplicated routing.
 */
const description = `Lập trình viên Unity tại Falcon Game Studio. Lõi gameplay, hệ thống UI và thiết kế enemy trên bốn tựa game mobile đã phát hành với ${compactInstalls(
  totals.installs
)} lượt tải.`;

export const metadata: Metadata = {
  title: `${profile.nameLatin} — Lập trình viên Game Unity`,
  description,
  openGraph: {
    title: `${profile.nameLatin} — Lập trình viên Game Unity`,
    description,
    locale: 'vi_VN',
  },
  alternates: {
    canonical: '/vi',
    languages: { en: '/', vi: '/vi' },
  },
};

export default function HomeVi() {
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
