import { Mulish } from "next/font/google";
import { madeTommy } from "@/lib/fonts";
import "../globals.css";
import { LoadingProvider } from "@/context/loading-context";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={clsx('dark', mulish.variable, madeTommy.variable, 'antialiased')}>
      <LoadingProvider>
        <Toaster position="top-right" />
        {children}
      </LoadingProvider>
    </body>
  );
}
