'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/home/dashboard-shell';
import {
  careTips,
  categoryItems,
  garages,
  maintenanceItems,
  promoItems,
  seasonalDeals,
} from '@/components/home/data';
import { MainContent } from '@/components/home/main-content';
import { RightPanel } from '@/components/home/right-panel';
import { TopNavbar } from '@/components/home/top-navbar';

const heroBannerImages = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=600&q=80',
];

const modalCategoryImages = [
  '/assets/loans.png',
  '/assets/Used_cars.png',
  '/assets/Electrical.png',
  '/assets/new_ac.png',
  '/assets/isurance.svg',
  '/assets/Documentation.png',
  '/assets/ev.png',
  '/assets/subscription.png',
];

const dashboardImageSources = Array.from(
  new Set(
    [
      ...heroBannerImages,
      ...categoryItems.map((item) => item.image).filter(Boolean),
      ...maintenanceItems.map((item) => item.image).filter(Boolean),
      ...garages.map((item) => item.image).filter(Boolean),
      ...seasonalDeals.map((item) => item.image).filter(Boolean),
      ...careTips.map((item) => item.image).filter(Boolean),
      ...promoItems.map((item) => item.image).filter(Boolean),
      ...modalCategoryImages,
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    ].filter((src): src is string => Boolean(src))
  )
);

function DashboardLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fe] px-6">
      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#e3ebff] bg-white px-8 py-7 shadow-[0_24px_70px_rgba(16,35,86,0.08)]">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#d9e5ff]" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#1a56db] border-r-[#1a56db]" />
        </div>
        <div className="text-center">
          <div className="text-[16px] font-semibold text-[#17307a]">Loading dashboard</div>
          <div className="mt-1 text-[12px] text-[#6173a1]">Preparing images and sections...</div>
        </div>
      </div>
    </main>
  );
}

export function HomePage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;

        if (image.complete) {
          resolve();
        }
      });

    Promise.all(dashboardImageSources.map(preloadImage)).finally(() => {
      if (isMounted) {
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return <DashboardLoader />;
  }

  return (
    <DashboardShell header={<TopNavbar />} aside={<RightPanel />}>
      <MainContent />
    </DashboardShell>
  );
}
