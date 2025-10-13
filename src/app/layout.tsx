
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { Inter as FontSans } from "next/font/google"
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { AppLoader } from '@/components/layout/AppLoader';
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper';
import Script from 'next/script';
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Sanjiwani Health - Video Consultations & Doctor Appointments',
  description: 'Book doctor appointments and video consultations. Get e-prescriptions and discounts on medicines.',
  icons: {
    icon: '/favicon.ico?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", fontSans.variable)}>
        <AppLoader>
          <Header />
          <main className="flex-grow flex items-start justify-center container mx-auto px-4 py-8">
            <PageTransitionWrapper>
              {children}
            </PageTransitionWrapper>
          </main>
          <Footer />
          <Toaster />
        </AppLoader>

        <Script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"></Script>
        <Script src="https://files.bpcontent.cloud/2025/10/13/18/20251013185801-Z3TVPZ4W.js" defer></Script>
      </body>
    </html>
  );
}
