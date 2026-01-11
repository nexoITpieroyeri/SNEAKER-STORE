import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Sneaker Store | Zapatillas Auténticas de las Mejores Marcas',
    template: '%s | Sneaker Store'
  },
  description: 'Compra zapatillas auténticas de Nike, Adidas, Jordan y más. Catálogo exclusivo con atención personalizada por WhatsApp.',
  keywords: ['zapatillas', 'sneakers', 'nike', 'adidas', 'jordan', 'yeezy', 'zapatos'],
  authors: [{ name: 'Sneaker Store' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'Sneaker Store',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
