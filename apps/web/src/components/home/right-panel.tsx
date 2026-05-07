import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/common/card';
import { emergencyItems, overviewItems, promoItems } from '@/components/home/data';
import { cn } from '@/utils/cn';

function OverviewPanel() {
  return (
    <Card id="overview" className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
          My Overview
        </h2>
        <div className="flex h-9 items-center gap-2 rounded-[10px] border border-[#dbe6ff] px-3 text-[13px] font-semibold text-[#17307a]">
          This Month
          <ChevronDown className="h-4 w-4" />
        </div>
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
            <span className="self-center text-[13px] font-semibold text-[#1a56db]">{cta}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EmergencyHelp() {
  return (
    <Card id="emergency" className="p-4 border-[#fff0f0] bg-[#fffbfa]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#ff3b30]">
            Emergency Help
          </h2>
          <p className="mt-1 text-[13px] font-medium text-[#6f7ea6]">Quick assistance, anytime</p>
        </div>
        <div className="rounded-full bg-[#ffeeee] px-3 py-1 text-[13px] font-bold text-[#ff3b30]">
          24/7
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {emergencyItems.map(({ title, icon: Icon }) => (
          <div
            key={title}
            className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-[14px] border border-[#f0f4ff] bg-white px-1 pt-2 text-center shadow-[0_4px_12px_rgba(20,44,112,0.03)]"
          >
            <div className="text-[#1a56db]">
              <Icon className="h-7 w-7 stroke-[1.5]" />
            </div>
            <span className="max-w-[64px] pb-2 text-[12px] font-semibold leading-tight text-[#17307a]">
              {title}
            </span>
          </div>
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
  image,
}: Omit<(typeof promoItems)[number], 'href'>) {
  const isGreen = accent.includes('238453');
  const isRed = accent.includes('ff3b30');
  
  return (
    <Card className={cn('overflow-hidden border-0 p-0 shadow-none', `bg-gradient-to-r ${fill}`)}>
      <div className="grid min-h-[138px] grid-cols-[1.18fr_0.82fr] items-center">
        <div className="p-4 pr-0">
          <p className={cn('text-[13px] font-bold uppercase tracking-[0.02em]', accent)}>{eyebrow}</p>
          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#42537e]">{title}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={cn('text-[13px] font-bold', accent)}>Starting</span>
            <span className={cn('text-[17px] font-bold leading-none', accent)}>{price}</span>
            <span className="text-[12px] font-medium text-[#8a96b8] line-through">{strikePrice}</span>
            {isGreen && (
              <div className="rounded-full bg-[#e6f4ea] px-2 py-0.5 text-[11px] font-bold text-[#238453]">
                {discount}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex h-full min-h-[138px] items-center justify-center">
          {!isGreen && (
            <div
              className={cn(
                'absolute right-3 top-3 z-10 flex flex-col items-center justify-center rounded-[8px] px-2 py-1 text-[12px] font-bold leading-3 text-white shadow-md',
                isRed ? 'bg-[#ff3b30]' : 'bg-[#1a56db]'
              )}
            >
              <span>{discount.split(' ')[0]}</span>
              <span className="text-[10px] font-semibold">{discount.split(' ')[1]}</span>
            </div>
          )}
          {image ? (
            <img src={image} alt={title} className="absolute inset-y-0 right-0 h-full w-[138px] object-contain drop-shadow-xl" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/50 bg-white/55 text-[#17307a] shadow-[0_12px_24px_rgba(20,44,112,0.15)] backdrop-blur">
              <Icon className="h-8 w-8" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function OffersPanel() {
  return (
    <Card id="offers" className="p-4 border-[#f0f4ff] bg-white">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
          Offers &amp; Promos
        </h2>
        <span className="cursor-pointer text-[13px] font-bold text-[#1a56db] hover:underline">
          View All Offers
        </span>
      </div>
      <div className="space-y-4">
        {promoItems.map(({ href: _href, ...promo }) => (
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
