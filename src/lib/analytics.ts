"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// Pageview tracking
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Hook to automatically track page views
export const useGoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams]);
};