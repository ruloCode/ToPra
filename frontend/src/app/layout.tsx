import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { TaskModalProvider } from "@/contexts/TaskModalContext";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <TaskModalProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 overflow-auto">
                <div className="main-content sidebar-expanded">
                  {children}
                </div>
              </div>
              <BottomNav />
            </div>
            <Toaster />
          </TaskModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
