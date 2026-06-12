'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowLeft, CarFront, Check } from 'lucide-react';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Card } from '@/components/common/card';
import { ResultTrustFooter, resultIssues } from '@/components/ai-diagnose/diagnose-flow-shared';
import { cn } from '@/utils/cn';

export function FindingQuotesPage({ issues }: { issues?: string }) {
  const pageRootRef = useRef<HTMLDivElement>(null);
  const selectedIssueIds = (issues || 'wheel-balance,wheel-alignment')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const chosenIssues = resultIssues.filter((issue) => selectedIssueIds.includes(issue.id));

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
        <div>
          <Link
            href="/ai-diagnose-results"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#2f54d1] transition-colors hover:text-[#163cb3]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to AI Diagnose Results</span>
          </Link>
        </div>

        <div className="rounded-[24px] px-4 py-4">
          <div className="mx-auto max-w-[760px] text-center">
            <h1 className="text-[35px] font-semibold tracking-[-0.05em] text-[#173cab]">
              Finding the best garages for you...
            </h1>
            <p className="mt-2 text-[18px] text-[#4f65aa]">This will only take a few seconds</p>

            <div className="relative mx-auto mt-8 h-[210px] w-[390px] max-w-full">
              <div className="absolute inset-x-1/2 top-0 h-[124px] w-[124px] -translate-x-1/2 rounded-[26px] border border-[#cfe0ff] bg-[radial-gradient(circle_at_top,#ffffff_0%,#edf3ff_78%)] shadow-[0_16px_40px_rgba(44,92,255,0.12)]">
                <div className="absolute inset-0 rounded-[26px] border border-[#edf3ff]" />
                <div className="absolute inset-[13px] rounded-[18px] border-2 border-dashed border-[#b6cbff]" />
                <div className="absolute inset-0 flex items-center justify-center text-[58px] font-semibold tracking-[-0.08em] text-[#2551ea]">
                  AI
                </div>
              </div>
              <div className="absolute left-1/2 top-[92px] h-[95px] w-[320px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(74,121,255,0.16)_0%,rgba(74,121,255,0)_72%)] blur-md" />
              <div className="absolute left-1/2 top-[106px] -translate-x-1/2">
                <Image
                  src="/assets/mega car.png"
                  alt="Car"
                  width={260}
                  height={110}
                  className="h-auto w-[250px] object-contain drop-shadow-[0_16px_24px_rgba(28,74,188,0.18)]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 hidden md:block">
                <div className="absolute left-[20px] top-[86px] h-px w-[98px] bg-[#d7e3ff]" />
                <div className="absolute right-[20px] top-[86px] h-px w-[98px] bg-[#d7e3ff]" />
                <div className="absolute left-[48px] top-[72px] h-2 w-2 rounded-full bg-[#bfd1ff]" />
                <div className="absolute left-[82px] top-[120px] h-1.5 w-1.5 rounded-full bg-[#bfd1ff]" />
                <div className="absolute right-[54px] top-[68px] h-2 w-2 rounded-full bg-[#bfd1ff]" />
                <div className="absolute right-[86px] top-[124px] h-1.5 w-1.5 rounded-full bg-[#bfd1ff]" />
              </div>
            </div>
          </div>
        </div>

        <Card className="rounded-[22px] border-[#e7edfd] bg-white px-5 py-0 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
          <div className="grid md:grid-cols-4">
            {[
              { label: 'Analyzing your issue', complete: true, active: false },
              { label: 'Finding nearby trusted garages', complete: true, active: false },
              { label: 'Matching with best service providers', complete: false, active: true },
              { label: 'Sending your request', complete: false, active: false },
            ].map((step, index) => (
              <div
                key={step.label}
                className={cn(
                  'flex items-center gap-4 px-5 py-7',
                  index < 3 ? 'border-b border-[#eef2ff] md:border-b-0 md:border-r md:border-[#eef2ff]' : ''
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                    step.complete
                      ? 'border-[#17884f] bg-[#17884f] text-white'
                      : step.active
                        ? 'border-[#2351f6] bg-white text-[#2351f6]'
                        : 'border-[#7d85ba] bg-white text-transparent'
                  )}
                >
                  {step.complete ? <Check className="h-4 w-4 stroke-[3]" /> : <span className="h-3 w-3 rounded-full bg-current" />}
                </span>
                <div className={cn('text-[14px] font-medium', step.active ? 'text-[#1e46ce]' : 'text-[#213882]')}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[20px] border-[#e7edfd] bg-[linear-gradient(180deg,#fbfcff_0%,#ffffff_100%)] px-6 py-5 shadow-[0_12px_28px_rgba(37,73,153,0.04)]">
          <div className="flex items-center justify-center gap-3 text-center text-[15px] font-medium text-[#1f46c7]">
            <Check className="h-5 w-5 rounded-full bg-[#edf2ff] p-0.5 text-[#1f46c7]" />
            <span>We share your request only with verified and trusted garages.</span>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[254px_minmax(0,1fr)_390px]">
          <Card className="rounded-[22px] border-[#e7edfd] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <h3 className="text-[18px] font-semibold text-[#183db1]">Your Vehicle</h3>
            <div className="mt-10 flex flex-col items-center text-center">
              <span className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#f5f8ff_0%,#edf2ff_100%)] text-[#244fe5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <CarFront className="h-11 w-11" />
              </span>
              <div className="mt-8 text-[18px] font-semibold tracking-[-0.03em] text-[#193daa]">Honda City (TS07 AB 1234)</div>
              <div className="mt-5 flex items-center gap-4 text-[14px] text-[#6679a6]">
                <span>Petrol</span>
                <span className="h-1 w-1 rounded-full bg-[#8997bc]" />
                <span>2018</span>
              </div>
              <div className="mt-4 text-[14px] text-[#546a9f]">KM Driven: 58,320 km</div>
            </div>
          </Card>

          <Card className="rounded-[22px] border-[#e7edfd] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-[#183db1]">Your Selected Issues</h3>
              <span className="text-[14px] text-[#6c80b0]">({chosenIssues.length} Selected)</span>
            </div>
            <div className="mt-5 divide-y divide-[#edf2fb]">
              {chosenIssues.map((issue, index) => (
                <div key={issue.id} className="grid gap-4 py-5 md:grid-cols-[76px_minmax(0,1fr)_92px] md:items-center">
                  <div className="flex justify-center md:justify-start">
                    <Image
                      src={issue.imageSrc}
                      alt={issue.title}
                      width={72}
                      height={72}
                      className="h-[66px] w-[66px] object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-[16px] font-semibold text-[#183aa7]">
                        {index + 1}. {issue.title}
                      </div>
                      <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', issue.badgeClass)}>
                        {issue.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-7 text-[#61729f]">{issue.description}</p>
                  </div>
                  <div className="text-left md:text-center">
                    <div className="text-[40px] font-semibold tracking-[-0.05em] text-[#173ab3]">{issue.match}%</div>
                    <div className="text-[13px] text-[#7382ab]">Match</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[22px] border-[#e7edfd] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <h3 className="text-[18px] font-semibold text-[#183db1]">What&apos;s Happening?</h3>
            <div className="mt-8 space-y-7">
              {[
                { title: 'Analyzing your issue', status: 'Completed', complete: true, active: false },
                { title: 'Finding nearby trusted garages', status: 'Completed', complete: true, active: false },
                { title: 'Matching with best service providers', status: 'In progress', complete: false, active: true },
                { title: 'Sending your request', status: 'Pending', complete: false, active: false },
              ].map((step, index, array) => (
                <div key={step.title} className="relative flex gap-4">
                  {index < array.length - 1 ? (
                    <div className="absolute left-[13px] top-[32px] h-[34px] w-px border-l border-dashed border-[#d8e4ff]" />
                  ) : null}
                  <span
                    className={cn(
                      'relative z-10 mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2',
                      step.complete
                        ? 'border-[#17884f] bg-[#17884f] text-white'
                        : step.active
                          ? 'border-[#2351f6] bg-white text-[#2351f6]'
                          : 'border-[#707ab3] bg-white text-transparent'
                    )}
                  >
                    {step.complete ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <span className="h-2.5 w-2.5 rounded-full bg-current" />}
                  </span>
                  <div>
                    <div className="text-[16px] font-medium text-[#183aa7]">{step.title}</div>
                    <div
                      className={cn(
                        'mt-2 text-[14px] font-medium',
                        step.complete ? 'text-[#6477a6]' : step.active ? 'text-[#2351f6]' : 'text-[#7f8db3]'
                      )}
                    >
                      {step.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <ResultTrustFooter />
      </div>
    </DashboardShell>
  );
}

export default FindingQuotesPage;
