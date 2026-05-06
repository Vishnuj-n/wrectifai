import Link from 'next/link';
import { ChevronRight, Clock3, LayoutPanelLeft, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { DashboardShell } from '@/components/home/dashboard-shell';

function FeatureHeader({ title }: { title: string }) {
  return (
    <Card className="rounded-[20px] border border-[#dfe8ff] bg-white/90 p-4 shadow-[0_12px_30px_rgba(30,58,138,0.06)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7a8ab4]">
            WrectifAI Workspace
          </p>
          <h1 className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-[#17307a]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-[14px] bg-[#f4f7ff] px-4 py-3 text-[14px] font-medium text-[#45639d]">
          <LayoutPanelLeft className="h-4 w-4 text-[#1a56db]" />
          Sidebar stays consistent across every page.
        </div>
      </div>
    </Card>
  );
}

function FeatureAside() {
  const items = [
    {
      title: 'What changes here',
      text: 'The center content and top section are specific to each route, while the sidebar remains persistent.',
      icon: Sparkles,
    },
    {
      title: 'Next release',
      text: 'This page will receive its full workflow, list views, actions, and detail states in a later pass.',
      icon: Rocket,
    },
  ];

  return (
    <aside className="space-y-4">
      {items.map(({ title, text, icon: Icon }) => (
        <Card key={title} className="rounded-[20px] p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef4ff] text-[#1a56db] shadow-[0_10px_24px_rgba(26,86,219,0.12)]">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
            {title}
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-[#5d6f9f]">{text}</p>
        </Card>
      ))}
    </aside>
  );
}

export function FeatureComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <DashboardShell header={<FeatureHeader title={title} />} aside={<FeatureAside />}>
      <div className="flex min-h-[60vh] items-center">
        <Card className="w-full rounded-[24px] border border-[#dfe8ff] bg-[linear-gradient(135deg,#ffffff_0%,#f4f8ff_100%)] p-8 shadow-[0_18px_45px_rgba(30,58,138,0.08)] sm:p-10">
          <div className="flex max-w-2xl flex-col gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef4ff] text-[#1a56db] shadow-[0_10px_24px_rgba(26,86,219,0.14)]">
              <Clock3 className="h-7 w-7" />
            </div>

            <div className="space-y-3">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#6f82b2]">
                Feature Status
              </p>
              <h2 className="text-[34px] font-bold tracking-[-0.04em] text-[#17307a] sm:text-[42px]">
                Coming Soon
              </h2>
              <p className="max-w-xl text-[16px] leading-7 text-[#5d6f9f]">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/">
                  Back To Home
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/help-support">Request This Feature</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
