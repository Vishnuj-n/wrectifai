import { ChevronRight, Gift } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { navItems } from '@/components/home/data';
import { cn } from '@/utils/cn';

function LogoMark() {
  return (
    <div className="relative flex h-12 w-16 items-center justify-center">
      <div className="absolute inset-y-4 left-0 w-4 rounded-full bg-[#ff7f50] blur-[10px]" />
      <div className="relative h-10 w-14 rounded-[14px] bg-gradient-to-r from-[#0c47cf] via-[#1a56db] to-[#ff6b4a] shadow-[0_12px_25px_rgba(26,86,219,0.3)]">
        <div className="absolute left-2 top-3 h-3 w-8 rounded-full bg-white" />
        <div className="absolute left-1 top-4 h-4 w-3 rounded-full bg-white" />
        <div className="absolute right-1 top-3 h-4 w-4 rounded-[6px] border-2 border-white" />
        <div className="absolute bottom-1 left-2 h-4 w-4 rounded-full border-[3px] border-white bg-[#123793]" />
        <div className="absolute bottom-1 right-2 h-4 w-4 rounded-full border-[3px] border-white bg-[#123793]" />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full flex-col rounded-[24px] border border-white/70 bg-white/92 p-3 shadow-[0_14px_42px_rgba(19,42,93,0.08)] backdrop-blur xl:min-h-screen xl:rounded-none xl:border-y-0 xl:border-l-0 xl:shadow-none">
      <div className="mb-4 flex items-center gap-3 px-2 pt-2">
        <LogoMark />
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.03em] text-[#17307a]">
            WrectifAI
          </h1>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7d89b0]">
            Service. Quotes. Simplified.
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navItems.map(({ label, icon: Icon, active, chevron }) => (
          <button
            key={label}
            className={cn(
              'flex h-10 items-center gap-3 rounded-[12px] px-3 text-left text-[15px] font-medium transition-colors',
              active
                ? 'bg-[#1a56db] text-white shadow-[0_12px_24px_rgba(26,86,219,0.3)]'
                : 'text-[#17307a] hover:bg-[#f5f8ff]'
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
            <span className="flex-1">{label}</span>
            {chevron ? <ChevronRight className="h-4 w-4" /> : null}
          </button>
        ))}
      </nav>

      <Card className="mt-5 overflow-hidden bg-gradient-to-br from-[#f5f8ff] to-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 className="text-[22px] font-bold text-[#17307a]">Refer & Earn</h2>
            <p className="max-w-[140px] text-[13px] leading-5 text-[#55658f]">
              Invite your friends and earn up to ₹500
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#fff1d8] to-[#ffb74d] text-[#d97706] shadow-[0_10px_20px_rgba(255,183,77,0.35)]">
            <Gift className="h-8 w-8" />
          </div>
        </div>
        <Button className="mt-4 w-full justify-center" size="sm">
          Refer Now
        </Button>
      </Card>
    </aside>
  );
}
