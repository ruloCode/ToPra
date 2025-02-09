import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { TaskModalProvider } from "@/contexts/TaskModalContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="h-full overflow-x-hidden">
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <AuthProvider>
          <TaskProvider>
            <TaskModalProvider>
              <div className="flex min-h-screen pb-[64px] md:pb-0 relative overflow-x-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <MobileMenu />
                  <div className="main-content sidebar-expanded">
                    {children}
                  </div>
                </div>
                <BottomNav />
              </div>
              <Toaster />
            </TaskModalProvider>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
