'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users } from 'lucide-react';

interface Market {
  id: number;
  title: string;
  description: string;
  category: string;
  outcomes: string[];
  totalPool: number;
  outcomePools: number[];
  lockDate: number;
  status: 'active' | 'locked' | 'resolved';
}

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const { isAuthenticated } = useAuth();
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);

  const totalPool = market.totalPool / 1_000_000; // Convert microSTX to STX
  
  const calculateOdds = (outcomeIndex: number) => {
    if (market.outcomePools[outcomeIndex] === 0) return '—';
    const odds = (market.totalPool / market.outcomePools[outcomeIndex]).toFixed(2);
    return `${odds}x`;
  };

  const getStatusBadge = () => {
    switch (market.status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Live</Badge>;
      case 'locked':
        return <Badge variant="secondary">Locked</Badge>;
      case 'resolved':
        return <Badge variant="outline">Resolved</Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-stacks-orange/50">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="bg-stacks-orange/10 text-stacks-orange hover:bg-stacks-orange/20">
            {market.category}
          </Badge>
          {getStatusBadge()}
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-stacks-orange transition-colors">
          {market.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {market.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pool Info */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-stacks-orange/5 to-stacks-orange/10 rounded-lg border border-stacks-orange/20">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 text-stacks-orange" />
            <span>Total Pool</span>
          </div>
          <span className="font-bold text-stacks-orange text-lg">
            {totalPool.toFixed(2)} STX
          </span>
        </div>

        {/* Outcomes */}
        <div className="space-y-2">
          {market.outcomes.map((outcome, index) => {
            const pool = market.outcomePools[index] / 1_000_000;
            const percentage = market.totalPool > 0 
              ? ((market.outcomePools[index] / market.totalPool) * 100).toFixed(1)
              : 0;

            return (
              <button
                key={index}
                onClick={() => setSelectedOutcome(index)}
                disabled={!isAuthenticated || market.status !== 'active'}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedOutcome === index
                    ? 'border-stacks-orange bg-stacks-orange/5 shadow-sm'
                    : 'border-gray-200 hover:border-stacks-orange/30 hover:shadow-sm'
                } ${!isAuthenticated || market.status !== 'active' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 text-sm">{outcome}</span>
                  <span className="text-base font-bold text-stacks-orange">
                    {calculateOdds(index)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>{pool.toFixed(2)} STX</span>
                  <span>{percentage}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-stacks-orange to-stacks-orange-light h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        {/* Quick Stats */}
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Closes in 30 days</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>124 bettors</span>
          </div>
        </div>

        {/* Action Button */}
        {market.status === 'active' && (
          <>
            {isAuthenticated ? (
              <Button
                disabled={selectedOutcome === null}
                className={`w-full ${
                  selectedOutcome !== null
                    ? 'bg-gradient-to-r from-stacks-orange to-stacks-orange-dark hover:opacity-90 text-white'
                    : ''
                }`}
                variant={selectedOutcome !== null ? 'default' : 'secondary'}
              >
                {selectedOutcome !== null ? 'Place Bet' : 'Select Outcome'}
              </Button>
            ) : (
              <div className="text-center text-sm text-gray-500 py-2">
                Connect wallet to place bets
              </div>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
