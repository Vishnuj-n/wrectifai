'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Check, Clock3, PenLine, Star } from 'lucide-react';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Card } from '@/components/common/card';
import { garages } from '@/components/home/data';
import { resultIssues } from '@/components/ai-diagnose/diagnose-flow-shared';
import { cn } from '@/utils/cn';

const featuredGarages = [
  {
    name: 'QuickPit Service Center',
    image: '/assets/garage_2_1778071173295.png',
    rating: '4.6',
    reviews: 128,
    distance: '3.1 km away',
    meta: 'Express service',
    metaSecondary: 'Certified technicians',
    quote: '₹2,850 - ₹3,200',
  },
  {
    name: 'SpeedFix Auto Care',
    image: '/assets/garage_1_1778071156220.png',
    rating: '4.5',
    reviews: 96,
    distance: '3.3 km away',
    meta: 'Free pickup & drop',
    metaSecondary: '2 Year warranty',
    quote: '₹2,950 - ₹3,450',
  },
  {
    name: 'AutoWorks Garage',
    image: '/assets/garage_3_1778071191282.png',
    rating: '4.4',
    reviews: 76,
    distance: '4.5 km away',
    meta: 'Specialized repair',
    metaSecondary: 'Genuine parts',
    quote: '₹3,100 - ₹3,800',
  },
  {
    name: 'Five Star Automotive',
    image: '/assets/garage_4_1778071611328.png',
    rating: '4.3',
    reviews: 65,
    distance: '5.2 km away',
    meta: '24/7 support',
    metaSecondary: 'Affordable pricing',
    quote: '₹3,200 - ₹3,900',
  },
];

const selectedIssues = resultIssues.filter((issue) =>
  ['wheel-balance', 'wheel-alignment'].includes(issue.id)
);

export function RequestAentPage() {
  const pageRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageScroller = (() => {
      let node = pageRootRef.current?.parentElement ?? null;
      while (node) {
        if (node.scrollHeight > node.clientHeight) return node;
        node = node.parentElement;
      }
      return null;
    })();

    window.scrollTo({ top: 0, behavior: 'auto' });
    pageScroller?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <DashboardShell header={<TopNavbar />}>
      <div ref={pageRootRef} className="space-y-5 pb-6 pt-1">
        <Card className="overflow-hidden rounded-[22px] border-[#dceee5] bg-[radial-gradient(circle_at_top,#fcfffd_0%,#f8fffb_62%,#f6fbff_100%)] px-10 py-7 shadow-[0_12px_28px_rgba(37,73,153,0.04)]">
          <div className="flex items-center gap-5">
            <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(26,168,93,0.08)_0%,rgba(26,168,93,0)_72%)]" />
              {['#ffb800', '#7c3aed', '#1a56db', '#ff6b6b', '#0ea5e9', '#f97316', '#22c55e', '#8b5cf6'].map((color, index) => {
                const positions = [
                  'left-[8px] top-[22px]',
                  'left-[20px] top-[10px]',
                  'right-[18px] top-[14px]',
                  'right-[8px] top-[28px]',
                  'left-[12px] bottom-[20px]',
                  'left-[28px] bottom-[10px]',
                  'right-[10px] bottom-[16px]',
                  'right-[28px] bottom-[8px]',
                ];
                return (
                  <span
                    key={`${color}-${index}`}
                    className={cn('absolute h-[5px] w-[5px] rounded-full', positions[index])}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#1b8d56] text-white shadow-[0_10px_24px_rgba(27,141,86,0.22)]">
                <Check className="h-8 w-8 stroke-[3]" />
              </span>
            </div>

            <div>
              <h1 className="text-[21px] font-semibold tracking-[-0.03em] text-[#15834f]">
                Request Sent Successfully!
              </h1>
              <p className="mt-2 text-[16px] text-[#536795]">
                We&apos;ve shared your issue with 12 trusted garages nearby.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
          <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-[#173cab]">Top Garages Near You</h2>
          <div className="mt-5 divide-y divide-[#edf2fb]">
            {featuredGarages.map((garage) => (
              <div key={garage.name} className="grid gap-4 py-4 md:grid-cols-[140px_minmax(0,1fr)_214px_168px] md:items-center">
                <div className="flex justify-start">
                  <Image
                    src={garage.image}
                    alt={garage.name}
                    width={130}
                    height={74}
                    className="h-[74px] w-[130px] rounded-[10px] object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-[#173cab]">{garage.name}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#6072a0]">
                    <span className="font-semibold text-[#173cab]">{garage.rating}</span>
                    <Star className="h-3.5 w-3.5 fill-[#ffb800] text-[#ffb800]" />
                    <span>({garage.reviews})</span>
                    <span>•</span>
                    <span>{garage.distance}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#62739f]">
                    <span>{garage.meta}</span>
                    <span>•</span>
                    <span>{garage.metaSecondary}</span>
                  </div>
                </div>

                <div className="md:text-center">
                  <div className="text-[18px] font-semibold tracking-[-0.02em] text-[#173cab]">{garage.quote}</div>
                  <div className="mt-1 text-[13px] text-[#7181ab]">Estimated Quote</div>
                </div>

                <div className="flex md:justify-end">
                  <button
                    type="button"
                    className="inline-flex h-[42px] w-[154px] items-center justify-center rounded-[12px] border border-[#9db3ff] bg-white text-[14px] font-medium text-[#1b4ce3] transition-colors hover:bg-[#f8fbff]"
                  >
                    View Quotes
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-center text-[14px] font-semibold text-[#173cab]">+ 8 more garages</div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
          <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[18px] font-semibold text-[#173cab]">Your Vehicle</h3>
              <button
                type="button"
                className="inline-flex h-[30px] items-center justify-center gap-1.5 rounded-[9px] border border-[#dbe5ff] px-3 text-[13px] font-medium text-[#1b4ce3]"
              >
                <PenLine className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="mt-8 flex items-center gap-8">
              <span className="flex h-[112px] w-[112px] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#f4f7ff_0%,#eef2ff_100%)] text-[#244fe5]">
                <Image
                  src="/assets/Car_Help.png"
                  alt="Vehicle"
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] object-contain"
                />
              </span>

              <div>
                <div className="text-[16px] font-semibold text-[#173cab]">Honda City (TS07 AB 1234)</div>
                <div className="mt-4 flex items-center gap-4 text-[14px] text-[#6779a6]">
                  <span>Petrol</span>
                  <span>•</span>
                  <span>2018</span>
                </div>
                <div className="mt-3 text-[14px] text-[#5e709c]">KM Driven: 58,320 km</div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-[18px] font-semibold text-[#173cab]">Your Selected Issues</h3>
                <span className="text-[14px] text-[#7383ab]">(2 Selected)</span>
              </div>
              <button
                type="button"
                className="inline-flex h-[30px] items-center justify-center gap-1.5 rounded-[9px] border border-[#dbe5ff] px-3 text-[13px] font-medium text-[#1b4ce3]"
              >
                <PenLine className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="mt-3 divide-y divide-[#edf2fb]">
              {selectedIssues.map((issue, index) => (
                <div key={issue.id} className="grid gap-4 py-5 md:grid-cols-[64px_minmax(0,1fr)_78px] md:items-start">
                  <div className="flex justify-center md:justify-start">
                    <Image
                      src={issue.imageSrc}
                      alt={issue.title}
                      width={60}
                      height={60}
                      className="h-[60px] w-[60px] object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-[15px] font-semibold text-[#173cab]">
                        {index + 1}. {issue.title}
                      </div>
                      <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', issue.badgeClass)}>
                        {issue.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-[#61729f]">{issue.description}</p>
                  </div>

                  <div className="md:text-right">
                    <div className="text-[17px] font-semibold text-[#173cab]">{issue.match}%</div>
                    <div className="mt-1 text-[13px] text-[#7181ab]">Match</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="rounded-[22px] border-[#e6ecfb] bg-[linear-gradient(180deg,#fbfcff_0%,#ffffff_100%)] px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
          <div className="flex items-center gap-4">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-2 border-[#2c59eb] text-[#2c59eb]">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[14px] font-semibold text-[#173cab]">You will start receiving quotes shortly.</div>
              <div className="mt-1 text-[14px] text-[#6f80a9]">Avg response time: 15 mins</div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

export default RequestAentPage;
