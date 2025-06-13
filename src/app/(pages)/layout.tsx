import clsx from "clsx";
import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { madeTommy } from "@/lib/fonts";
import "../globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/header";
import { LoadingProvider } from "@/context/loading-context";
import { Toaster } from "react-hot-toast";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant Admin Panel",
  description: "Admin panel for restaurant management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={clsx('dark', mulish.variable, madeTommy.variable, 'antialiased')}>
      <LoadingProvider>
        <Toaster position="top-right" />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex flex-1 flex-col gap-4 py-6 px-4 md:py-10 md:px-7 md:gap-7">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </LoadingProvider>
    </body>
  );
}

