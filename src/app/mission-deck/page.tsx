// Login Page - Solana Wallet Authentication
// Maps to: docs/missions/mission-deck/AC.md F1 (User Authentication)

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { api } from '../../lib/api';
import bs58 from 'bs58';

export default function LoginPage() {
  const router = useRouter();
  const { publicKey, signMessage, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const hasTriggeredAuth = useRef(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/mission-deck/console');
    }
  }, [router]);

  // Auto-trigger authentication when wallet connects (only ONCE per connection)
  useEffect(() => {
    if (connected && publicKey && signMessage && !isLoading && !hasTriggeredAuth.current) {
      console.log('[Mission Deck] Auto-triggering wallet auth');
      hasTriggeredAuth.current = true;
      handleWalletAuth();
    } else if (!connected) {
      // Reset flag when wallet disconnects
      console.log('[Mission Deck] Wallet disconnected, resetting auth flag');
      hasTriggeredAuth.current = false;
    }
  }, [connected]); // Only depend on connected to avoid re-triggering on publicKey/signMessage ref changes

  // Handle wallet authentication
  const handleWalletAuth = async () => {
    // Prevent concurrent calls
    if (isLoading) {
      console.log('[Mission Deck] Auth already in progress, skipping');
      return;
    }

    if (!publicKey || !signMessage) {
      setError('Wallet not connected');
      return;
    }

    console.log('[Mission Deck] Starting wallet authentication');
    setError('');
    setIsLoading(true);

    try {
      // Create message to sign
      const message = `Sign this message to authenticate with Mission Deck.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);

      // Sign message with wallet
      console.log('[Mission Deck] Requesting signature from wallet...');
      const signature = await signMessage(encodedMessage);
      console.log('[Mission Deck] Signature received');
      const signatureBase58 = bs58.encode(signature);

      // Send to backend for verification
      await api.loginWithWallet(publicKey.toBase58(), signatureBase58, message);

      // Redirect to console
      router.push('/mission-deck/console');
    } catch (err) {
      console.error('Wallet auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      // Reset flag so user can try again after error
      hasTriggeredAuth.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Mission Deck</h1>
          <p className="text-muted">ScopeLock Internal Dashboard</p>
        </div>

        <div className="panel p-8">
          <h2 className="text-xl font-semibold text-text mb-6 text-center">
            Connect Wallet to Continue
          </h2>

          <div className="space-y-4">
            {/* Wallet Connect Button */}
            <div className="flex justify-center">
              <WalletMultiButton className="!bg-accent hover:!bg-accent/80" />
            </div>

            {/* Authentication Status (shown when wallet connected) */}
            {connected && (
              <div className="text-center">
                <div className="text-sm text-muted mb-2">
                  Connected: {publicKey?.toBase58().slice(0, 4)}...
                  {publicKey?.toBase58().slice(-4)}
                </div>
                {isLoading && (
                  <div className="text-accent font-medium mt-2">
                    🔐 Signing message...
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <>
                <div className="bg-danger/10 border border-danger text-danger text-sm p-3 rounded-md">
                  {error}
                </div>
                {connected && (
                  <button
                    onClick={() => {
                      setError('');
                      hasTriggeredAuth.current = false;
                      handleWalletAuth();
                    }}
                    className="btn-primary w-full"
                  >
                    Try Again
                  </button>
                )}
              </>
            )}

            {/* Info */}
            <div className="mt-6 text-center text-sm text-muted space-y-2">
              <p>
                <strong>Supported Wallets:</strong> Phantom, Solflare
              </p>
              <p className="text-xs">
                After connecting, you'll be asked to sign a message to prove wallet ownership.
                <br />
                No transaction fees required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
