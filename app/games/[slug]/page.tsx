import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GameDetail } from '@/components/GameDetail';
import { games, getGame, compactInstalls } from '@/lib/games';

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
    ? `${compactInstalls(game.installsExact)} downloads`
    : `${game.score?.toFixed(2) ?? ''}★ on the App Store`;

  return {
    title,
    description: `${game.role.en} on ${title} — ${reach}. ${game.headline.en}`,
    openGraph: {
      title,
      description: game.headline.en,
      images: [{ url: game.shots[0].src }],
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  if (!getGame(slug)) notFound();
  return <GameDetail slug={slug} />;
}
