'use client';

import Link from 'next/link';
import MarketCard from '@/components/MarketCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

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
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-white via-orange-50/30 to-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:32px_32px]" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-stacks-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-14 space-y-6">
          <Badge className="bg-stacks-orange/10 text-stacks-orange hover:bg-stacks-orange/20 text-sm px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-2 inline" />
            Trending Now
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-stacks-orange to-gray-900 bg-clip-text text-transparent">
            Featured Markets
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Join the hottest prediction markets and bet on entertainment outcomes
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">24 Active Markets</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Sparkles className="h-4 w-4 text-stacks-orange" />
              <span className="font-medium">450K STX in Pools</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="h-4 w-4 text-stacks-orange" />
              <span className="font-medium">1.2K+ Active Bettors</span>
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {FEATURED_MARKETS.map((market, index) => (
            <div key={market.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}>
              <MarketCard market={market} featured={index === 0} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-stacks-orange hover:bg-stacks-orange-dark text-white shadow-lg hover:shadow-xl transition-all h-14 px-10 text-lg font-bold group">
            <Link href="/markets">
              View All Markets
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
