'use client';

import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    label: 'Active Markets',
    value: '24',
    icon: TrendingUp,
    color: 'text-stacks-orange',
    bgColor: 'bg-stacks-orange/10',
  },
  {
    label: 'Total Users',
    value: '1,234',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'STX in Pools',
    value: '450K',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    label: 'Win Rate',
    value: '89%',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export default function Stats() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
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
