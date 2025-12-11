'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Sparkles, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  const { isAuthenticated, connectWallet } = useAuth();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-stacks-orange/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-stacks-orange to-stacks-orange-dark shadow-2xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          
          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Ready to Start Winning?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Join the future of prediction markets on Stacks blockchain
            </p>
          </div>
          
          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-300 text-sm md:text-base py-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-stacks-orange" />
              <span>Transparent & Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-stacks-orange" />
              <span>Instant Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-stacks-orange" />
              <span>NFT Achievements</span>
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-stacks-orange to-stacks-orange-dark hover:opacity-90 shadow-2xl text-base px-8 py-6">
                  <Link href="/markets">
                    Start Predicting
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-base px-8 py-6">
                  <Link href="/create">
                    Create a Market
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={connectWallet} size="lg" className="bg-gradient-to-r from-stacks-orange to-stacks-orange-dark hover:opacity-90 shadow-2xl text-base px-8 py-6">
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet to Start
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-base px-8 py-6">
                  <Link href="/markets">
                    Browse Markets
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Trust Message */}
          <p className="text-sm text-gray-400 pt-4">
            Built on Stacks • Secured by Bitcoin • Trusted by thousands
          </p>
        </div>
      </div>
    </section>
  );
}
