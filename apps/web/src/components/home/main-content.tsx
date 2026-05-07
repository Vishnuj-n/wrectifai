'use client';

import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeIndianRupee,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sticker,
  Snowflake,
  SquareX,
  FileText,
  CarFront,
  Gift,
} from 'lucide-react';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { Input } from '@/components/common/input';
import {
  careTips,
  categoryItems,
  garages,
  maintenanceItems,
  seasonalDeals,
} from '@/components/home/data';
import Link from 'next/link';
import { cn } from '@/utils/cn';

function SectionHeader({
  title,
  linkLabel,
  href,
}: {
  title: string;
  linkLabel: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-[19px] font-bold tracking-[-0.03em] text-[#17307a]">{title}</h2>
      {href ? (
        <Link href={href} className="text-[14px] font-semibold text-[#1a56db] hover:underline">
          {linkLabel}
        </Link>
      ) : (
        <span className="text-[14px] font-semibold text-[#1a56db]">{linkLabel}</span>
      )}
    </div>
  );
}

function HoverComingSoon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('group relative', className)}>
      {children}
      <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-[#17307a] px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-[0_8px_18px_rgba(23,48,122,0.18)] transition-opacity duration-150 group-hover:opacity-100">
        Coming soon
      </div>
    </div>
  );
}

const moreCategoryItems = [
  { label: 'Loans', icon: BadgeIndianRupee },
  { label: 'Used Cars', icon: Sticker },
  { label: 'Electrical & Battery Systems', icon: BatteryCharging },
  { label: 'AC & Cooling Systems', icon: Snowflake },
  { label: 'Vehicle Protection & Safety', icon: ShieldCheck },
  { label: 'Documentation & Compliance', icon: FileText },
  { label: 'EV Services', icon: CarFront },
  { label: 'Subscription & Bundles', icon: Gift },
];

function CategoriesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[rgba(10,18,45,0.24)] px-4 py-5 backdrop-blur-[1px]">
      <div className="max-h-[calc(100vh-40px)] w-full max-w-[805px] overflow-y-auto rounded-[26px] border border-white/70 bg-white shadow-[0_28px_80px_rgba(16,35,86,0.20)]">
        <div className="px-6 pb-4 pt-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-bold tracking-[-0.03em] text-[#17307a]">
                All Categories
              </h2>
              <p className="mt-1 text-[14px] text-[#6173a1]">
                Explore our wide range of services and products for your car
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close categories modal"
              className="mt-1 rounded-full p-1 text-[#17307a] transition-colors hover:bg-[#f4f7ff]"
            >
              <SquareX className="h-5 w-5 stroke-[1.8]" />
            </button>
          </div>

          <div className="mt-7">
            <h3 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
              Top Categories
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
              {categoryItems.map(({ label, icon: Icon }) => (
                <Card
                  key={label}
                  className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[14px] border-[#e8eefc] px-3 py-3 text-center shadow-none"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f9ff] text-[#173fcf]">
                    <Icon className="h-7 w-7" strokeWidth={1.9} />
                  </div>
                  <div className="max-w-[104px] text-[15px] font-semibold leading-5 text-[#17307a]">
                    {label}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
              More Categories
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {moreCategoryItems.map(({ label, icon: Icon }) => (
                <Card
                  key={label}
                  className="flex min-h-[68px] items-center gap-4 rounded-[14px] border-[#e8eefc] px-5 py-4 shadow-none"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f9ff] text-[#1a56db]">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <div className="text-[15px] font-semibold leading-6 text-[#17307a]">
                    {label}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-8 flex flex-col gap-4 rounded-[18px] border-[#e8eefc] bg-[linear-gradient(180deg,#f7faff_0%,#f2f6ff_100%)] px-5 py-4 shadow-none sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_6px_18px_rgba(26,86,219,0.08)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
                  Can&apos;t find what you&apos;re looking for?
                </h4>
                <p className="mt-1 text-[14px] text-[#6173a1]">
                  Let us help you find the right service for your car.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-[12px] px-5 text-[15px] font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              Get Help
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeroBanner() {
  const [query, setQuery] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const bannerImages = [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=600&q=80',
  ];

  const nextImage = () => setImageIndex((i) => (i + 1) % bannerImages.length);
  const prevImage = () => setImageIndex((i) => (i - 1 + bannerImages.length) % bannerImages.length);
  const examples = [
    { label: 'Engine noise', value: 'Engine noise' },
    { label: 'AC cooling', value: 'AC not cooling' },
    { label: 'Brake vibe', value: 'Brake vibration' },
    { label: 'Low pickup', value: 'Low pickup' },
  ];

  const runDiagnoseSearch = () => {
    window.dispatchEvent(
      new CustomEvent('dashboard-search', {
        detail: query.trim(),
      })
    );
  };

  return (
    <Card
      id="ai-diagnose"
      className="relative overflow-hidden border-0 bg-[linear-gradient(109deg,#07163b_0%,#132c66_48%,#3d1565_100%)] px-5 py-5 text-white sm:px-6 sm:py-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_25%,rgba(41,98,255,0.45),transparent_20%),radial-gradient(circle_at_84%_35%,rgba(84,225,255,0.18),transparent_15%),radial-gradient(circle_at_86%_72%,rgba(213,55,255,0.2),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(13,22,51,0.6))]" />
      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-center">
        <div className="space-y-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.03em]">Diagnose</h1>
            <p className="mt-2 max-w-[440px] text-[15px] leading-6 text-white/88">
              Describe your car issue and let WrectifAI find the best solutions for you.
            </p>
          </div>

          <div className="rounded-[14px] bg-white p-2 shadow-[0_10px_24px_rgba(4,13,38,0.25)]">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526693]" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-11 border-0 bg-transparent pl-10 shadow-none focus:ring-0"
                  placeholder="Example: Car shaking at high speed"
                />
              </div>
              <Button type="button" onClick={runDiagnoseSearch} className="h-11 rounded-[12px] px-5">
                <Sparkles className="h-4 w-4" />
                Diagnose Now
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:overflow-x-auto">
            <span className="mr-1 shrink-0 text-[13px] text-white/82">Try these examples:</span>
            {examples.map((example) => (
              <button
                key={example.value}
                type="button"
                onClick={() => setQuery(example.value)}
                className={cn(
                  'shrink-0 rounded-[10px] border px-3 py-2 text-[13px] font-medium backdrop-blur transition-colors',
                  query === example.value
                    ? 'border-white/45 bg-white/20 text-white'
                    : 'border-white/20 bg-white/8 text-white/92 hover:bg-white/14'
                )}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden h-[196px] w-full max-w-[320px] xl:block">
          <div className="absolute inset-x-6 bottom-2 h-6 rounded-full bg-[#070b1f] blur-xl" />
          <div className="group absolute left-2 top-6 h-40 w-56 overflow-hidden rounded-[32px] border border-[#0e2f73] shadow-[0_20px_40px_rgba(4,13,38,0.45)]">
            <img
              src={bannerImages[imageIndex]}
              alt="Diagnose Car"
              className="h-full w-full object-cover transition-opacity duration-300"
            />
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {bannerImages.map((_, i) => (
                <div
                  key={i}
                  className={cn('h-1.5 w-1.5 rounded-full transition-colors', i === imageIndex ? 'bg-white' : 'bg-white/40')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CategoryGrid({
  items,
  onViewAll,
}: {
  items: typeof categoryItems;
  onViewAll: () => void;
}) {
  return (
    <section id="categories">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-bold tracking-[-0.03em] text-[#17307a]">
          Shop by Categories
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[14px] font-semibold text-[#1a56db]"
        >
          View All (8)
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
        {items.map(({ label, icon: Icon }) => (
          <HoverComingSoon key={label}>
            <Card className="flex h-[140px] w-full cursor-default flex-col items-center justify-center gap-3 rounded-[14px] px-3 py-4 text-center shadow-[0_8px_20px_rgba(20,44,112,0.05)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f8ff] text-[#173fcf]">
                <Icon className="h-7 w-7" strokeWidth={1.9} />
              </div>
              <div className="max-w-[132px] text-[15px] font-semibold leading-5 text-[#17307a]">{label}</div>
            </Card>
          </HoverComingSoon>
        ))}
      </div>
    </section>
  );
}

function MaintenanceStrip({
  items,
}: {
  items: typeof maintenanceItems;
}) {
  return (
    <section id="maintenance">
      <SectionHeader
        title="Recommended Preventive Maintenance Services"
        linkLabel="View All"
        href="/services"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map(({ label, due, icon: Icon }) => (
          <HoverComingSoon key={label}>
            <Card className="flex h-[96px] w-full cursor-default items-center gap-3 px-4 py-3 shadow-[0_8px_20px_rgba(20,44,112,0.05)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f8ff] text-[#1a56db]">
                <Icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold leading-5 text-[#17307a]">{label}</h3>
                <p className="mt-1 text-[13px] text-[#66759e]">{due}</p>
              </div>
            </Card>
          </HoverComingSoon>
        ))}
      </div>
    </section>
  );
}

function GarageCard({
  badge,
  tone,
  name,
  rating,
  reviews,
  location,
  distance,
  price,
  artwork,
  image,
}: Omit<(typeof garages)[number], 'href'>) {
  return (
    <Card className="overflow-hidden rounded-[16px] shadow-[0_12px_26px_rgba(20,44,112,0.08)]">
      <div className={cn('relative h-[86px] bg-gradient-to-r', artwork)}>
        {image && <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(5,8,17,0.3))]" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {badge ? <Badge tone={tone}>{badge}</Badge> : <div />}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-md">
            <Heart className="h-4 w-4" />
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex gap-2 opacity-85">
          <div className="h-8 flex-1 rounded bg-white/10" />
          <div className="h-8 w-14 rounded bg-white/10" />
          <div className="h-8 w-10 rounded bg-white/10" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">{name}</h3>
        <div className="mt-2 flex items-center gap-2 text-[13px] text-[#6e7ca4]">
          <Star className="h-4 w-4 fill-[#ff9f1a] text-[#ff9f1a]" />
          <span className="font-semibold text-[#f28c28]">{rating}</span>
          <span>({reviews})</span>
        </div>
        <div className="mt-2 space-y-1.5 text-[13px] text-[#6e7ca4]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#6177ad]" />
            {location}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#6177ad]" />
              {distance}
            </div>
            <span className="font-bold text-[#16a34a]">{price}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function scrollRow(container: HTMLDivElement | null, amount: number) {
  if (!container) {
    return;
  }

  const nextLeft = container.scrollLeft + amount;
  const maxLeft = container.scrollWidth - container.clientWidth;

  container.scrollTo({
    left: nextLeft >= maxLeft - 4 ? 0 : nextLeft,
    behavior: 'smooth',
  });
}

function FeaturedGarages({
  garagesList,
}: {
  garagesList: typeof garages;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="garages">
      <SectionHeader title="Featured Garages" linkLabel="View All Garages" href="/garages" />
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {garagesList.map(({ href: _href, ...garage }) => (
            <div key={garage.name} className="w-[270px] shrink-0">
              <GarageCard {...garage} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollRow(scrollRef.current, 286)}
          aria-label="Show more garages"
          className="absolute right-[-14px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_10px_25px_rgba(20,44,112,0.18)] xl:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1a56db]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c8d6f6]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c8d6f6]" />
        </div>
      </div>
    </section>
  );
}

function SeasonalDeals({
  deals,
}: {
  deals: typeof seasonalDeals;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="seasonal-deals">
      <SectionHeader title="Seasonal Care Combo Deals" linkLabel="View All Deals" href="/offers" />
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {deals.map((deal, index) => (
            <Card key={deal.title} className="w-[344px] shrink-0 overflow-hidden p-0">
              <div className="grid min-h-[124px] grid-cols-[1.08fr_0.92fr]">
                <div className="p-4 pb-3">
                  <div
                    className={cn(
                      'text-[13px] font-bold',
                      index === 0
                        ? 'text-[#ff3b30]'
                        : index === 1
                          ? 'text-[#238453]'
                          : 'text-[#1a56db]'
                    )}
                  >
                    {deal.title}
                  </div>
                  <p className="mt-1.5 max-w-[172px] text-[13px] leading-5 text-[#42537e]">{deal.subtitle}</p>
                  <div className="mt-3 flex flex-wrap items-end gap-2">
                    <span className="text-[26px] font-bold leading-none text-[#ff3b30]">{deal.price}</span>
                    <span className="pb-1 text-[14px] text-[#8a96b8] line-through">{deal.strikePrice}</span>
                    <Badge tone="lightGreen" className="mb-1">
                      {deal.discount}
                    </Badge>
                  </div>
                </div>
                <div className={cn('relative bg-gradient-to-br', deal.imageTone)}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.45),transparent_28%)]" />
                  <div className="absolute inset-x-8 bottom-4 h-5 rounded-full bg-black/20 blur-xl" />
                  {deal.image ? (
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="absolute bottom-3 right-3 h-[88px] w-[124px] rounded-[14px] object-cover shadow-2xl"
                    />
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollRow(scrollRef.current, 368)}
          aria-label="Show more seasonal deals"
          className="absolute right-[-14px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_10px_25px_rgba(20,44,112,0.18)] xl:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function CareTips({
  tips,
}: {
  tips: typeof careTips;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="tips">
      <SectionHeader title="Car Care Tips" linkLabel="View All Tips" href="/car-tips" />
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tips.map(({ title, icon: Icon, image }, index) => (
            <Card key={title} className="grid min-h-[78px] w-[188px] shrink-0 grid-cols-[1fr_72px] items-center overflow-hidden p-0">
              <div className="p-4 py-3">
                <p className="text-[12px] font-semibold leading-5 text-[#17307a]">{title}</p>
              </div>
              <div className="relative h-full overflow-hidden">
                {image ? (
                  <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br flex items-center justify-center text-[#17307a]',
                      index === 0
                        ? 'from-[#f5f8ff] to-[#dfe9ff]'
                        : index === 1
                          ? 'from-[#fff6ea] to-[#ffe3a8]'
                          : index === 2
                            ? 'from-[#eef5ff] to-[#d9ecff]'
                            : index === 3
                              ? 'from-[#f2f6ff] to-[#edf1f6]'
                              : 'from-[#eef9f7] to-[#daf5ee]'
                    )}
                  >
                    <Icon className="h-9 w-9 opacity-85" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollRow(scrollRef.current, 205)}
          aria-label="Show more care tips"
          className="absolute right-[-14px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_10px_25px_rgba(20,44,112,0.18)] xl:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

export function MainContent() {
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchTerm(customEvent.detail ?? '');
    };

    window.addEventListener('dashboard-search', handleSearch);
    return () => window.removeEventListener('dashboard-search', handleSearch);
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategories = useMemo(
    () =>
      normalizedSearch
        ? categoryItems.filter((item) => item.label.toLowerCase().includes(normalizedSearch))
        : categoryItems,
    [normalizedSearch]
  );

  const filteredMaintenance = useMemo(
    () =>
      normalizedSearch
        ? maintenanceItems.filter(
            (item) =>
              item.label.toLowerCase().includes(normalizedSearch) ||
              item.due.toLowerCase().includes(normalizedSearch)
          )
        : maintenanceItems,
    [normalizedSearch]
  );

  const filteredGarages = useMemo(
    () =>
      normalizedSearch
        ? garages.filter(
            (item) =>
              item.name.toLowerCase().includes(normalizedSearch) ||
              item.location.toLowerCase().includes(normalizedSearch)
          )
        : garages,
    [normalizedSearch]
  );

  const filteredDeals = useMemo(
    () =>
      normalizedSearch
        ? seasonalDeals.filter(
            (item) =>
              item.title.toLowerCase().includes(normalizedSearch) ||
              item.subtitle.toLowerCase().includes(normalizedSearch)
          )
        : seasonalDeals,
    [normalizedSearch]
  );

  const filteredTips = useMemo(
    () =>
      normalizedSearch
        ? careTips.filter((item) => item.title.toLowerCase().includes(normalizedSearch))
        : careTips,
    [normalizedSearch]
  );

  const hasResults =
    filteredCategories.length > 0 ||
    filteredMaintenance.length > 0 ||
    filteredGarages.length > 0 ||
    filteredDeals.length > 0 ||
    filteredTips.length > 0;

  return (
    <>
      <div className="space-y-7 pb-5">
        <HeroBanner />
        {normalizedSearch ? (
          <div className="rounded-[16px] border border-[#e4ecff] bg-white px-4 py-3 text-[14px] font-medium text-[#4f67a2] shadow-[0_8px_20px_rgba(20,44,112,0.04)]">
            Showing results for <span className="font-bold text-[#1a56db]">{searchTerm}</span>
          </div>
        ) : null}
        {filteredCategories.length > 0 ? (
          <CategoryGrid items={filteredCategories} onViewAll={() => setIsCategoriesModalOpen(true)} />
        ) : null}
        {filteredMaintenance.length > 0 ? <MaintenanceStrip items={filteredMaintenance} /> : null}
        {filteredGarages.length > 0 ? <FeaturedGarages garagesList={filteredGarages} /> : null}
        {filteredDeals.length > 0 ? <SeasonalDeals deals={filteredDeals} /> : null}
        {filteredTips.length > 0 ? <CareTips tips={filteredTips} /> : null}
        {!hasResults ? (
          <Card className="rounded-[18px] border-[#e4ecff] px-5 py-6 text-center shadow-[0_8px_20px_rgba(20,44,112,0.04)]">
            <div className="text-[18px] font-bold text-[#17307a]">No dashboard matches found</div>
            <div className="mt-2 text-[14px] text-[#66759e]">
              Try another search term for services, parts, garages, or tips.
            </div>
          </Card>
        ) : null}
      </div>
      <CategoriesModal
        open={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />
    </>
  );
}
