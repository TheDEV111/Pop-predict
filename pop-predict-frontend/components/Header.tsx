'use client';

import Link from 'next/link';
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
import { 
  Menu, 
  TrendingUp, 
  Trophy, 
  Wallet, 
  PlusCircle,
  LogOut,
  User,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, connectWallet, disconnectWallet } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link 
        href="/markets" 
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-stacks-orange transition-colors"
      >
        <TrendingUp className="h-4 w-4" />
        <span>Markets</span>
      </Link>
      <Link 
        href="/portfolio" 
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-stacks-orange transition-colors"
      >
        <BarChart3 className="h-4 w-4" />
        <span>Portfolio</span>
      </Link>
      <Link 
        href="/achievements" 
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-stacks-orange transition-colors"
      >
        <Trophy className="h-4 w-4" />
        <span>Achievements</span>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-stacks-orange to-stacks-orange-light rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-stacks-orange to-stacks-orange-dark rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-stacks-orange to-stacks-orange-dark bg-clip-text text-transparent">
              PopPredict
            </span>
            <span className="text-[10px] text-gray-500 -mt-1">Powered by Stacks</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Create Market Button - Hidden on mobile */}
          {isAuthenticated && (
            <Link href="/create" className="hidden sm:block">
              <Button 
                variant="outline" 
                size="sm"
                className="border-stacks-orange text-stacks-orange hover:bg-stacks-orange/10"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Market
              </Button>
            </Link>
          )}

          {/* Wallet Connection */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-stacks-orange hover:bg-stacks-orange/10"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline font-mono text-xs">
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                  <p className="text-xs font-mono break-all bg-gray-50 p-2 rounded border">
                    {user.address}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/portfolio" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/achievements" className="cursor-pointer">
                    <Trophy className="mr-2 h-4 w-4" />
                    Achievements
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={disconnectWallet}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={connectWallet}
              className="bg-gradient-to-r from-stacks-orange to-stacks-orange-dark hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-stacks-orange to-stacks-orange-dark rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  PopPredict
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Link 
                  href="/markets" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stacks-orange/10 transition-colors"
                >
                  <TrendingUp className="h-5 w-5 text-stacks-orange" />
                  <span className="font-medium">Markets</span>
                </Link>
                <Link 
                  href="/portfolio" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stacks-orange/10 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-stacks-orange" />
                  <span className="font-medium">Portfolio</span>
                </Link>
                <Link 
                  href="/achievements" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stacks-orange/10 transition-colors"
                >
                  <Trophy className="h-5 w-5 text-stacks-orange" />
                  <span className="font-medium">Achievements</span>
                </Link>
                {isAuthenticated && (
                  <Link 
                    href="/create" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-stacks-orange/10 border-2 border-stacks-orange/20 hover:border-stacks-orange/40 transition-colors"
                  >
                    <PlusCircle className="h-5 w-5 text-stacks-orange" />
                    <span className="font-medium text-stacks-orange">Create Market</span>
                  </Link>
                )}
                <div className="mt-4 pt-4 border-t">
                  <Badge variant="secondary" className="w-full justify-center">
                    Testnet Mode
                  </Badge>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
