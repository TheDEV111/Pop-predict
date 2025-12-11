'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Wallet, TrendingUp, Trophy, User, LogOut, BarChart3, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, connectWallet, disconnectWallet } = useAuth();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo-pop.png" 
            alt="PopPredict Logo" 
            width={40} 
            height={40}
            className="h-10 w-auto"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">PopPredict</span>
            <span className="text-xs text-gray-500">Powered by Stacks</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/markets" className="text-sm font-medium hover:text-stacks-orange transition-colors flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Markets
          </Link>
          <Link href="/portfolio" className="text-sm font-medium hover:text-stacks-orange transition-colors flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Portfolio
          </Link>
          <Link href="/achievements" className="text-sm font-medium hover:text-stacks-orange transition-colors flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Achievements
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hidden md:inline-flex">
            Testnet
          </Badge>
          
          {isAuthenticated && user ? (
            <>
              <Button asChild variant="default" className="bg-stacks-orange hover:bg-stacks-orange-dark text-white font-semibold hidden md:inline-flex">
                <Link href="/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Market
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    {formatAddress(user.address)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/portfolio" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/portfolio" className="cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      My Bets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/achievements" className="cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" />
                      Achievements
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              onClick={connectWallet} 
              className="bg-stacks-orange hover:bg-stacks-orange-dark text-black font-semibold shadow-md py-3 px-8 hover:shadow-lg transition-all rounded-lg"
              size="default"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image 
                    src="/logo-pop.png" 
                    alt="PopPredict Logo" 
                    width={32} 
                    height={32}
                  />
                  PopPredict
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-8 flex flex-col gap-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 w-fit">
                  Testnet
                </Badge>
                
                {isAuthenticated && user ? (
                  <div className="p-3 bg-stacks-orange/5 rounded-lg border border-stacks-orange/20">
                    <p className="text-xs text-gray-500 mb-1">Connected</p>
                    <p className="font-mono text-sm font-semibold">{formatAddress(user.address)}</p>
                  </div>
                ) : (
                  <Button 
                    onClick={connectWallet} 
                    className="w-full bg-stacks-orange hover:bg-stacks-orange-dark text-white font-semibold"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
                
                <div className="border-t pt-4 flex flex-col gap-2">
                  <Link href="/markets" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <TrendingUp className="h-5 w-5 text-stacks-orange" />
                    <span className="font-medium">Markets</span>
                  </Link>
                  <Link href="/portfolio" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="h-5 w-5 text-stacks-orange" />
                    <span className="font-medium">Portfolio</span>
                  </Link>
                  <Link href="/achievements" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Trophy className="h-5 w-5 text-stacks-orange" />
                    <span className="font-medium">Achievements</span>
                  </Link>
                </div>
                
                {isAuthenticated && (
                  <>
                    <Button asChild className="w-full bg-gradient-to-r from-stacks-orange to-stacks-orange-dark hover:opacity-90 text-white">
                      <Link href="/create">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Market
                      </Link>
                    </Button>
                    
                    <Button onClick={disconnectWallet} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect Wallet
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
