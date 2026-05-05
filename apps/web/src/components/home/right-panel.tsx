import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/common/badge';
import { Card } from '@/components/common/card';
import { emergencyItems, overviewItems, promoItems } from '@/components/home/data';
import { cn } from '@/utils/cn';

function OverviewPanel() {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
          My Overview
        </h2>
        <button className="flex h-9 items-center gap-2 rounded-[10px] border border-[#dbe6ff] px-3 text-[13px] font-semibold text-[#17307a]">
          This Month
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {overviewItems.map(({ title, value, description, cta, icon: Icon, colors }) => (
          <div key={title} className="flex items-center gap-3 rounded-[14px] py-1">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-[0_10px_20px_rgba(20,44,112,0.18)]',
                colors
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-[#6f7ea6]">{title}</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[17px] font-bold text-[#17307a]">{value}</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6f7ea6]">{description}</p>
            </div>
            <button className="self-center text-[13px] font-semibold text-[#1a56db]">
              {cta}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EmergencyHelp() {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#ff3b30]">
            Emergency Help
          </h2>
          <p className="mt-1 text-[14px] text-[#6f7ea6]">Quick assistance, anytime</p>
        </div>
        <Badge tone="red" className="px-3 py-1.5 text-[13px]">
          24/7
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {emergencyItems.map(({ title, icon: Icon }) => (
          <button
            key={title}
            className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[14px] border border-[#edf1fb] bg-white text-center shadow-[0_8px_20px_rgba(20,44,112,0.05)] hover:bg-[#fbfdff]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7ff] text-[#1a56db]">
              <Icon className="h-5 w-5" />
            </div>
            <span className="max-w-[90px] text-[13px] font-semibold leading-4 text-[#17307a]">
              {title}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function OfferCard({
  eyebrow,
  title,
  price,
  strikePrice,
  discount,
  accent,
  fill,
  icon: Icon,
}: (typeof promoItems)[number]) {
  return (
    <Card className={cn('overflow-hidden p-0', `bg-gradient-to-r ${fill}`)}>
      <div className="grid grid-cols-[1fr_108px] items-center">
        <div className="p-4">
          <p className={cn('text-[12px] font-bold tracking-[0.02em]', accent)}>{eyebrow}</p>
          <p className="mt-2 text-[14px] leading-5 text-[#42537e]">{title}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-[15px] font-semibold text-[#17307a]">Starting</span>
            <span className="text-[30px] font-bold leading-none text-[#17307a]">
              {price}
            </span>
            <span className="pb-1 text-[14px] text-[#8a96b8] line-through">
              {strikePrice}
            </span>
          </div>
        </div>
        <div className="relative flex h-full items-center justify-center">
          <Badge tone="red" className="absolute right-3 top-3">
            {discount}
          </Badge>
          <div className="absolute inset-x-7 bottom-4 h-5 rounded-full bg-black/10 blur-lg" />
          <div className="flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/50 bg-white/55 text-[#17307a] shadow-[0_12px_24px_rgba(20,44,112,0.15)] backdrop-blur">
            <Icon className="h-11 w-11" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function OffersPanel() {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
          Offers & Promos
        </h2>
        <button className="text-[13px] font-semibold text-[#1a56db]">
          View All Offers
        </button>
      </div>
      <div className="space-y-4">
        {promoItems.map((promo) => (
          <OfferCard key={promo.eyebrow} {...promo} />
        ))}
      </div>
    </Card>
  );
}

export function RightPanel() {
  return (
    <aside className="space-y-4">
      <OverviewPanel />
      <EmergencyHelp />
      <OffersPanel />
    </aside>
  );
}
