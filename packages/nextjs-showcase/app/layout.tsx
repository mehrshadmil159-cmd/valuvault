import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ClientProviders } from '../components/ClientProviders'

export const metadata: Metadata = {
  title: 'ValuVault - Private KOL Round Valuation Platform',
  description: 'Privacy-preserving FDV comparison for KOL funding rounds using Fully Homomorphic Encryption',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs"
          strategy="beforeInteractive"
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
