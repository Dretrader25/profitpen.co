import { Roboto, Merriweather, Open_Sans } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

const openSans = Open_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-opensans',
});

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${roboto.variable} ${merriweather.variable} ${openSans.variable}`}>
      {children}
    </div>
  );
} 