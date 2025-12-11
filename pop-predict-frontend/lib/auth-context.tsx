'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppConfig, UserSession } from '@stacks/connect';
import { APP_NAME, APP_ICON, NETWORK_TYPE } from '@/lib/stacks-config';

interface User {
  address: string;
  username?: string;
  profile?: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    try {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        const address = NETWORK_TYPE === 'testnet' 
          ? userData.profile.stxAddress.testnet 
          : userData.profile.stxAddress.mainnet;
        
        setUser({
          address,
          username: (userData as unknown as Record<string, unknown>).username as string | undefined,
          profile: userData.profile,
        });
        setError(null);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);
    
    try {
      // Dynamic import to ensure client-side only execution
      const connectModule = await import('@stacks/connect');
      console.log('Connect module loaded:', connectModule);
      
      // Try different possible exports
      const showConnectFn = connectModule.showConnect || 
                           connectModule.default?.showConnect || 
                           connectModule.authenticate ||
                           connectModule.default?.authenticate;
      
      if (!showConnectFn || typeof showConnectFn !== 'function') {
        console.error('No valid connect function found. Available exports:', Object.keys(connectModule));
        setError('Wallet connection not available');
        return;
      }
      
      showConnectFn({
        appDetails: {
          name: APP_NAME,
          icon: window.location.origin + APP_ICON,
        },
        redirectTo: '/',
        onFinish: () => {
          try {
            if (userSession.isUserSignedIn()) {
              const userData = userSession.loadUserData();
              const address = NETWORK_TYPE === 'testnet'
                ? userData.profile.stxAddress.testnet
                : userData.profile.stxAddress.mainnet;
              
              setUser({
                address,
                username: (userData as unknown as Record<string, unknown>).username as string | undefined,
                profile: userData.profile,
              });
              setError(null);
              
              // Store connection timestamp
              if (typeof window !== 'undefined') {
                localStorage.setItem('wallet_connected_at', Date.now().toString());
              }
              
              console.log('Wallet connected successfully:', address);
            }
          } catch (err) {
            console.error('Error after wallet connection:', err);
            setError('Failed to complete wallet connection');
          }
        },
        onCancel: () => {
          console.log('Wallet connection cancelled by user');
          setError(null);
        },
        userSession,
      });
    } catch (err) {
      console.error('Error showing connect modal:', err);
      setError('Failed to open wallet connection modal');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    try {
      userSession.signUserOut();
      setUser(null);
      setError(null);
      
      // Clear connection timestamp
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wallet_connected_at');
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
