// fonts.ts
import localFont from 'next/font/local';

export const madeTommy = localFont({
  variable: "--font-madeTommy",
  src: [
    {
      path: '../../public/fonts/MADE-Tommy-Soft-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MADE-Tommy-Soft-Medium.otf',
      weight: '500',
      style: 'normal',
    },
  ],
});
