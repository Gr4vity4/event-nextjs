import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/components/ReduxProvider';

export const metadata: Metadata = {
  title: 'Event Registration',
  description: 'Event registrations application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
