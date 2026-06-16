'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Check, Clock3, PenLine, Star, CarFront } from 'lucide-react';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Card } from '@/components/common/card';
import { resultIssues } from '@/components/ai-diagnose/diagnose-flow-shared';
import { garages } from '@/components/home/data';
import { cn } from '@/utils/cn';

const RUPEE = '\u20B9';
const BULLET = '\u2022';

const issueImageFallbacks: Record<string, string> = {
  'low-engine-oil': '/assets/Engine_oil.png',
  'belt-tensioner': '/assets/Electrical.png',
  'timing-component': '/assets/repair-services.png',
  'low-refrigerant': '/assets/new_ac.png',
  'ac-filter-blower': '/assets/AC_checkup.png',
  'compressor-performance': '/assets/new_ac.png',
  'warped-rotor': '/assets/brake_rotor.png',
  'pad-deposit': '/assets/Brake care.png',
  'brake-caliper': '/assets/Brake_inspection.png',
  'air-intake-restriction': '/assets/repair-services.png',
  'fuel-delivery': '/assets/Electrical.png',
  'ignition-performance': '/assets/Parts and components.png',
  'battery-discharge': '/assets/Battery.png',
  'starter-motor': '/assets/Electrical.png',
  'fuel-ignition-no-start': '/assets/Electrical.png',
  'wheel-balance': '/assets/tyres_and_wheels.png',
  'wheel-alignment': '/assets/Tyre_rotataion.png',
  'brake-disc': '/assets/brake_rotor.png',
};

function IssuePreview({
  issueId,
  issueTitle,
  imageSrc,
}: {
  issueId: string;
  issueTitle: string;
  imageSrc: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(imageSrc);
  const [showFallbackIcon, setShowFallbackIcon] = useState(false);

  useEffect(() => {
    setCurrentSrc(imageSrc);
    setShowFallbackIcon(false);
  }, [imageSrc]);

  if (showFallbackIcon) {
    return (
      <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] bg-[radial-gradient(circle_at_top,#f6f8ff_0%,#eef2ff_100%)] text-[#2451e5]">
        <CarFront className="h-8 w-8" />
      </span>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={issueTitle}
      width={60}
      height={60}
      className="h-[60px] w-[60px] object-contain"
      onError={() => {
        const nextFallback = issueImageFallbacks[issueId];

        if (nextFallback && nextFallback !== currentSrc) {
          setCurrentSrc(nextFallback);
          return;
        }

        setShowFallbackIcon(true);
      }}
    />
  );
}


export function RequestAentPage({ issues }: { issues?: string }) {
  const pageRootRef = useRef<HTMLDivElement>(null);

  const selectedIssueIds = (issues || 'wheel-balance,wheel-alignment')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const selectedIssues = resultIssues.filter((issue) => selectedIssueIds.includes(issue.id));
  const featuredGarages = garages.slice(0, 4);

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
        <Card className="overflow-hidden rounded-[18px] border-[#dceee5] bg-[radial-gradient(circle_at_top,#fcfffd_0%,#f8fffb_62%,#f6fbff_100%)] px-6 py-[18px] shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
          <div className="flex items-center gap-4">
            <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(26,168,93,0.08)_0%,rgba(26,168,93,0)_72%)]" />
              {['#ffb800', '#7c3aed', '#1a56db', '#ff6b6b', '#0ea5e9', '#f97316', '#22c55e', '#8b5cf6'].map((color, index) => {
                const positions = [
                  'left-[4px] top-[14px]',
                  'left-[12px] top-[6px]',
                  'right-[10px] top-[8px]',
                  'right-[4px] top-[18px]',
                  'left-[8px] bottom-[12px]',
                  'left-[18px] bottom-[6px]',
                  'right-[6px] bottom-[10px]',
                  'right-[18px] bottom-[4px]',
                ];
                return (
                  <span
                    key={`${color}-${index}`}
                    className={cn('absolute h-[4px] w-[4px] rounded-full', positions[index])}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
              <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#1b8d56] text-white shadow-[0_6px_16px_rgba(27,141,86,0.18)]">
                <Check className="h-5 w-5 stroke-[3]" />
              </span>
            </div>

            <div>
              <h1 className="text-[16px] font-bold tracking-tight text-[#15834f]">Request Sent Successfully!</h1>
              <p className="mt-1 text-[13px] font-medium text-[#536795]">
                We&apos;ve shared your issue with 12 trusted garages nearby.
              </p>
            </div>
          </div>
        </Card>


        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
          <Card className="rounded-[18px] border-[#e6ecfb] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[15.5px] font-bold text-[#17307a]">Your Vehicle</h3>
              <button
                type="button"
                className="inline-flex h-[28px] items-center justify-center gap-1.5 rounded-[8px] border border-[#dbe6ff] bg-white px-2.5 text-[12px] font-bold text-[#1a56db] shadow-sm opacity-50 cursor-not-allowed"
              >
                <PenLine className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <span className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#f5f8ff_0%,#edf2ff_100%)] text-[#244fe5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <CarFront className="h-10 w-10" />
              </span>

              <div className="mt-5 text-[14.5px] font-bold text-[#17307a]">Honda City (TS07 AB 1234)</div>
              <div className="mt-2 flex items-center gap-2 text-[12.5px] text-[#5f7099]">
                <span>Petrol</span>
                <span className="text-[#8ea0c7]">{BULLET}</span>
                <span>2018</span>
              </div>
              <div className="mt-1 text-[12.5px] text-[#5f7099]">KM Driven: 58,320 km</div>
            </div>
          </Card>

          <Card className="rounded-[18px] border-[#e6ecfb] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-[15.5px] font-bold text-[#17307a]">Your Selected Issues</h3>
                <span className="text-[12.5px] font-medium text-[#5f7099]">({selectedIssues.length} Selected)</span>
              </div>
              <button
                type="button"
                className="inline-flex h-[28px] items-center justify-center gap-1.5 rounded-[8px] border border-[#dbe6ff] bg-white px-2.5 text-[12px] font-bold text-[#1a56db] shadow-sm opacity-50 cursor-not-allowed"
              >
                <PenLine className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="mt-3 divide-y divide-[#edf2fb]">
              {selectedIssues.map((issue, index) => (
                <div key={issue.id} className="grid gap-4 py-4 md:grid-cols-[64px_minmax(0,1fr)_80px] md:items-center">
                  <div className="flex justify-center md:justify-start">
                    <IssuePreview issueId={issue.id} issueTitle={issue.title} imageSrc={issue.imageSrc} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="text-[14.5px] font-bold text-[#17307a]">
                        {index + 1}. {issue.title}
                      </div>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', issue.badgeClass)}>
                        {issue.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#5f7099]">{issue.description}</p>
                  </div>

                  <div className="md:text-center">
                    <div className="text-[26px] font-bold leading-none tracking-tight text-[#17307a]">{issue.match}%</div>
                    <div className="mt-1 text-[11px] font-semibold text-[#8ea0c7]">Match</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="rounded-[18px] border-[#e6ecfb] bg-[linear-gradient(180deg,#fbfcff_0%,#ffffff_100%)] px-5 py-4 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
          <div className="flex items-center gap-4">
            <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border-2 border-[#2451f6] bg-white text-[#2451f6]">
              <Clock3 className="h-4.5 w-4.5 text-[#2451f6]" />
            </span>
            <div>
              <div className="text-[13.5px] font-bold text-[#17307a]">You will start receiving quotes shortly.</div>
              <div className="mt-1 text-[12.5px] text-[#5f7099]">Avg response time: 15 mins</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[18px] border-[#e6ecfb] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-[15.5px] font-bold text-[#17307a]">Top Garages Near You</h3>
              <p className="mt-1 text-[12.5px] text-[#5f7099]">
                These garages are receiving your request based on your selected issues and location.
              </p>
            </div>
            <div className="text-[12.5px] font-semibold text-[#2451f6]">{garages.length} garages</div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[14px] border border-[#e8eefc] bg-white">
            {featuredGarages.map((garage, index) => {
              const baseQuote = Number(garage.price.replace(/[^\d]/g, '')) || 0;
              const minQuote = baseQuote + 2350;
              const maxQuote = baseQuote + 2700;

              return (
                <div
                  key={`${garage.name}-${index}`}
                  className={cn(
                    'grid gap-4 px-4 py-4 md:grid-cols-[96px_minmax(0,1fr)_180px_120px] md:items-center',
                    index < featuredGarages.length - 1 ? 'border-b border-[#edf2fb]' : ''
                  )}
                >
                  <div className="flex justify-center md:justify-start">
                    <img
                      src={garage.image}
                      alt={garage.name}
                      className="h-[58px] w-[96px] rounded-[10px] object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-[#1d3f96]">{garage.name}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#5f7099]">
                      <span className="inline-flex items-center gap-1 text-[#1d3f96]">
                        <span>{garage.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-[#ffb800] text-[#ffb800]" />
                        <span>({garage.reviews})</span>
                      </span>
                      <span>{BULLET}</span>
                      <span>{garage.distance} away</span>
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#5f7099]">
                      {garage.badge || 'Trusted partner'} {BULLET} Verified technicians
                    </div>
                  </div>

                  <div className="text-left md:text-center">
                    <div className="text-[16px] font-bold text-[#2142a2]">
                      {RUPEE}{minQuote.toLocaleString('en-IN')} - {RUPEE}{maxQuote.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-1 text-[11px] font-medium text-[#7c8db4]">Estimated Quote</div>
                  </div>

                  <div className="flex md:justify-end">
                    <button
                      type="button"
                      className="inline-flex h-[38px] min-w-[116px] items-center justify-center rounded-[10px] border border-[#b9caff] px-4 text-[12.5px] font-semibold text-[#2451f6] transition-colors hover:bg-[#f7faff]"
                    >
                      View Quotes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {garages.length > featuredGarages.length ? (
            <div className="pt-4 text-center text-[12.5px] font-semibold text-[#2451f6]">
              + {garages.length - featuredGarages.length} more garages
            </div>
          ) : null}
        </Card>
      </div>
    </DashboardShell>
  );
}

export default RequestAentPage;
