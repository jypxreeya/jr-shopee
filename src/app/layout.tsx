import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JR shopee | Elegant Affiliate Products',
  description: 'Curated finds from brands and stores you love.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
