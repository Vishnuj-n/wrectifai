'use client';

import Image from 'next/image';
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
      <div className="flex flex-col items-center gap-5 rounded-[24px] border border-[#e3ebff] bg-white px-9 py-8 shadow-[0_24px_70px_rgba(16,35,86,0.08)]">
        <div className="relative flex h-[86px] w-[150px] items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)]">
          <div className="absolute inset-x-5 bottom-4 h-[3px] rounded-full bg-[#d6e3ff]" />
          <div className="absolute inset-x-6 bottom-4 h-[3px] animate-pulse rounded-full bg-[linear-gradient(90deg,#1a56db_0%,#7da8ff_50%,#1a56db_100%)] opacity-75" />
          <div className="relative animate-[bounce_1.6s_ease-in-out_infinite]">
            <Image
              src="/New_small_logo.png"
              alt="WrectifAI"
              width={72}
              height={72}
              priority
              className="h-[46px] w-auto object-contain drop-shadow-[0_10px_18px_rgba(26,86,219,0.18)]"
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-[16px] font-semibold text-[#17307a]">Loading Wrectifai</div>
          <div className="mt-1 text-[12px] text-[#6173a1]">Preparing dashboard visuals...</div>
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
