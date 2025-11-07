import type { Metadata } from 'next'
import './globals.css'
import { SolanaWalletProvider } from '../../components/mission-deck/WalletProvider'

export const metadata: Metadata = {
  title: 'Mission Deck - ScopeLock',
  description: 'Internal developer dashboard for ScopeLock missions',
}

export default function MissionDeckLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <SolanaWalletProvider>{children}</SolanaWalletProvider>
    </div>
  )
}
