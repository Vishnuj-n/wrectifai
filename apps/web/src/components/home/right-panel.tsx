import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/common/card';
import { emergencyItems, overviewItems, promoItems } from '@/components/home/data';
import { cn } from '@/utils/cn';

function OverviewPanel() {
  return (
    <Card id="overview" className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14.5px] font-semibold tracking-[-0.03em] text-[#17307a]">
          My Overview
        </h2>
        <div className="flex h-9 items-center gap-2 rounded-[10px] border border-[#dbe6ff] px-3 text-[11.5px] font-semibold text-[#17307a]">
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
              <p className="text-[12px] font-medium text-[#6f7ea6]">{title}</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[14.5px] font-semibold text-[#17307a]">{value}</span>
              </div>
              <p className="mt-1 text-[11px] text-[#6f7ea6]">{description}</p>
            </div>
            <span className="self-center text-[11.5px] font-semibold text-[#1a56db]">{cta}</span>
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
        <h2 className="text-[14.5px] font-semibold tracking-[-0.03em] text-[#ff3b30]">
          Emergency Help
        </h2>
          <p className="mt-1 text-[11px] font-normal text-[#6f7ea6]">Quick assistance, anytime</p>
        </div>
        <div className="rounded-full bg-[#ffeeee] px-3 py-1 text-[11.5px] font-bold text-[#ff3b30]">
          24/7
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {emergencyItems.map(({ title, image, imageClass }) => (
          <div
            key={title}
            className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-[14px] border border-[#f0f4ff] bg-white px-1 pt-2 text-center shadow-[0_4px_12px_rgba(20,44,112,0.03)]"
          >
            <div className="flex h-10 items-center justify-center">
              <img 
                src={image} 
                alt={title} 
                className={cn("object-contain", imageClass)} 
              />
            </div>
            <span className="max-w-[68px] pb-2 text-[10.5px] font-medium leading-tight text-[#17307a]">
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
  const cardColor = fill.match(/from-\[(#[a-fA-F0-9]+)\]/)?.[1] || '#ffffff';
  
  return (
    <Card 
      className="overflow-hidden border-0 p-0 shadow-none"
      style={{ backgroundColor: cardColor }}
    >
      <div className="grid min-h-[138px] grid-cols-[1.18fr_0.82fr] items-center">
        <div className="p-4 pr-0">
          <p className={cn('text-[11px] font-bold uppercase tracking-[0.02em]', accent)}>{eyebrow}</p>
          <p className="mt-2 text-[12px] font-semibold leading-6 text-[#42537e]">{title}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={cn('text-[11px] font-bold', accent)}>Starting</span>
            <span className={cn('text-[14.5px] font-bold leading-none', accent)}>{price}</span>
            <span className="text-[10.5px] font-medium text-[#8a96b8] line-through">{strikePrice}</span>
            {isGreen && (
              <div className="rounded-full bg-[#e6f4ea] px-2 py-0.5 text-[10px] font-bold text-[#238453]">
                {discount}
              </div>
            )}
          </div>
        </div>
        <div 
          className="relative h-full min-h-[138px] overflow-hidden flex items-center select-none"
          style={{ backgroundColor: cardColor }}
        >
          {image ? (
            <>
              <img 
                src={image} 
                alt={title} 
                className="h-full w-full object-cover object-center mix-blend-multiply" 
              />
              <div 
                className="absolute inset-y-0 left-0 w-20 pointer-events-none"
                style={{
                  background: `linear-gradient(to right, ${cardColor} 0%, ${cardColor}e0 25%, ${cardColor}00 100%)`
                }}
              />
            </>
          ) : (
            <div className="m-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/50 bg-white/55 text-[#17307a] shadow-[0_12px_24px_rgba(20,44,112,0.15)] backdrop-blur">
              <Icon className="h-8 w-8" />
            </div>
          )}
          
          {!isGreen && (
            <div
              className={cn(
                'absolute right-3 top-3 z-10 flex flex-col items-center justify-center rounded-[8px] px-2 py-1 text-[11px] font-bold leading-3 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
                isRed ? 'bg-[#ff3b30]' : 'bg-[#1a56db]'
              )}
            >
              <span>{discount.split(' ')[0]}</span>
              <span className="text-[9.5px] font-semibold">{discount.split(' ')[1]}</span>
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
        <h2 className="text-[14.5px] font-semibold tracking-[-0.03em] text-[#17307a]">
          Offers &amp; Promos
        </h2>
        <span className="cursor-pointer text-[11.5px] font-bold text-[#1a56db] hover:underline">
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
