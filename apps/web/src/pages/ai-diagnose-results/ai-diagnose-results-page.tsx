'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CarFront, Headset, Info, PenLine } from 'lucide-react';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Card } from '@/components/common/card';
import {
  ConfidenceGauge,
  ResultTrustFooter,
  StepRibbon,
  resultIssues,
  resultNextSteps,
  resultSummaryItems,
  sharedIcons,
} from '@/components/ai-diagnose/diagnose-flow-shared';
import { cn } from '@/utils/cn';

const { PhoneCall, Send, ShieldCheck } = sharedIcons;

export function AIDiagnoseResultsPage() {
  const router = useRouter();
  const pageRootRef = useRef<HTMLDivElement>(null);
  const [selectedIssues, setSelectedIssues] = useState<string[]>(['wheel-balance', 'wheel-alignment']);
  const [detailsText, setDetailsText] = useState('');

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

  const selectedCount = selectedIssues.length;
  const detailsTabs = ['Text Details', 'Photo', 'Video', 'Audio'];

  return (
    <DashboardShell header={<TopNavbar />}>
      <div ref={pageRootRef} className="space-y-5 pb-6 pt-1">
        <div className="space-y-2">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#2f54d1] transition-colors hover:text-[#163cb3]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
          <div>
            <h1 className="text-[37px] font-semibold tracking-[-0.045em] text-[#183db1]">
              AI Diagnoses Results
            </h1>
            <p className="mt-1 text-[16px] text-[#6176ac]">Here&apos;s what our AI found based on your input</p>
          </div>
        </div>

        <StepRibbon
          steps={[
            { id: '1', title: 'Describe Issue', description: "Tell us what's wrong", complete: true, active: false },
            { id: '2', title: 'AI Analysis', description: 'AI is analyzing the issue', complete: true, active: true },
            { id: '3', title: 'Results', description: 'Solutions & recommendations', complete: false, active: false },
          ]}
        />

        <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-5 shadow-[0_12px_28px_rgba(37,73,153,0.04)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[18px] font-semibold text-[#1f3da4]">Your Issue</div>
              <p className="mt-3 text-[14px] leading-7 text-[#3d568f]">
                Car is shaking at 70-80 kmph and I can feel vibration in the steering wheel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/ai-diagnose')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#dde6ff] px-5 text-[14px] font-medium text-[#2451e5] transition-colors hover:bg-[#f8fbff]"
            >
              <PenLine className="h-4 w-4" />
              <span>Edit Issue</span>
            </button>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_242px]">
          <div className="space-y-5">
            <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[18px] font-semibold text-[#183db1]">AI Diagnosis Summary</h2>
                <span className="rounded-full bg-[#e8f8eb] px-3 py-1 text-[11px] font-semibold text-[#25a24a]">
                  Analysis completed in 8.4s
                </span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="flex flex-col items-center rounded-[18px] bg-[radial-gradient(circle_at_top,#f8faff_0%,#ffffff_70%)] px-4 py-5 text-center">
                  <Image
                    src="/assets/mega car.png"
                    alt="Car"
                    width={230}
                    height={132}
                    className="h-auto w-[190px] object-contain"
                  />
                  <div className="mt-3 text-[15px] font-semibold text-[#26408d]">Honda City (TS07 AB 1234)</div>
                  <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-left text-[12px] text-[#6a7ca9]">
                    <span>Petrol</span>
                    <span>2018</span>
                    <span className="col-span-2">KM Driven: 58,320 km</span>
                  </div>
                </div>

                <div>
                  <p className="text-center text-[13px] text-[#687ba8] lg:text-left">
                    Our AI analysis indicates potential issues that need immediate attention.
                  </p>
                  <div className="mt-6 space-y-5">
                    {resultSummaryItems.map(({ title, heading, body, pill, pillClass, icon: Icon, iconClass }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className={cn('mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconClass)}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] text-[#7b89b0]">{title}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-3">
                            <div className="text-[16px] font-semibold text-[#2142a2]">{heading}</div>
                            <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', pillClass)}>
                              {pill}
                            </span>
                          </div>
                          <p className="mt-2 text-[13px] leading-6 text-[#60729d]">{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[18px] font-semibold text-[#183db1]">Top Possible Issues</h2>
                  <span className="text-[12px] text-[#7a88af]">(Select one or more to request quotes)</span>
                </div>
                <button type="button" className="inline-flex items-center gap-2 text-[12px] font-medium text-[#2854e9]">
                  <Info className="h-3.5 w-3.5" />
                  <span>Understand Results</span>
                </button>
              </div>

              <div className="mt-5 divide-y divide-[#edf1fb]">
                {resultIssues.map((issue, index) => {
                  const checked = selectedIssues.includes(issue.id);
                  return (
                    <div key={issue.id} className="grid gap-4 py-5 md:grid-cols-[26px_74px_minmax(0,1fr)_92px_112px] md:items-center">
                      <label className="flex items-start justify-center pt-1">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedIssues((current) =>
                              current.includes(issue.id)
                                ? current.filter((item) => item !== issue.id)
                                : [...current, issue.id]
                            )
                          }
                          className="h-4.5 w-4.5 rounded border-[#cdd9fb] text-[#2551f6] focus:ring-[#2551f6]"
                        />
                      </label>
                      <div className="flex justify-center md:justify-start">
                        <Image
                          src={issue.imageSrc}
                          alt={issue.title}
                          width={72}
                          height={72}
                          className="h-[64px] w-[64px] object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-[17px] font-semibold text-[#183aa7]">
                            {index + 1}. {issue.title}
                          </div>
                          <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', issue.badgeClass)}>
                            {issue.badge}
                          </span>
                        </div>
                        <p className="mt-2 text-[13px] leading-6 text-[#61729f]">{issue.description}</p>
                        <div className="mt-3 text-[12px] font-semibold text-[#35508d]">Risk if ignored:</div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#6b7ba7]">
                          {issue.risks.map((risk) => (
                            <span key={risk}>• {risk}</span>
                          ))}
                        </div>
                        <div className="mt-3 text-[13px] text-[#5d6f9a]">
                          <span className="font-semibold text-[#35508d]">Estimated Cost:</span>{' '}
                          <span>{issue.estimatedCost}</span>
                        </div>
                      </div>
                      <div className="text-left md:text-center">
                        <div className="text-[40px] font-semibold tracking-[-0.05em] text-[#173ab3]">{issue.match}%</div>
                        <div className="text-[13px] text-[#7382ab]">Match</div>
                      </div>
                      <div className="flex items-center md:justify-end">
                        <button
                          type="button"
                          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#dde6ff] px-4 text-[13px] font-medium text-[#2853e8] transition-colors hover:bg-[#f8fbff]"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
              <div>
                <h2 className="text-[18px] font-semibold text-[#183db1]">
                  Provide more details for selected issue(s) <span className="text-[13px] font-medium text-[#8090b7]">(Optional)</span>
                </h2>
                <p className="mt-2 text-[13px] text-[#6f7fa9]">
                  The more details you provide, the more accurate quotes you&apos;ll receive.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-8 border-b border-[#eaf0fd] px-2">
                {detailsTabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    className={cn(
                      'border-b-2 pb-3 text-[13px] font-medium transition-colors',
                      index === 0 ? 'border-[#3d68ff] text-[#244fe2]' : 'border-transparent text-[#8090b7]'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[16px] border border-[#e8eefc] bg-[#fcfdff] px-4 py-4">
                <textarea
                  value={detailsText}
                  onChange={(event) => setDetailsText(event.target.value)}
                  placeholder="Add more details about the issue..."
                  className="min-h-[96px] w-full resize-none bg-transparent text-[13px] leading-6 text-[#2b4278] outline-none placeholder:text-[#a5b1cb]"
                />
                <div className="text-right text-[11px] text-[#9babca]">{detailsText.length}/1000</div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-4 py-6 text-center shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
              <h3 className="text-[16px] font-semibold text-[#183db1]">Diagnosis Confidence</h3>
              <div className="mt-6">
                <ConfidenceGauge value={92} />
              </div>
              <p className="mx-auto mt-4 max-w-[180px] text-[13px] leading-7 text-[#6a7ca9]">
                Based on AI analysis of your issue description and thousands of similar cases.
              </p>
            </Card>

            <Card className="rounded-[22px] border-[#ffe4e2] bg-[linear-gradient(180deg,#fff8f7_0%,#fffdfd_100%)] px-4 py-6 shadow-[0_12px_30px_rgba(255,102,102,0.06)]">
              <h3 className="text-[16px] font-semibold text-[#ff4a43]">Need Immediate Help?</h3>
              <p className="mt-3 text-[13px] leading-6 text-[#8f7480]">
                Talk to our experts or get roadside assistance
              </p>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#dde6ff] bg-white text-[13px] font-medium text-[#2551e5]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Support</span>
                </button>
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#dde6ff] bg-white text-[13px] font-medium text-[#2551e5]"
                >
                  <Headset className="h-4 w-4" />
                  <span>Roadside Assistance</span>
                </button>
              </div>
              <div className="mt-4 inline-flex rounded-full bg-[#ffe8e7] px-3 py-1 text-[11px] font-semibold text-[#ff584d]">
                24/7 Available
              </div>
            </Card>

            <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-4 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
              <h3 className="text-[16px] font-semibold text-[#183db1]">Next Steps</h3>
              <div className="mt-6 space-y-6">
                {resultNextSteps.map((step) => (
                  <div key={step.step} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2f5ff] text-[12px] font-semibold text-[#3059e1]">
                      {step.step}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#2243a4]">{step.title}</div>
                      <p className="mt-1 text-[12px] leading-5 text-[#6b7ca8]">{step.body}</p>
                      <div className="mt-2 text-[11px] font-medium text-[#5b72b3]">◉ {step.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card className="rounded-[22px] border-[#e6ecfb] bg-[linear-gradient(180deg,#fbfcff_0%,#ffffff_100%)] px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f2f5ff] text-[#365ff1]">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <div className="text-[21px] font-semibold tracking-[-0.03em] text-[#173cab]">
                  Ready to get the best quotes from trusted garages?
                </div>
                <p className="mt-2 text-[14px] text-[#61729f]">
                  Send your selected issues and compare the best offers.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end">
              <button
                type="button"
                onClick={() => router.push(`/finding-quotes?issues=${selectedIssues.join(',')}`)}
                className="flex h-[56px] items-center justify-center gap-3 rounded-[14px] bg-[linear-gradient(90deg,#1a46e8_0%,#245cff_100%)] px-8 text-[18px] font-semibold text-white shadow-[0_18px_36px_rgba(37,82,235,0.22)] transition-transform hover:scale-[1.01]"
              >
                <Send className="h-5 w-5" />
                <span>Request Quotes ({selectedCount})</span>
              </button>
              <div className="text-[12px] text-[#7f8eb5]">You will receive quotes within 30 mins</div>
            </div>
          </div>
        </Card>

        <ResultTrustFooter />
      </div>
    </DashboardShell>
  );
}

export default AIDiagnoseResultsPage;
