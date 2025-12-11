'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const { isAuthenticated, connectWallet } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stacks-orange via-orange-500 to-amber-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 text-white text-sm px-4 py-1.5">
            <Zap className="h-3 w-3 mr-1 inline" />
            Powered by Stacks Blockchain
          </Badge>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Predict the Future.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-white">
              Win Big.
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join the decentralized prediction market on Stacks. Bet on entertainment outcomes, 
            earn rewards, and collect achievement NFTs. Fair, transparent, and community-driven.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="bg-white text-stacks-orange hover:bg-gray-100 shadow-xl text-base px-8 py-6">
                  <Link href="/markets">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Explore Markets
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-stacks-orange text-base px-8 py-6">
                  <Link href="/create">
                    Create Your Market
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={connectWallet} size="lg" className="bg-white text-stacks-orange hover:bg-gray-100 shadow-xl text-base px-8 py-6">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-stacks-orange text-base px-8 py-6">
                  <Link href="/markets">
                    Explore Markets
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Decentralized</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Instant Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Fair Odds</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-20">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
