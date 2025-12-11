'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, Trophy } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Connect Your Wallet',
    description: 'Link your Stacks wallet to get started. We support all major Stacks wallets including Hiro and Leather.',
    icon: Wallet,
    color: 'bg-blue-500',
  },
  {
    number: 2,
    title: 'Choose a Market',
    description: 'Browse prediction markets across entertainment categories. Analyze the odds and select your outcome.',
    icon: TrendingUp,
    color: 'bg-stacks-orange',
  },
  {
    number: 3,
    title: 'Claim Your Winnings',
    description: 'When the market resolves, winners claim their share of the pool. Earn achievement NFTs for your predictions.',
    icon: Trophy,
    color: 'bg-purple-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge className="bg-stacks-orange/10 text-stacks-orange hover:bg-stacks-orange/20 mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Predicting in 3 Simple Steps
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of users making predictions on entertainment events
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="relative border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stacks-orange to-stacks-orange-dark text-white font-bold flex items-center justify-center shadow-lg text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} mt-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
