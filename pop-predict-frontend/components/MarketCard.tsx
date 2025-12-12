'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, Trophy, ArrowUpRight, Flame } from 'lucide-react';

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
  featured?: boolean;
}

export default function MarketCard({ market, featured = false }: MarketCardProps) {
  const { isAuthenticated } = useAuth();
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState('');

  const totalPool = market.totalPool / 1_000_000;
  
  const calculateOdds = (outcomeIndex: number) => {
    if (market.outcomePools[outcomeIndex] === 0) return '—';
    const odds = (market.totalPool / market.outcomePools[outcomeIndex]).toFixed(2);
    return odds;
  };

  const calculatePercentage = (outcomeIndex: number) => {
    return market.totalPool > 0 
      ? ((market.outcomePools[outcomeIndex] / market.totalPool) * 100).toFixed(1)
      : '0';
  };

  const getStatusBadge = () => {
    switch (market.status) {
      case 'active':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
            <Flame className="h-3 w-3 mr-1" />
            Live
          </Badge>
        );
      case 'locked':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Locked</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Resolved</Badge>;
    }
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 ${
      featured 
        ? 'border-2 border-stacks-orange shadow-xl hover:shadow-2xl' 
        : 'border border-gray-200 hover:border-stacks-orange/50 hover:shadow-xl'
    }`}>
      {/* Featured Banner */}
      {featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-stacks-orange to-stacks-orange-dark text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          Featured
        </div>
      )}

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="bg-stacks-orange/10 text-stacks-orange hover:bg-stacks-orange/20 font-semibold">
            {market.category}
          </Badge>
          {getStatusBadge()}
        </div>
        
        <CardTitle className="text-base font-bold leading-tight group-hover:text-stacks-orange transition-colors line-clamp-2">
          {market.title}
        </CardTitle>
        
        <CardDescription className="text-xs line-clamp-2">
          {market.description}
        </CardDescription>

        {/* Pool Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-gradient-to-br from-stacks-orange/5 to-stacks-orange/10 rounded-lg p-2 border border-stacks-orange/20">
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <TrendingUp className="h-3 w-3 text-stacks-orange" />
              <span>Pool</span>
            </div>
            <p className="font-bold text-sm text-stacks-orange">{totalPool.toFixed(0)} STX</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <Users className="h-3 w-3" />
              <span>Bettors</span>
            </div>
            <p className="font-bold text-sm text-gray-900">124</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <Clock className="h-3 w-3" />
              <span>Ends</span>
            </div>
            <p className="font-bold text-sm text-gray-900">30d</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Betting Options */}
        <div className="space-y-2">
          {market.outcomes.map((outcome, index) => {
            const odds = calculateOdds(index);
            const percentage = calculatePercentage(index);
            const isSelected = selectedOutcome === index;

            return (
              <button
                key={index}
                onClick={() => setSelectedOutcome(index)}
                disabled={!isAuthenticated || market.status !== 'active'}
                className={`relative w-full group/option transition-all duration-200 ${
                  !isAuthenticated || market.status !== 'active' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-stacks-orange bg-gradient-to-r from-stacks-orange/10 to-stacks-orange/5 shadow-md scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-stacks-orange/40 hover:shadow-md'
                }`}>
                  {/* Background Progress */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100/50 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                  
                  {/* Content */}
                  <div className="relative p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">{outcome}</span>
                        {isSelected && (
                          <Badge className="bg-stacks-orange text-white text-[10px] px-1.5 py-0">Selected</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">{percentage}% of pool</span>
                        <span className="text-gray-300">•</span>
                        <span>{(market.outcomePools[index] / 1_000_000).toFixed(0)} STX</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-stacks-orange">{odds}</span>
                        <span className="text-xs font-semibold text-gray-500">x</span>
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Odds</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bet Input */}
        {isAuthenticated && selectedOutcome !== null && market.status === 'active' && (
          <div className="p-3 bg-gradient-to-br from-stacks-orange/5 to-orange-50 rounded-xl border-2 border-stacks-orange/20 space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Bet Amount</label>
            <div className="relative">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 pr-16 text-lg font-bold rounded-lg border-2 border-stacks-orange/30 focus:border-stacks-orange focus:ring-4 focus:ring-stacks-orange/10 outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">STX</span>
            </div>
            
            {/* Potential Win */}
            {betAmount && parseFloat(betAmount) > 0 && (
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-stacks-orange/20">
                <span className="text-xs font-medium text-gray-600">Potential Win</span>
                <span className="text-sm font-bold text-green-600">
                  {(parseFloat(betAmount) * parseFloat(calculateOdds(selectedOutcome))).toFixed(2)} STX
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          disabled={!isAuthenticated || selectedOutcome === null || market.status !== 'active' || !betAmount || parseFloat(betAmount) <= 0}
          className={`w-full h-12 text-base font-bold transition-all ${
            isAuthenticated && selectedOutcome !== null && market.status === 'active' && betAmount && parseFloat(betAmount) > 0
              ? 'bg-gradient-to-r from-stacks-orange via-orange-500 to-stacks-orange-dark hover:shadow-lg hover:scale-[1.02] text-white'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {!isAuthenticated ? (
            'Connect Wallet to Bet'
          ) : selectedOutcome === null ? (
            'Select an Outcome'
          ) : !betAmount || parseFloat(betAmount) <= 0 ? (
            'Enter Bet Amount'
          ) : (
            <span className="flex items-center gap-2">
              Place Bet
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        {!isAuthenticated && (
          <p className="text-center text-xs text-gray-500">
            Connect your wallet to start betting
          </p>
        )}
      </CardContent>
    </Card>
  );
}
