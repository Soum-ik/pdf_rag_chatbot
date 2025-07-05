import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  ClerkProvider,
  SignedOut,
  SignedIn,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PDF RAG Chat - AI Document Assistant',
  description: 'Chat with your PDF documents using AI-powered RAG technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            <div className="min-h-screen flex items-center justify-center">
              <div className="glass rounded-2xl p-8 text-center text-white max-w-md mx-4">
                <h1 className="text-3xl font-bold mb-4 gradient-text">
                  PDF RAG Chat
                </h1>
                <p className="text-slate-300 mb-6">
                  Sign in to start chatting with your PDF documents using AI
                </p>
                <SignInButton>
                  <button className="gradient-primary hover:shadow-lg hover:shadow-sky-500/25 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105">
                    Sign In to Continue
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <header className="glass border-b border-slate-700/50 p-4 sticky top-0 z-50">
              <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-xl font-bold gradient-text">
                  PDF RAG Chat
                </h1>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10 border-2 border-sky-500/30',
                    },
                  }}
                />
              </div>
            </header>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
