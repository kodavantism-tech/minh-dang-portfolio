import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GameDetail } from '@/components/GameDetail';
import { games, getGame, compactInstalls } from '@/lib/games';
import { JsonLd } from '@/components/JsonLd';
import { gameSchema } from '@/lib/schema';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};

  const title = game.displayTitle ?? game.title;
  const reach = game.installsExact
    ? `${compactInstalls(game.installsExact)} lượt tải`
    : `${game.score?.toFixed(2) ?? ''}★ trên App Store`;

  return {
    title,
    description: `${game.role.vi} trên ${title} — ${reach}. ${game.headline.vi}`,
    openGraph: {
      title,
      description: game.headline.vi,
      locale: 'vi_VN',
      images: [{ url: `/og/${game.slug}.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/og/${game.slug}.png`],
    },
    alternates: {
      canonical: `/vi/games/${game.slug}`,
      languages: { en: `/games/${game.slug}`, vi: `/vi/games/${game.slug}` },
    },
  };
}

export default async function GamePageVi({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return (
    <>
      <JsonLd data={gameSchema(game)} />
      <GameDetail slug={slug} />
    </>
  );
}
