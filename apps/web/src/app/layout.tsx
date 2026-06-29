import './global.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata = {
  title: 'WrectifAI',
  description: 'WrectifAI automotive services platform',
  icons: {
    icon: '/Logo_noBg.png',
    shortcut: '/Logo_noBg.png',
    apple: '/Logo_noBg.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <head>
        <link rel="icon" href="/wrectifai_logo.png" type="image/png" />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
=======
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="bg-background text-foreground antialiased">{children}</body>
>>>>>>> Feat/new-screens
    </html>
  );
}
