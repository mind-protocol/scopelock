import type { Metadata } from 'next'
import './globals.css'
import { SolanaWalletProvider } from '../../components/mission-deck/WalletProvider'

export const metadata: Metadata = {
  title: 'Mission Deck - ScopeLock',
  description: 'Internal developer dashboard for ScopeLock missions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  )
}
