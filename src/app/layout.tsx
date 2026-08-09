import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import LenisProvider from '@/components/layout/LenisProvider';

export const metadata: Metadata = {
  title: 'Education World — Learn, Explore, Grow',
  description:
    'One platform for all your education needs. Books, tuition, kids zone, study abroad, and more. Education for every age group.',
  keywords: ['education', 'books', 'tuition', 'kids', 'study abroad', 'learning'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
