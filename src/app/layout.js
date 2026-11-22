import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import SmoothCursor from '@/components/ux/SmoothCursor';

export const metadata = {
  title: 'Asif Billah — Software Developer & AI Researcher | General Secretary, DIU-CPC',
  description: 'Executive Portfolio of Asif Billah. Software Developer & AI Researcher at Daffodil International University, General Secretary of DIU Computer & Programming Club (DIU-CPC). Discover Campus Gig, Orivo, Brain CT vision-language research, and technical leadership.',
  keywords: [
    'Asif Billah',
    'Software Developer',
    'AI Researcher',
    'General Secretary DIU-CPC',
    'Daffodil International University',
    'Campus Gig',
    'Orivo',
    'Brain CT Vision-Language',
    'Deep Learning',
    'Next.js 14',
    'React Developer'
  ],
  authors: [{ name: 'Asif Billah', url: 'https://github.com/asifbillah' }],
  openGraph: {
    title: 'Asif Billah — Software Developer & AI Researcher',
    description: 'Executive Portfolio of Asif Billah. General Secretary of DIU Computer & Programming Club (DIU-CPC), Software Developer, and Medical AI Researcher.',
    url: 'https://github.com/asifbillah',
    siteName: 'Asif Billah Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <SmoothCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
