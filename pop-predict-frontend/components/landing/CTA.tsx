'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wallet, ArrowRight, Shield, Zap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  const { isAuthenticated, connectWallet } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Decentralized & Secure',
      description: 'Built on Bitcoin-secured Stacks blockchain',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Settlements',
      description: 'Automated payouts upon market resolution',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      title: 'Fair Parimutuel Odds',
      description: 'Community-driven pricing, no house edge',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Achievement NFTs',
      description: 'Earn unique badges for your predictions',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:32px_32px]" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-stacks-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16">
            <Badge className="bg-stacks-orange/10 text-stacks-orange hover:bg-stacks-orange/20 text-sm px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              Join the Future of Betting
            </Badge>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-stacks-orange to-gray-900 bg-clip-text text-transparent">
              Ready to Start Winning?
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of prediction markets. Transparent, fair, and powered by blockchain.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden border-2 hover:border-stacks-orange/50 transition-all duration-300 hover:shadow-xl group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-stacks-orange/10 to-transparent rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                  <CardContent className="p-6 space-y-3 relative">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Box */}
          <Card className="relative overflow-hidden border-2 border-stacks-orange/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-stacks-orange/5 via-orange-50 to-stacks-orange/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-stacks-orange/20 rounded-full blur-3xl -mr-48 -mt-48" />
            
            <CardContent className="relative p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Start Your Prediction Journey
                  </h3>
                  <p className="text-lg text-gray-600">
                    Connect your wallet and place your first bet in seconds
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-6">
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-stacks-orange">24+</p>
                    <p className="text-sm text-gray-600">Active Markets</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-stacks-orange">1.2k+</p>
                    <p className="text-sm text-gray-600">Users</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-stacks-orange">450K</p>
                    <p className="text-sm text-gray-600">STX in Pools</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {isAuthenticated ? (
                    <>
                      <Button asChild size="lg" className="bg-stacks-orange hover:bg-stacks-orange-dark text-white shadow-lg hover:shadow-xl transition-all h-14 px-10 text-lg font-bold">
                        <Link href="/markets">
                          <TrendingUp className="h-5 w-5 mr-2" />
                          Explore Markets
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="border-2 border-stacks-orange text-stacks-orange hover:bg-stacks-orange hover:text-white h-14 px-10 text-lg font-bold">
                        <Link href="/create">
                          Create Market
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={connectWallet} size="lg" className="bg-stacks-orange hover:bg-stacks-orange-dark text-white shadow-lg hover:shadow-xl transition-all h-14 px-10 text-lg font-bold">
                        <Wallet className="h-5 w-5 mr-2" />
                        Connect Wallet
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                      <Button asChild size="lg" variant="outline" className="border-2 border-gray-300 hover:border-stacks-orange hover:bg-stacks-orange/5 h-14 px-10 text-lg font-bold">
                        <Link href="/markets">
                          Browse Markets
                        </Link>
                      </Button>
                    </>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-stacks-orange" />
                    <span>Blockchain Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-stacks-orange" />
                    <span>No Hidden Fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-stacks-orange" />
                    <span>Community Driven</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
