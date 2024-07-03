import { usePathname } from 'next/navigation'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import { auth } from '@/auth'
// import { createUser } from '@/app/auth/signup/actions'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

import { cn } from '@/lib/utils'
import { Session } from '@/lib/types'
import '@/app/globals.css'

// export const metadata = {
//   metadataBase: process.env.VERCEL_URL
//     ? new URL(`https://${process.env.VERCEL_URL}`)
//     : undefined,
//   title: {
//     default: 'ImpactChat',
//     template: `ImpactChat`
//   },
//   description: 'An AI-powered ImpactChat',
//   icons: {
//     icon: '/favicon.ico',
//     shortcut: '/favicon-16x16.png',
//     apple: '/apple-touch-icon.png'
//   }
// }

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Toaster position="top-center" duration={3000} />
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            {children}
          </div>
          {/* <TailwindIndicator /> */}
        </Providers>
      </body>
    </html>
  )
}
