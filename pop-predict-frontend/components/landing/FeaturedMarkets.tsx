'use client';

import Link from 'next/link';
import MarketCard from '@/components/MarketCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Mock data - will be replaced with real contract data
const FEATURED_MARKETS = [
  {
    id: 1,
    title: 'Will Taylor Swift win Album of the Year at the 2026 Grammys?',
    description: 'Predict whether Taylor Swift will win the prestigious Album of the Year award at the upcoming Grammy Awards ceremony.',
    category: 'Music Awards',
    outcomes: ['Yes', 'No'],
    totalPool: 50_000_000,
    outcomePools: [30_000_000, 20_000_000],
    lockDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    status: 'active' as const,
  },
  {
    id: 2,
    title: 'Which movie will win Best Picture at the 2026 Oscars?',
    description: 'Place your bets on the biggest award in cinema. Who will take home the golden statue?',
    category: 'Film Awards',
    outcomes: ['Dune 3', 'Oppenheimer 2', 'Barbie 2', 'Other'],
    totalPool: 75_000_000,
    outcomePools: [25_000_000, 30_000_000, 15_000_000, 5_000_000],
    lockDate: Date.now() + 45 * 24 * 60 * 60 * 1000,
    status: 'active' as const,
  },
  {
    id: 3,
    title: 'Will Stranger Things Season 5 be released in 2025?',
    description: 'Netflix has been tight-lipped about the final season. Will it drop this year?',
    category: 'TV Shows',
    outcomes: ['Yes, in 2025', 'No, delayed to 2026+'],
    totalPool: 35_000_000,
    outcomePools: [20_000_000, 15_000_000],
    lockDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
    status: 'active' as const,
  },
];

export default function FeaturedMarkets() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Markets
          </h2>
          <p className="text-lg text-gray-600">
            Explore trending prediction markets and place your bets on entertainment outcomes
          </p>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {FEATURED_MARKETS.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-stacks-orange to-stacks-orange-dark hover:opacity-90">
            <Link href="/markets">
              View All Markets
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
