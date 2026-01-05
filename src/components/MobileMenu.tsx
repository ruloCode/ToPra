"use client";
import { Menu, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/components/AuthProvider';

export function MobileMenu() {
  const { signOut, user } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative bg-white dark:bg-zinc-900 dark:text-white shadow-md">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-white dark:bg-zinc-900 dark:text-white shadow-lg rounded-lg border border-border dark:border-[#28282F]"
          sideOffset={5}
        >
          <DropdownMenuItem asChild className="dark:hover:bg-accent/10">
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 dark:hover:bg-accent/10">
            <LogOut className="h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}