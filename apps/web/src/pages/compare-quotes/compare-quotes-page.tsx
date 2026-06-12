'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgePlus,
  BadgeCheck,
  CalendarClock,
  CarFront,
  CheckCircle2,
  ChevronRight,
  FileText,
  Info,
  MessageCircleMore,
  MoreHorizontal,
  Scale,
  ShieldCheck,
  Star,
  WalletCards,
  Wrench,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Card } from '@/components/common/card';
import { quotesList } from '@/components/quotes/quotes-shared';
import { cn } from '@/utils/cn';

const RUPEE = '\u20B9';
const BULLET = '\u2022';

const actionItems = [
  { label: 'Select', icon: CheckCircle2, tone: 'blue' as const },
  { label: 'View Quotes', icon: FileText, tone: 'blue' as const },
  { label: 'Message', icon: MessageCircleMore, tone: 'purple' as const },
  { label: 'More', icon: MoreHorizontal, tone: 'blue' as const },
];

type PriceRow = {
  label: string;
  aiValue: string;
  quoteValues: Record<string, string>;
  emphasize?: boolean;
  savings?: boolean;
};

type DetailCellState = 'positive' | 'negative' | 'neutral' | 'rating';

type DetailRow = {
  label: string;
  icon: typeof CalendarClock;
  aiValue: string;
  quoteValues: Record<string, { value: string; state: DetailCellState }>;
};

const priceRows: PriceRow[] = [
  {
    label: 'Parts',
    aiValue: `${RUPEE}1,600 \u2013 ${RUPEE}2,100`,
    quoteValues: {
      quickpit: `${RUPEE}1,650`,
      autoworks: `${RUPEE}1,900`,
      speedfix: `${RUPEE}1,700`,
    },
  },
  {
    label: 'Labour',
    aiValue: `${RUPEE}1,000 \u2013 ${RUPEE}1,300`,
    quoteValues: {
      quickpit: `${RUPEE}1,050`,
      autoworks: `${RUPEE}1,250`,
      speedfix: `${RUPEE}1,200`,
    },
  },
  {
    label: 'Consumables',
    aiValue: `${RUPEE}200 \u2013 ${RUPEE}300`,
    quoteValues: {
      quickpit: `${RUPEE}200`,
      autoworks: `${RUPEE}250`,
      speedfix: `${RUPEE}200`,
    },
  },
  {
    label: 'GST',
    aiValue: `${RUPEE}200 \u2013 ${RUPEE}300`,
    quoteValues: {
      quickpit: `${RUPEE}150`,
      autoworks: `${RUPEE}200`,
      speedfix: `${RUPEE}100`,
    },
  },
  {
    label: 'Total Estimate',
    aiValue: `${RUPEE}2,800 \u2013 ${RUPEE}3,600`,
    quoteValues: {
      quickpit: `${RUPEE}3,050`,
      autoworks: `${RUPEE}3,450`,
      speedfix: `${RUPEE}3,200`,
    },
    emphasize: true,
  },
  {
    label: `You Save (vs Wrectfai high)`,
    aiValue: '\u2013',
    quoteValues: {
      quickpit: `${RUPEE}450 (12%)`,
      autoworks: `${RUPEE}250 (7%)`,
      speedfix: `${RUPEE}150 (4%)`,
    },
    savings: true,
  },
] ;

const detailRows: DetailRow[] = [
  {
    label: 'Availability',
    icon: CalendarClock,
    aiValue: '\u2013',
    quoteValues: {
      quickpit: { value: 'Today, 6:00 PM', state: 'positive' as const },
      autoworks: { value: 'Tomorrow, 10:00 AM', state: 'positive' as const },
      speedfix: { value: 'Today, 7:30 PM', state: 'positive' as const },
    },
  },
  {
    label: 'Pickup & Drop',
    icon: CarFront,
    aiValue: '\u2013',
    quoteValues: {
      quickpit: { value: 'Available', state: 'positive' as const },
      autoworks: { value: 'Not Available', state: 'negative' as const },
      speedfix: { value: 'Available', state: 'positive' as const },
    },
  },
  {
    label: 'Warranty',
    icon: ShieldCheck,
    aiValue: '\u2013',
    quoteValues: {
      quickpit: { value: '6 Months / 10,000 km', state: 'neutral' as const },
      autoworks: { value: '3 Months / 5,000 km', state: 'neutral' as const },
      speedfix: { value: '2 Years / 20,000 km', state: 'neutral' as const },
    },
  },
  {
    label: 'Rating (Reviews)',
    icon: Star,
    aiValue: '\u2013',
    quoteValues: {
      quickpit: { value: '4.6 (128)', state: 'rating' as const },
      autoworks: { value: '4.4 (76)', state: 'rating' as const },
      speedfix: { value: '4.5 (96)', state: 'rating' as const },
    },
  },
  {
    label: 'Experience',
    icon: Wrench,
    aiValue: '\u2013',
    quoteValues: {
      quickpit: { value: '8+ Years', state: 'neutral' as const },
      autoworks: { value: '6+ Years', state: 'neutral' as const },
      speedfix: { value: '10+ Years', state: 'neutral' as const },
    },
  },
] ;

function garageTagTone(id: string) {
  if (id === 'quickpit') return 'bg-[#f5eaff] text-[#b35ae8]';
  if (id === 'autoworks') return 'bg-[#edf3ff] text-[#2a5bf5]';
  return 'bg-[#e6f8ee] text-[#1ea15f]';
}

function serviceIcon(state: DetailCellState) {
  if (state === 'positive') {
    return <CheckCircle2 className="h-3.5 w-3.5 text-[#1e9b5f]" />;
  }
  if (state === 'negative') {
    return <XCircle className="h-3.5 w-3.5 text-[#ff5959]" />;
  }
  if (state === 'rating') {
    return <Star className="h-3.5 w-3.5 fill-[#ffb800] text-[#ffb800]" />;
  }
  return null;
}

export function CompareQuotesPage({ ids }: { ids?: string }) {
  const router = useRouter();
  const pageRootRef = useRef<HTMLDivElement>(null);

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

  const initialSelectedIds = useMemo(
    () =>
      (ids || 'quickpit,autoworks,speedfix')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3),
    [ids]
  );

  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>(initialSelectedIds);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  const selectedQuotes = useMemo(() => {
    const matches = quotesList.filter((quote) => selectedQuoteIds.includes(quote.id));
    return selectedQuoteIds.length ? matches : [];
  }, [selectedQuoteIds]);

  const availableQuotes = useMemo(
    () => quotesList.filter((quote) => !selectedQuoteIds.includes(quote.id)),
    [selectedQuoteIds]
  );

  const selectedCount = selectedQuotes.length;
  const showAddGarageCard = selectedCount < 3 && availableQuotes.length > 0;
  const topCardsGridStyle = {
    gridTemplateColumns: `174px repeat(${selectedCount + (showAddGarageCard ? 1 : 0)}, minmax(0, 1fr))`,
  };
  const tableGridStyle = {
    gridTemplateColumns: `198px 172px repeat(${selectedCount}, minmax(0, 1fr))`,
  };

  useEffect(() => {
    const nextIds = selectedQuoteIds.join(',');
    router.replace(nextIds ? `/compare-quotes?ids=${nextIds}` : '/compare-quotes', { scroll: false });
  }, [router, selectedQuoteIds]);

  function toggleQuote(quoteId: string) {
    setSelectedQuoteIds((current) => {
      if (current.includes(quoteId)) {
        return current.filter((id) => id !== quoteId);
      }
      if (current.length >= 3) {
        return current;
      }
      return [...current, quoteId];
    });
  }

  function rowHasDifferences(values: string[]) {
    if (values.length < 2) return true;
    return new Set(values).size > 1;
  }

  const visiblePriceRows = useMemo(() => {
    if (!showOnlyDifferences || selectedCount < 2) return priceRows;
    return priceRows.filter((row) =>
      rowHasDifferences(selectedQuotes.map((quote) => row.quoteValues[quote.id] ?? ''))
    );
  }, [selectedCount, selectedQuotes, showOnlyDifferences]);

  const visibleDetailRows = useMemo(() => {
    if (!showOnlyDifferences || selectedCount < 2) return detailRows;
    return detailRows.filter((row) =>
      rowHasDifferences(selectedQuotes.map((quote) => row.quoteValues[quote.id]?.value ?? ''))
    );
  }, [selectedCount, selectedQuotes, showOnlyDifferences]);

  return (
    <DashboardShell header={<TopNavbar />}>
      <div ref={pageRootRef} className="space-y-4 pb-6 pt-1">
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#7080a8]">
          <Link href="/home" className="hover:text-[#173cab]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#8ea0c7]" />
          <Link href="/quotes" className="hover:text-[#173cab]">
            My Quotes
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#8ea0c7]" />
          <span className="text-[#4e6397]">Compare Quotes</span>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[23px] font-semibold tracking-[-0.03em] text-[#173cab]">
                    Compare Quotes
                  </h1>
                  <span className="rounded-full bg-[#dff5e7] px-3 py-1 text-[12px] font-semibold text-[#18965c]">
                    {selectedCount} {selectedCount === 1 ? 'Garage' : 'Garages'} Selected
                  </span>
                </div>
                <p className="mt-2 text-[15px] text-[#6174a2]">
                  Compare prices, services, ratings and more to choose the best garage for your car.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <Link
                  href="/quotes"
                  className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[12px] border border-[#cad7ff] bg-white px-5 text-[14px] font-semibold text-[#2451f6]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to My Quotes</span>
                </Link>

                <div className="flex items-center gap-3 text-[13px] font-medium text-[#6174a2]">
                  <span className="inline-flex items-center gap-1.5">
                    Show only key differences
                    <Info className="h-3.5 w-3.5 text-[#7f92c7]" />
                  </span>
                  <button
                    type="button"
                    aria-label="Show only key differences"
                    onClick={() => setShowOnlyDifferences((current) => !current)}
                    className={cn(
                      'flex h-5 w-9 items-center rounded-full px-[2px] transition-colors cursor-pointer',
                      showOnlyDifferences ? 'justify-end bg-[#2451f6]' : 'bg-[#d9deef]'
                    )}
                  >
                    <span className="h-4 w-4 rounded-full bg-white shadow-[0_2px_4px_rgba(35,61,128,0.18)]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3" style={topCardsGridStyle}>
              <Card className="h-[364px] rounded-[16px] border-[#e3eafc] bg-white px-3.5 py-4 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
                <div className="flex items-start gap-3">
                  <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[#cdddff] bg-white text-[#2451f6]">
                    <Image
                      src="/assets/Robo_icon.png"
                      alt="Wrectfai"
                      width={29}
                      height={29}
                      className="h-[29px] w-[29px] object-contain"
                    />
                  </span>
                  <div className="text-[14px] font-semibold leading-6 text-[#1e48d4]">
                    Wrectfai Estimated
                    <br />
                    Price
                  </div>
                </div>

                <div className="mt-3 border-t border-[#edf2fb] pt-3 text-[12px] leading-6 text-[#5f719d]">
                  Based on your selected
                  <br />
                  issues and market data
                </div>

                <div className="mt-[54px] text-center text-[18px] font-semibold tracking-[-0.02em] text-[#183db0]">
                  {RUPEE}2,800 - {RUPEE}3,600
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex h-[36px] w-full items-center justify-center gap-1 rounded-[10px] border border-[#c7d6ff] px-2 text-[11px] font-semibold text-[#2451f6] whitespace-nowrap"
                >
                  <span>View Estimate Details</span>
                  <Info className="h-3.5 w-3.5" />
                </button>
              </Card>

              {selectedQuotes.map((quote) => (
                <Card
                  key={quote.id}
                  className="h-[364px] rounded-[16px] border-[#e3eafc] bg-white px-3.5 py-3.5 shadow-[0_8px_24px_rgba(37,73,153,0.04)]"
                >
                  <div className="flex items-start justify-between">
                    <input
                      type="checkbox"
                      checked={selectedQuoteIds.includes(quote.id)}
                      onChange={() => toggleQuote(quote.id)}
                      className="mt-1 h-4 w-4 cursor-pointer rounded border-[#c9d6ff] text-[#2451f6] focus:ring-0"
                    />
                    <button type="button" className="text-[#2451f6]">
                      <MoreHorizontal className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-start gap-2.5">
                    <Image
                      src={quote.image}
                      alt={quote.garage}
                      width={74}
                      height={62}
                      className="h-[62px] w-[74px] rounded-[10px] object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#173cab]">{quote.garage}</div>
                      <div className="mt-2 flex items-center gap-2 text-[12px] text-[#5d709d]">
                        <span className="font-semibold text-[#173cab]">{quote.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-[#ffb800] text-[#ffb800]" />
                        <span>({quote.reviews})</span>
                      </div>
                      <div className="mt-1.5 text-[12px] text-[#5d709d]">{quote.distance}</div>
                      {quote.tag ? (
                        <span
                          className={cn(
                            'mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold',
                            garageTagTone(quote.id)
                          )}
                        >
                          {quote.tag}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#edf2fb] pt-3 text-center">
                    <div className="text-[17px] font-semibold tracking-[-0.02em] text-[#173cab]">
                      {quote.price}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e8f7ee] px-2.5 py-1 text-[10px] font-semibold text-[#18965c]">
                      <span>You save {quote.savings} (vs Wrectfai high)</span>
                      <Info className="h-3 w-3 text-[#7789b3]" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-1.5">
                    {actionItems.map(({ label, icon: Icon, tone }) => (
                      <button
                        key={`${quote.id}-${label}`}
                        type="button"
                        className="flex flex-col items-center gap-2 text-center"
                      >
                        <span
                          className={cn(
                            'flex h-[32px] w-[32px] items-center justify-center rounded-full border bg-white',
                            tone === 'purple'
                              ? 'border-[#eedaff] text-[#d145ff]'
                              : 'border-[#dbe5ff] text-[#2451f6]'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-medium leading-4',
                            tone === 'purple' ? 'text-[#8f53d8]' : 'text-[#2451f6]'
                          )}
                        >
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                </Card>
              ))}

              {showAddGarageCard ? (
                <Card className="flex h-[364px] min-h-0 flex-col rounded-[16px] border border-dashed border-[#cddafe] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8ff_100%)] px-3.5 pt-3.5 pb-0 shadow-[0_8px_24px_rgba(37,73,153,0.03)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#edf3ff] text-[#2451f6]">
                      <BadgePlus className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-[#173cab]">Add Another Garage</div>
                      <div className="mt-1 text-[11px] text-[#6174a2]">You can compare up to 3 garages.</div>
                    </div>
                  </div>

                  <div className="mt-3 flex-1 space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#d9e4ff_transparent] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d9e4ff] [&::-webkit-scrollbar-track]:bg-transparent">
                    {availableQuotes.map((quote) => (
                      <div
                        key={`available-${quote.id}`}
                        className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-2.5 gap-y-1.5 rounded-[12px] border border-[#e5ecff] bg-white px-2.5 py-2.5"
                      >
                        <Image
                          src={quote.image}
                          alt={quote.garage}
                          width={48}
                          height={40}
                          className="row-span-2 h-[40px] w-[48px] self-start rounded-[8px] object-cover"
                        />

                        <div className="min-w-0">
                          <div className="line-clamp-2 text-[12px] font-semibold leading-4 text-[#173cab]">
                            {quote.garage}
                          </div>
                          <div className="mt-1 text-[10px] leading-4 text-[#6174a2]">
                            <span className="font-semibold text-[#173cab]">{quote.rating}</span>{' '}
                            <span className="text-[#ffb800]">{'\u2605'}</span> ({quote.reviews}) {BULLET}{' '}
                            {quote.distance}
                          </div>
                        </div>

                        <div className="col-start-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => toggleQuote(quote.id)}
                            className="inline-flex h-[28px] items-center justify-center rounded-[9px] border border-[#c8d6ff] px-3 text-[11px] font-semibold text-[#2451f6] hover:bg-[#f5f8ff]"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>

            <Card className="overflow-hidden rounded-[16px] border-[#e3eafc] bg-white shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
              <div className="grid border-b border-[#e9eefb] bg-white" style={tableGridStyle}>
                <div className="px-4 py-3 text-[13px] font-semibold text-[#173cab]">
                  Price Breakup{' '}
                  <span className="text-[11px] font-medium text-[#7c8bb5]">(Incl. taxes)</span>
                </div>
                <div className="px-3 py-3 text-center text-[12px] font-semibold leading-5 text-[#3d56aa]">
                  Wrectfai Estimated Price
                  <div className="text-[11px] font-medium text-[#7c8bb5]">(For reference)</div>
                </div>
                {selectedQuotes.map((quote) => (
                  <div
                    key={`header-${quote.id}`}
                    className="px-3 py-3 text-center text-[12px] font-semibold leading-5 text-[#3d56aa]"
                  >
                    {quote.garage}
                  </div>
                ))}
              </div>

              {visiblePriceRows.map((row, rowIndex) => (
                <div
                  key={row.label}
                  className={cn(
                    'grid border-b border-[#e9eefb]',
                    row.emphasize && 'bg-[#f3f7ff]',
                    row.savings && 'bg-[#f1fbf4]',
                    rowIndex === visiblePriceRows.length - 1 && 'border-b-0'
                  )}
                  style={tableGridStyle}
                >
                  <div
                    className={cn(
                      'px-4 py-2.5 text-[13px]',
                      row.emphasize ? 'font-semibold text-[#2451f6]' : 'text-[#30456f]',
                      row.savings && 'whitespace-nowrap font-semibold text-[#6277ab]'
                    )}
                  >
                    {row.label}
                  </div>
                  <div
                    className={cn(
                      'px-3 py-2.5 text-center text-[13px]',
                      row.emphasize ? 'text-[15px] font-semibold text-[#159a5d]' : 'text-[#4f6390]',
                      row.savings && 'font-medium text-[#6277ab]'
                    )}
                  >
                    {row.aiValue}
                    {row.emphasize ? <Info className="ml-1 inline h-3.5 w-3.5 text-[#8092bb]" /> : null}
                  </div>
                  {selectedQuotes.map((quote) => (
                    <div
                      key={`${row.label}-${quote.id}`}
                      className={cn(
                        'px-3 py-2.5 text-center text-[13px]',
                        row.emphasize ? 'text-[15px] font-semibold text-[#159a5d]' : 'text-[#4f6390]',
                        row.savings && 'font-semibold text-[#159a5d]'
                      )}
                    >
                      {row.quoteValues[quote.id]}
                    </div>
                  ))}
                </div>
              ))}
            </Card>

            <Card className="overflow-hidden rounded-[16px] border-[#e3eafc] bg-white shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
              <div className="border-b border-[#e9eefb] px-4 py-3 text-[13px] font-semibold text-[#173cab]">
                Service &amp; Other Details
              </div>

              {visibleDetailRows.map((row, rowIndex) => {
                const RowIcon = row.icon;

                return (
                  <div
                    key={row.label}
                    className={cn(
                      'grid border-b border-[#e9eefb]',
                      rowIndex === visibleDetailRows.length - 1 && 'border-b-0'
                    )}
                    style={tableGridStyle}
                  >
                    <div className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#4c5f8f]">
                      <RowIcon
                        className={cn(
                          'h-3.5 w-3.5 shrink-0',
                          row.label === 'Rating (Reviews)' ? 'fill-[#ffb800] text-[#ffb800]' : 'text-[#7a8bb8]'
                        )}
                      />
                      <span>{row.label}</span>
                    </div>
                    <div className="px-3 py-2.5 text-center text-[13px] text-[#6478ab]">{row.aiValue}</div>

                    {selectedQuotes.map((quote) => {
                      const item = row.quoteValues[quote.id];
                      return (
                      <div
                        key={`${row.label}-${quote.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] text-[#3c57ad]"
                      >
                        {item ? serviceIcon(item.state) : null}
                        <span>{item?.value ?? '\u2013'}</span>
                      </div>
                    );
                    })}
                  </div>
                );
              })}
            </Card>

            <div className="flex items-center justify-center gap-3">
              {['\u2039', '1', '\u203A'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    'flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border text-[13px] font-semibold',
                    item === '1'
                      ? 'border-[#2451f6] bg-[#2451f6] px-2.5 text-white'
                      : 'border-[#dbe5ff] bg-white px-2 text-[#6377aa]'
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-center text-[14px] text-[#6a7eb0]">
              <WalletCards className="h-4 w-4 text-[#7183b0]" />
              <span>We do not charge any platform fee. You pay the garage directly.</span>
            </div>
          </div>

          <div className="space-y-5 xl:pt-[58px]">
            <Card className="rounded-[16px] border-[#e3eafc] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[15px] font-semibold text-[#173cab]">Your Request Summary</h3>
                <button type="button" className="text-[13px] font-semibold text-[#2451f6]">
                  Edit Request
                </button>
              </div>

              <div className="mt-8 space-y-8">
                <div>
                  <div className="text-[13px] font-semibold text-[#6174a2]">Vehicle</div>
                  <div className="mt-3 text-[14px] font-semibold text-[#173cab]">
                    Honda City (TS07 AB 1234)
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-[#6579a8]">
                    <span>Petrol</span>
                    <span>{BULLET}</span>
                    <span>2018</span>
                    <span>{BULLET}</span>
                    <span>58,320 km</span>
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-semibold text-[#6174a2]">Issues Requested (2)</div>
                  <div className="mt-4 space-y-3 text-[14px] text-[#2451f6]">
                    <div>{BULLET} &nbsp;Wheel Balancing Issue</div>
                    <div>{BULLET} &nbsp;Wheel Alignment Issue</div>
                  </div>
                </div>

                <div className="border-t border-[#ebf0fb] pt-6">
                  <div className="text-[13px] font-semibold text-[#6174a2]">Request sent on</div>
                  <div className="mt-3 text-[14px] text-[#2451f6]">20 May 2024, 10:30 AM</div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[16px] border-[#e3eafc] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
              <div className="flex items-start gap-4">
                <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#f4f7ff] text-[#2451f6]">
                  <Scale className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#173cab]">Why compare quotes?</h3>
                  <div className="mt-4 space-y-4 text-[14px] text-[#4f6390]">
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck className="h-4 w-4 text-[#18a15e]" />
                      <span>Ensure you get the best price</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck className="h-4 w-4 text-[#18a15e]" />
                      <span>Compare services &amp; inclusions</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck className="h-4 w-4 text-[#18a15e]" />
                      <span>Check ratings &amp; garage reliability</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck className="h-4 w-4 text-[#18a15e]" />
                      <span>Choose with confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[16px] border-[#dceee5] bg-[linear-gradient(180deg,#fbfffd_0%,#f8fffb_100%)] px-5 py-5 shadow-[0_8px_24px_rgba(37,73,153,0.04)]">
              <div className="flex items-start gap-4">
                <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#e9f7ef] text-[#16975b]">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#159a5d]">Your data is safe with us</h3>
                  <p className="mt-2 text-[14px] leading-6 text-[#62749f]">
                    We only share your request
                    <br />
                    with verified and trusted garages.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default CompareQuotesPage;
