import { ChevronRight, Heart, MapPin, Search, Sparkles, Star } from 'lucide-react';
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
import { cn } from '@/utils/cn';

function SectionHeader({
  title,
  linkLabel,
}: {
  title: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-[19px] font-bold tracking-[-0.03em] text-[#17307a]">
        {title}
      </h2>
      <button className="text-[14px] font-semibold text-[#1a56db] hover:underline">
        {linkLabel}
      </button>
    </div>
  );
}

function HeroBanner() {
  const examples = ['Engine noise', 'AC not cooling', 'Brake vibration', 'Low pickup'];

  return (
    <Card className="relative overflow-hidden border-0 bg-[linear-gradient(109deg,#07163b_0%,#132c66_48%,#3d1565_100%)] px-5 py-5 text-white sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_25%,rgba(41,98,255,0.45),transparent_20%),radial-gradient(circle_at_84%_35%,rgba(84,225,255,0.18),transparent_15%),radial-gradient(circle_at_86%_72%,rgba(213,55,255,0.2),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(13,22,51,0.6))]" />
      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-center">
        <div className="space-y-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.03em]">AI Diagnose</h1>
            <p className="mt-2 max-w-[440px] text-[15px] leading-6 text-white/88">
              Describe your car issue and let AI find the best solutions for you.
            </p>
          </div>

          <div className="rounded-[14px] bg-white p-2 shadow-[0_10px_24px_rgba(4,13,38,0.25)]">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526693]" />
                <Input
                  className="h-11 border-0 bg-transparent pl-10 shadow-none focus:ring-0"
                  placeholder="Example: Car shaking at high speed"
                />
              </div>
              <Button className="h-11 rounded-[12px] px-5">
                <Sparkles className="h-4 w-4" />
                Diagnose Now
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[13px] text-white/82">Try these examples:</span>
            {examples.map((example) => (
              <button
                key={example}
                className="rounded-[10px] border border-white/20 bg-white/8 px-3 py-2 text-[13px] font-medium text-white/92 backdrop-blur"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden h-[196px] w-full max-w-[320px] xl:block">
          <div className="absolute inset-x-6 bottom-2 h-6 rounded-full bg-[#070b1f] blur-xl" />
          <div className="absolute left-2 top-6 h-40 w-56 rounded-[32px] border border-[#0e2f73] bg-[linear-gradient(180deg,#132e72_0%,#071226_100%)] shadow-[0_20px_40px_rgba(4,13,38,0.45)]">
            <div className="absolute inset-x-6 top-8 h-7 rounded-[18px] bg-[linear-gradient(90deg,#153570_0%,#1f67ff_55%,#24b2ff_100%)]" />
            <div className="absolute left-7 top-11 h-11 w-36 rounded-[20px_36px_12px_12px] bg-[linear-gradient(90deg,#11295e_0%,#1f76ff_62%,#24c1ff_100%)]" />
            <div className="absolute left-6 top-20 h-7 w-44 rounded-[10px] bg-[#061634]" />
            <div className="absolute left-4 top-16 h-10 w-6 rounded-l-[12px] rounded-r-[6px] bg-[linear-gradient(180deg,#20c1ff_0%,#0a254d_100%)]" />
            <div className="absolute right-4 top-17 h-8 w-5 rounded-r-[12px] rounded-l-[6px] bg-[linear-gradient(180deg,#20c1ff_0%,#0a254d_100%)]" />
            <div className="absolute bottom-5 left-7 h-14 w-14 rounded-full border-[6px] border-[#091631] bg-[radial-gradient(circle_at_40%_35%,#79809d_0%,#151d32_55%,#04070f_100%)]" />
            <div className="absolute bottom-5 right-7 h-14 w-14 rounded-full border-[6px] border-[#091631] bg-[radial-gradient(circle_at_40%_35%,#79809d_0%,#151d32_55%,#04070f_100%)]" />
          </div>
          <div className="absolute right-2 top-0 flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-[#ddecff] bg-[radial-gradient(circle,#4c9eff_0%,#154bc4_48%,#08163c_100%)] shadow-[0_16px_40px_rgba(24,100,255,0.45)]">
            <span className="text-[54px] font-bold leading-none text-white">AI</span>
            <div className="absolute -bottom-8 -right-2 h-20 w-5 rotate-[-35deg] rounded-full border-[4px] border-[#ddecff] bg-[#0b1a49]" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function CategoryGrid() {
  return (
    <section>
      <SectionHeader title="Shop by Categories" linkLabel="View All (8)" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {categoryItems.map(({ label, icon: Icon }) => (
          <Card
            key={label}
            className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[14px] px-3 py-4 text-center shadow-[0_8px_20px_rgba(20,44,112,0.05)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f8ff] text-[#173fcf]">
              <Icon className="h-7 w-7" strokeWidth={1.9} />
            </div>
            <div className="max-w-[132px] text-[15px] font-semibold leading-5 text-[#17307a]">
              {label}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function MaintenanceStrip() {
  return (
    <section>
      <SectionHeader
        title="Recommended Preventive Maintenance Services"
        linkLabel="View All"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {maintenanceItems.map(({ label, due, icon: Icon }) => (
          <Card
            key={label}
            className="flex min-h-[78px] items-center gap-3 px-4 py-3 shadow-[0_8px_20px_rgba(20,44,112,0.05)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f8ff] text-[#1a56db]">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[#17307a]">{label}</h3>
              <p className="mt-1 text-[13px] text-[#66759e]">{due}</p>
            </div>
          </Card>
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
}: (typeof garages)[number]) {
  return (
    <Card className="overflow-hidden rounded-[16px] shadow-[0_12px_26px_rgba(20,44,112,0.08)]">
      <div className={cn('relative h-[86px] bg-gradient-to-r', artwork)}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(5,8,17,0.3))]" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {badge ? <Badge tone={tone}>{badge}</Badge> : <div />}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-md">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex gap-2 opacity-85">
          <div className="h-8 flex-1 rounded bg-white/10" />
          <div className="h-8 w-14 rounded bg-white/10" />
          <div className="h-8 w-10 rounded bg-white/10" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[18px] font-bold tracking-[-0.03em] text-[#17307a]">
          {name}
        </h3>
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

function FeaturedGarages() {
  return (
    <section>
      <SectionHeader title="Featured Garages" linkLabel="View All Garages" />
      <div className="relative">
        <div className="grid gap-4 xl:grid-cols-4">
          {garages.map((garage) => (
            <GarageCard key={garage.name} {...garage} />
          ))}
        </div>
        <button className="absolute right-[-14px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_10px_25px_rgba(20,44,112,0.18)] xl:flex">
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

function SeasonalDeals() {
  return (
    <section>
      <SectionHeader title="Seasonal Care Combo Deals" linkLabel="View All Deals" />
      <div className="relative grid gap-4 xl:grid-cols-3">
        {seasonalDeals.map((deal, index) => (
          <Card key={deal.title} className="overflow-hidden p-0">
            <div className="grid min-h-[140px] grid-cols-[1.1fr_0.9fr]">
              <div className="p-4">
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
                <p className="mt-2 max-w-[180px] text-[14px] leading-5 text-[#42537e]">
                  {deal.subtitle}
                </p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-[30px] font-bold leading-none text-[#ff3b30]">
                    {deal.price}
                  </span>
                  <span className="pb-1 text-[14px] text-[#8a96b8] line-through">
                    {deal.strikePrice}
                  </span>
                  <Badge tone="lightGreen" className="mb-1">
                    {deal.discount}
                  </Badge>
                </div>
              </div>
              <div className={cn('relative bg-gradient-to-br', deal.imageTone)}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.45),transparent_28%)]" />
                <div className="absolute inset-x-8 bottom-4 h-5 rounded-full bg-black/20 blur-xl" />
                {index === 0 ? (
                  <div className="absolute right-4 top-4 h-24 w-24 rounded-[26px] border border-white/50 bg-[linear-gradient(145deg,#160707_0%,#51331d_55%,#e39a33_100%)] shadow-2xl" />
                ) : index === 1 ? (
                  <div className="absolute right-4 top-3 h-28 w-20 rotate-12 rounded-[22px] bg-[linear-gradient(180deg,#edf4fb_0%,#b2c6dc_40%,#32424f_100%)] shadow-2xl" />
                ) : (
                  <div className="absolute right-5 top-6 h-20 w-24 rounded-[18px] bg-[linear-gradient(145deg,#121924_0%,#575e68_45%,#111827_100%)] shadow-2xl" />
                )}
              </div>
            </div>
          </Card>
        ))}
        <button className="absolute right-[-14px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_10px_25px_rgba(20,44,112,0.18)] xl:flex">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function CareTips() {
  return (
    <section>
      <SectionHeader title="Car Care Tips" linkLabel="View All Tips" />
      <div className="relative grid gap-3 xl:grid-cols-5">
        {careTips.map(({ title, icon: Icon }, index) => (
          <Card
            key={title}
            className="grid min-h-[90px] grid-cols-[1fr_78px] items-center overflow-hidden p-0"
          >
            <div className="p-4">
              <p className="text-[13px] font-semibold leading-5 text-[#17307a]">
                {title}
              </p>
            </div>
            <div
              className={cn(
                'relative h-full bg-gradient-to-br',
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
              <div className="absolute inset-0 flex items-center justify-center text-[#17307a]">
                <Icon className="h-9 w-9 opacity-85" />
              </div>
            </div>
          </Card>
        ))}
        <button className="absolute right-[-14px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_10px_25px_rgba(20,44,112,0.18)] xl:flex">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

export function MainContent() {
  return (
    <div className="space-y-5">
      <HeroBanner />
      <CategoryGrid />
      <MaintenanceStrip />
      <FeaturedGarages />
      <SeasonalDeals />
      <CareTips />
    </div>
  );
}
