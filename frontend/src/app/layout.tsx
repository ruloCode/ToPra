import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { TaskModalProvider } from "@/contexts/TaskModalContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "To-Pra",
  description: "Task management and productivity app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full overflow-x-hidden ${inter.variable}`} suppressHydrationWarning>
      <body className="h-full overflow-x-hidden">
        <ThemeProvider>
          <AuthProvider>
            <TaskProvider>
              <TaskModalProvider>
                <div className="flex min-h-screen pb-[64px] md:pb-0 relative overflow-x-hidden">
                  <Sidebar />
                  <div className="flex-1 overflow-auto">
                    <MobileMenu />
                    <div className="main-content">
                      {children}
                    </div>
                  </div>
                  <BottomNav />
                </div>
                <Toaster />
              </TaskModalProvider>
            </TaskProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
