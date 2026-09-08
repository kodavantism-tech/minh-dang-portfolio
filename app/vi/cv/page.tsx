import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Cv } from '@/components/Cv';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'CV',
  description: `CV một trang của ${profile.name}, lập trình viên game Unity tại Hà Nội. In hoặc lưu thành PDF ngay trên trang.`,
  alternates: {
    canonical: '/vi/cv',
    languages: { en: '/cv', vi: '/vi/cv' },
  },
};

export default function CvPageVi() {
  return (
    <>
      <Nav />
      <Cv />
    </>
  );
}
