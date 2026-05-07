'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Battery,
  CarFront,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
  Gauge,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Tag,
  Wrench,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { cn } from '@/utils/cn';

type DealCategory =
  | 'All Deals'
  | 'Car Care'
  | 'Service'
  | 'Parts & Accessories'
  | 'Tyres'
  | 'Batteries'
  | 'Combo Deals';

type SortOption =
  | 'Most Relevant'
  | 'Price: Low to High'
  | 'Price: High to Low'
  | 'Highest Discount'
  | 'Most Used';

type DealItem = {
  id: string;
  badge: string;
  badgeColor: string;
  icon: LucideIcon;
  title: string;
  bullets: string[];
  pricePrefix?: string;
  displayPrice: string;
  numericPrice: number;
  strikePrice?: string;
  strikePriceLineThrough?: boolean;
  discountLabel?: string;
  discountPercent: number;
  validTill: string;
  usedCount: string;
  usedCountValue: number;
  image: string;
  imageClassName: string;
  cardTint: string;
  imageGlow: string;
  accent: string;
  categories: Exclude<DealCategory, 'All Deals'>[];
  isCombo: boolean;
  relevance: number;
};

const dealFilters: { label: DealCategory; icon: LucideIcon }[] = [
  { label: 'All Deals', icon: Tag },
  { label: 'Car Care', icon: CarFront },
  { label: 'Service', icon: Wrench },
  { label: 'Parts & Accessories', icon: ShieldCheck },
  { label: 'Tyres', icon: Gauge },
  { label: 'Batteries', icon: Battery },
  { label: 'Combo Deals', icon: Snowflake },
];

const deals: DealItem[] = [
  {
    id: 'summer-care-combo',
    badge: 'SUMMER CARE COMBO',
    badgeColor: 'text-[#ff7a00]',
    icon: Snowflake,
    title: 'Coolant + AC + Engine Oil Combo',
    bullets: ['Improves engine cooling', 'Enhances AC performance', 'Extends engine life'],
    displayPrice: '\u20B92,999',
    numericPrice: 2999,
    strikePrice: '\u20B94,500',
    strikePriceLineThrough: true,
    discountLabel: '33% OFF',
    discountPercent: 33,
    validTill: '30 Apr 2025',
    usedCount: '1.2K times',
    usedCountValue: 1200,
    image: '/assets/summer_combo_1778070704538.png',
    imageClassName: 'h-[148px] w-[178px] object-contain',
    cardTint: 'from-[#fffaf0] via-[#fffaf5] to-[#fff4e7]',
    imageGlow: 'bg-[radial-gradient(circle_at_75%_45%,rgba(255,160,64,0.28),transparent_36%)]',
    accent: 'text-[#f04f23]',
    categories: ['Car Care', 'Service', 'Combo Deals'],
    isCombo: true,
    relevance: 99,
  },
  {
    id: 'monsoon-care-combo',
    badge: 'MONSOON CARE COMBO',
    badgeColor: 'text-[#1c9b6e]',
    icon: Snowflake,
    title: 'Wiper Blades + Tyres + Checkup Combo',
    bullets: ['Clear visibility in rain', 'Better grip on wet roads', 'Comprehensive vehicle check'],
    displayPrice: '\u20B91,999',
    numericPrice: 1999,
    strikePrice: '\u20B93,000',
    strikePriceLineThrough: true,
    discountLabel: '33% OFF',
    discountPercent: 33,
    validTill: '15 May 2025',
    usedCount: '986 times',
    usedCountValue: 986,
    image: '/assets/wiper_blade_1778070781712.png',
    imageClassName: 'h-[150px] w-[182px] object-cover rounded-[20px]',
    cardTint: 'from-[#f3fffb] via-[#f7fffd] to-[#eef8ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_72%_42%,rgba(80,178,202,0.26),transparent_38%)]',
    accent: 'text-[#178e56]',
    categories: ['Service', 'Tyres', 'Combo Deals'],
    isCombo: true,
    relevance: 97,
  },
  {
    id: 'winter-care-combo',
    badge: 'WINTER CARE COMBO',
    badgeColor: 'text-[#2454f6]',
    icon: Snowflake,
    title: 'Battery + Engine Oil + Coolant Combo',
    bullets: ['Reliable cold starts', 'Smooth engine performance', 'Prevents overheating'],
    displayPrice: '\u20B92,499',
    numericPrice: 2499,
    strikePrice: '\u20B93,800',
    strikePriceLineThrough: true,
    discountLabel: '34% OFF',
    discountPercent: 34,
    validTill: '31 May 2025',
    usedCount: '754 times',
    usedCountValue: 754,
    image: '/assets/winter_combo_1778070734722.png',
    imageClassName: 'h-[146px] w-[180px] object-contain',
    cardTint: 'from-[#f7fbff] via-[#fbfdff] to-[#eef4ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_76%_48%,rgba(112,147,255,0.22),transparent_36%)]',
    accent: 'text-[#2050ff]',
    categories: ['Batteries', 'Service', 'Combo Deals'],
    isCombo: true,
    relevance: 96,
  },
  {
    id: 'brake-care-special',
    badge: 'BRAKE CARE SPECIAL',
    badgeColor: 'text-[#ff453a]',
    icon: ShieldCheck,
    title: 'Brake Pads + Disc Inspection',
    bullets: ['Enhanced braking safety', 'Smoother performance', 'Expert inspection included'],
    displayPrice: '28% OFF',
    numericPrice: 1299,
    strikePrice: 'Starting \u20B91,299',
    strikePriceLineThrough: false,
    discountPercent: 28,
    validTill: '20 Apr 2025',
    usedCount: '1.1K times',
    usedCountValue: 1100,
    image: '/assets/brake_disc_1778070670609.png',
    imageClassName: 'h-[146px] w-[170px] object-contain',
    cardTint: 'from-[#fff6f6] via-[#fffaf9] to-[#fff5f4]',
    imageGlow: 'bg-[radial-gradient(circle_at_76%_42%,rgba(255,96,96,0.16),transparent_34%)]',
    accent: 'text-[#ff2f1d]',
    categories: ['Service', 'Parts & Accessories'],
    isCombo: false,
    relevance: 95,
  },
  {
    id: 'ac-service-offer',
    badge: 'AC SERVICE OFFER',
    badgeColor: 'text-[#2d5bff]',
    icon: Snowflake,
    title: 'AC Checkup + Gas Top-up',
    bullets: ['Better cooling efficiency', 'Gas top-up for optimal performance', 'Expert AC checkup'],
    pricePrefix: 'Starting',
    displayPrice: '\u20B91,199',
    numericPrice: 1199,
    strikePrice: '\u20B91,599',
    strikePriceLineThrough: true,
    discountLabel: '26% OFF',
    discountPercent: 26,
    validTill: '25 Apr 2025',
    usedCount: '893 times',
    usedCountValue: 893,
    image: '/assets/ac_vent_1778070688367.png',
    imageClassName: 'h-[148px] w-[176px] object-contain',
    cardTint: 'from-[#f4f8ff] via-[#f8fbff] to-[#eff4ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_45%,rgba(105,139,255,0.18),transparent_36%)]',
    accent: 'text-[#2250df]',
    categories: ['Car Care', 'Service'],
    isCombo: false,
    relevance: 94,
  },
  {
    id: 'tyre-special-offer',
    badge: 'TYRE SPECIAL OFFER',
    badgeColor: 'text-[#ff9a00]',
    icon: Gauge,
    title: 'Buy 3 Tyres, Get 1 Free',
    bullets: ['Premium tyre brands', 'Better road grip & safety', 'Long lasting performance'],
    displayPrice: '3+1',
    numericPrice: 3,
    strikePrice: 'FREE',
    strikePriceLineThrough: false,
    discountPercent: 25,
    validTill: '10 May 2025',
    usedCount: '642 times',
    usedCountValue: 642,
    image: '/assets/tyre_gauge_1778070752781.png',
    imageClassName: 'h-[150px] w-[178px] object-contain',
    cardTint: 'from-[#fff8ed] via-[#fffdf8] to-[#fff6e7]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_42%,rgba(255,190,62,0.18),transparent_36%)]',
    accent: 'text-[#ff7b00]',
    categories: ['Tyres', 'Combo Deals'],
    isCombo: true,
    relevance: 93,
  },
  {
    id: 'battery-special',
    badge: 'BATTERY SPECIAL',
    badgeColor: 'text-[#7a3df3]',
    icon: Battery,
    title: 'Amaron 60Ah Battery',
    bullets: ['36 Months Warranty', 'High Cranking Power', 'Maintenance Free'],
    displayPrice: '\u20B94,999',
    numericPrice: 4999,
    strikePrice: '\u20B96,200',
    strikePriceLineThrough: true,
    discountLabel: '33% OFF',
    discountPercent: 33,
    validTill: '18 Apr 2025',
    usedCount: '512 times',
    usedCountValue: 512,
    image: 'https://www.amaron.in/cdn/shop/files/Amaron_PRO_12V_60AH.png?v=1713878174&width=600',
    imageClassName: 'h-[146px] w-[170px] object-contain',
    cardTint: 'from-[#faf5ff] via-[#fdfbff] to-[#f7f0ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_42%,rgba(165,108,255,0.18),transparent_36%)]',
    accent: 'text-[#7d2ee6]',
    categories: ['Batteries', 'Parts & Accessories'],
    isCombo: false,
    relevance: 92,
  },
  {
    id: 'detailing-deal',
    badge: 'DETAILING DEAL',
    badgeColor: 'text-[#23a85f]',
    icon: ClipboardList,
    title: 'Premium Car Detailing',
    bullets: ['Interior Deep Cleaning', 'Exterior Polish & Wax', 'Dashboard & Glass Cleaning'],
    displayPrice: '\u20B91,799',
    numericPrice: 1799,
    strikePrice: '\u20B92,499',
    strikePriceLineThrough: true,
    discountLabel: '28% OFF',
    discountPercent: 28,
    validTill: '22 Apr 2025',
    usedCount: '721 times',
    usedCountValue: 721,
    image: 'https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?auto=format&fit=crop&w=600&q=80',
    imageClassName: 'h-[150px] w-[182px] object-cover rounded-[22px]',
    cardTint: 'from-[#f3fff7] via-[#f9fff9] to-[#eefcf3]',
    imageGlow: 'bg-[radial-gradient(circle_at_76%_46%,rgba(105,205,145,0.18),transparent_36%)]',
    accent: 'text-[#179556]',
    categories: ['Car Care', 'Service'],
    isCombo: false,
    relevance: 91,
  },
  {
    id: 'accessories-deal',
    badge: 'ACCESSORIES DEAL',
    badgeColor: 'text-[#a14cf5]',
    icon: ShieldCheck,
    title: 'Dashcam + Installation',
    bullets: ['Full HD Recording', 'Night Vision Support', 'Professional Installation'],
    displayPrice: '\u20B93,499',
    numericPrice: 3499,
    strikePrice: '\u20B94,999',
    strikePriceLineThrough: true,
    discountLabel: '30% OFF',
    discountPercent: 30,
    validTill: '30 Apr 2025',
    usedCount: '430 times',
    usedCountValue: 430,
    image: 'https://images.unsplash.com/photo-1624971900024-a8d13f60c628?auto=format&fit=crop&w=600&q=80',
    imageClassName: 'h-[140px] w-[176px] object-contain',
    cardTint: 'from-[#fbf6ff] via-[#fefcff] to-[#f8f0ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_42%,rgba(177,118,255,0.18),transparent_36%)]',
    accent: 'text-[#933ce6]',
    categories: ['Parts & Accessories'],
    isCombo: false,
    relevance: 90,
  },
  {
    id: 'engine-oil-filter-pack',
    badge: 'SERVICE VALUE PACK',
    badgeColor: 'text-[#2162f2]',
    icon: Wrench,
    title: 'Engine Oil + Oil Filter Replacement',
    bullets: ['Synthetic oil options', 'OEM compatible filter', 'Quick 45 min service'],
    pricePrefix: 'Starting',
    displayPrice: '\u20B91,599',
    numericPrice: 1599,
    strikePrice: '\u20B92,050',
    strikePriceLineThrough: true,
    discountLabel: '22% OFF',
    discountPercent: 22,
    validTill: '14 May 2025',
    usedCount: '688 times',
    usedCountValue: 688,
    image: '/assets/oil_pour_1778070767058.png',
    imageClassName: 'h-[142px] w-[170px] object-contain',
    cardTint: 'from-[#f2f7ff] via-[#fbfdff] to-[#eef5ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_45%,rgba(78,126,255,0.16),transparent_36%)]',
    accent: 'text-[#1e55df]',
    categories: ['Service', 'Car Care'],
    isCombo: false,
    relevance: 89,
  },
  {
    id: 'wheel-alignment-balancing',
    badge: 'TYRE CARE DEAL',
    badgeColor: 'text-[#f59b14]',
    icon: Gauge,
    title: 'Wheel Alignment + Balancing',
    bullets: ['Improved straight-line stability', 'Reduced tyre wear', 'Computerized balancing'],
    displayPrice: '\u20B9999',
    numericPrice: 999,
    strikePrice: '\u20B91,399',
    strikePriceLineThrough: true,
    discountLabel: '29% OFF',
    discountPercent: 29,
    validTill: '11 May 2025',
    usedCount: '574 times',
    usedCountValue: 574,
    image: '/assets/tyre_gauge_1778070752781.png',
    imageClassName: 'h-[146px] w-[168px] object-contain',
    cardTint: 'from-[#fff8ef] via-[#fffdf8] to-[#fff7ea]',
    imageGlow: 'bg-[radial-gradient(circle_at_72%_44%,rgba(255,178,76,0.16),transparent_36%)]',
    accent: 'text-[#ff8c00]',
    categories: ['Tyres', 'Service'],
    isCombo: false,
    relevance: 88,
  },
  {
    id: 'battery-health-check',
    badge: 'BATTERY CHECK OFFER',
    badgeColor: 'text-[#6d3ef4]',
    icon: Battery,
    title: 'Battery Health Check + Terminal Cleaning',
    bullets: ['Voltage and cranking test', 'Corrosion cleaning', 'Charging system inspection'],
    displayPrice: '\u20B9399',
    numericPrice: 399,
    strikePrice: '\u20B9699',
    strikePriceLineThrough: true,
    discountLabel: '43% OFF',
    discountPercent: 43,
    validTill: '08 May 2025',
    usedCount: '389 times',
    usedCountValue: 389,
    image: '/assets/winter_combo_1778070734722.png',
    imageClassName: 'h-[134px] w-[166px] object-contain',
    cardTint: 'from-[#faf5ff] via-[#fffaff] to-[#f6efff]',
    imageGlow: 'bg-[radial-gradient(circle_at_72%_44%,rgba(166,103,255,0.16),transparent_36%)]',
    accent: 'text-[#7b2fe6]',
    categories: ['Batteries', 'Service'],
    isCombo: false,
    relevance: 87,
  },
  {
    id: 'ceramic-coating-lite',
    badge: 'CAR CARE PREMIUM',
    badgeColor: 'text-[#17a46f]',
    icon: CarFront,
    title: 'Ceramic Coating Lite Package',
    bullets: ['Gloss protection layer', 'Hydrophobic finish', 'Two-month paint protection'],
    displayPrice: '\u20B95,999',
    numericPrice: 5999,
    strikePrice: '\u20B97,999',
    strikePriceLineThrough: true,
    discountLabel: '25% OFF',
    discountPercent: 25,
    validTill: '28 May 2025',
    usedCount: '268 times',
    usedCountValue: 268,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    imageClassName: 'h-[148px] w-[180px] object-cover rounded-[20px]',
    cardTint: 'from-[#f2fff8] via-[#fcfffd] to-[#eefcf6]',
    imageGlow: 'bg-[radial-gradient(circle_at_76%_42%,rgba(88,198,145,0.18),transparent_36%)]',
    accent: 'text-[#179556]',
    categories: ['Car Care', 'Service'],
    isCombo: false,
    relevance: 86,
  },
  {
    id: 'wiper-visibility-pack',
    badge: 'MONSOON PREP',
    badgeColor: 'text-[#14997e]',
    icon: Snowflake,
    title: 'Wiper Replacement + Washer Fluid Top-up',
    bullets: ['Streak-free windshield clearing', 'Premium washer fluid', 'Quick installation'],
    displayPrice: '\u20B9799',
    numericPrice: 799,
    strikePrice: '\u20B91,099',
    strikePriceLineThrough: true,
    discountLabel: '27% OFF',
    discountPercent: 27,
    validTill: '17 May 2025',
    usedCount: '447 times',
    usedCountValue: 447,
    image: '/assets/wiper_blade_1778070781712.png',
    imageClassName: 'h-[144px] w-[176px] object-cover rounded-[20px]',
    cardTint: 'from-[#f2fffb] via-[#fcfffe] to-[#effaf8]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_44%,rgba(83,189,176,0.16),transparent_36%)]',
    accent: 'text-[#178e56]',
    categories: ['Service', 'Parts & Accessories', 'Combo Deals'],
    isCombo: true,
    relevance: 85,
  },
  {
    id: 'seat-cover-combo',
    badge: 'INTERIOR ACCESSORIES',
    badgeColor: 'text-[#9749f1]',
    icon: ShieldCheck,
    title: 'Seat Covers + Steering Cover Combo',
    bullets: ['Custom fit options', 'Premium stitch finish', 'Installation included'],
    displayPrice: '\u20B92,799',
    numericPrice: 2799,
    strikePrice: '\u20B93,999',
    strikePriceLineThrough: true,
    discountLabel: '30% OFF',
    discountPercent: 30,
    validTill: '24 May 2025',
    usedCount: '341 times',
    usedCountValue: 341,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
    imageClassName: 'h-[146px] w-[180px] object-cover rounded-[20px]',
    cardTint: 'from-[#fcf6ff] via-[#fffdfd] to-[#f8f0ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_44%,rgba(173,109,255,0.16),transparent_36%)]',
    accent: 'text-[#933ce6]',
    categories: ['Parts & Accessories', 'Combo Deals'],
    isCombo: true,
    relevance: 84,
  },
  {
    id: 'road-trip-inspection',
    badge: 'TRAVEL READY CHECK',
    badgeColor: 'text-[#1d5ef0]',
    icon: ClipboardList,
    title: '25-Point Road Trip Inspection',
    bullets: ['Fluids, brakes and tyres', 'Battery and AC check', 'Travel readiness report'],
    displayPrice: '\u20B9699',
    numericPrice: 699,
    strikePrice: '\u20B9999',
    strikePriceLineThrough: true,
    discountLabel: '30% OFF',
    discountPercent: 30,
    validTill: '21 May 2025',
    usedCount: '612 times',
    usedCountValue: 612,
    image: '/assets/garage_1_1778071156220.png',
    imageClassName: 'h-[142px] w-[176px] object-cover rounded-[20px]',
    cardTint: 'from-[#f4f8ff] via-[#fbfdff] to-[#eef4ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_44%,rgba(93,133,255,0.16),transparent_36%)]',
    accent: 'text-[#2250df]',
    categories: ['Service', 'Car Care'],
    isCombo: false,
    relevance: 83,
  },
  {
    id: 'alloy-wheel-protect',
    badge: 'WHEEL ACCESSORY DEAL',
    badgeColor: 'text-[#ee8b08]',
    icon: Gauge,
    title: 'Alloy Wheel Protectant + Polish',
    bullets: ['Protects from brake dust', 'Restores wheel shine', 'Quick same-day service'],
    displayPrice: '\u20B9899',
    numericPrice: 899,
    strikePrice: '\u20B91,299',
    strikePriceLineThrough: true,
    discountLabel: '31% OFF',
    discountPercent: 31,
    validTill: '19 May 2025',
    usedCount: '278 times',
    usedCountValue: 278,
    image: '/assets/tyre_gauge_1778070752781.png',
    imageClassName: 'h-[146px] w-[170px] object-contain',
    cardTint: 'from-[#fff9ef] via-[#fffdf8] to-[#fff7ea]',
    imageGlow: 'bg-[radial-gradient(circle_at_72%_44%,rgba(255,182,79,0.16),transparent_36%)]',
    accent: 'text-[#ff8c00]',
    categories: ['Tyres', 'Car Care'],
    isCombo: false,
    relevance: 82,
  },
  {
    id: 'dual-dashcam-pro',
    badge: 'SAFETY UPGRADE',
    badgeColor: 'text-[#9440f1]',
    icon: ShieldCheck,
    title: 'Dual Channel Dashcam Pro Pack',
    bullets: ['Front and rear recording', 'Parking surveillance mode', 'Hardwiring included'],
    displayPrice: '\u20B96,999',
    numericPrice: 6999,
    strikePrice: '\u20B98,499',
    strikePriceLineThrough: true,
    discountLabel: '18% OFF',
    discountPercent: 18,
    validTill: '26 May 2025',
    usedCount: '193 times',
    usedCountValue: 193,
    image: 'https://images.unsplash.com/photo-1624971900024-a8d13f60c628?auto=format&fit=crop&w=600&q=80',
    imageClassName: 'h-[140px] w-[176px] object-contain',
    cardTint: 'from-[#fbf6ff] via-[#fefcff] to-[#f7efff]',
    imageGlow: 'bg-[radial-gradient(circle_at_74%_42%,rgba(173,109,255,0.16),transparent_36%)]',
    accent: 'text-[#933ce6]',
    categories: ['Parts & Accessories'],
    isCombo: false,
    relevance: 81,
  },
  {
    id: 'starter-battery-exchange',
    badge: 'BATTERY EXCHANGE',
    badgeColor: 'text-[#6f38f2]',
    icon: Battery,
    title: 'Old Battery Exchange Bonus Offer',
    bullets: ['Exchange your old unit', 'Instant installation', 'Pickup of old battery included'],
    displayPrice: '\u20B94,299',
    numericPrice: 4299,
    strikePrice: '\u20B95,399',
    strikePriceLineThrough: true,
    discountLabel: '20% OFF',
    discountPercent: 20,
    validTill: '16 May 2025',
    usedCount: '254 times',
    usedCountValue: 254,
    image: 'https://www.amaron.in/cdn/shop/files/Amaron_PRO_12V_60AH.png?v=1713878174&width=600',
    imageClassName: 'h-[142px] w-[166px] object-contain',
    cardTint: 'from-[#faf5ff] via-[#fffcff] to-[#f7f0ff]',
    imageGlow: 'bg-[radial-gradient(circle_at_72%_44%,rgba(166,103,255,0.16),transparent_36%)]',
    accent: 'text-[#7b2fe6]',
    categories: ['Batteries', 'Parts & Accessories'],
    isCombo: false,
    relevance: 80,
  },
  {
    id: 'full-service-combo',
    badge: 'ANNUAL SERVICE COMBO',
    badgeColor: 'text-[#1a9c61]',
    icon: Wrench,
    title: 'Periodic Service + Wheel Care Combo',
    bullets: ['Oil, filter and inspection', 'Alignment and balancing', 'Priority garage slot'],
    displayPrice: '\u20B93,999',
    numericPrice: 3999,
    strikePrice: '\u20B95,799',
    strikePriceLineThrough: true,
    discountLabel: '31% OFF',
    discountPercent: 31,
    validTill: '29 May 2025',
    usedCount: '467 times',
    usedCountValue: 467,
    image: '/assets/weekend_combo_1778071208387.png',
    imageClassName: 'h-[146px] w-[176px] object-contain',
    cardTint: 'from-[#f3fff8] via-[#fafffd] to-[#eefcf4]',
    imageGlow: 'bg-[radial-gradient(circle_at_76%_44%,rgba(88,198,145,0.18),transparent_36%)]',
    accent: 'text-[#179556]',
    categories: ['Service', 'Tyres', 'Combo Deals'],
    isCombo: true,
    relevance: 79,
  },
];

function FilterChip({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: DealCategory;
  icon: LucideIcon;
  active: boolean;
  onClick: (label: DealCategory) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-[11px] border px-4 text-[13px] font-semibold transition-colors',
        active
          ? 'border-[#1f5cff] bg-[#1f5cff] text-white shadow-[0_10px_22px_rgba(31,92,255,0.22)]'
          : 'border-[#e3eaf9] bg-white text-[#233b7a] hover:bg-[#f7faff]'
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      {label}
    </button>
  );
}

function DealCard({ deal }: { deal: DealItem }) {
  const DealIcon = deal.icon;

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-[18px] border-[#ebeff8] bg-gradient-to-br shadow-[0_14px_32px_rgba(21,47,112,0.07)]',
        deal.cardTint
      )}
    >
      <div className="grid min-h-[194px] grid-cols-[1.15fr_0.85fr]">
        <div className="px-4 pb-3 pt-3.5">
          <div
            className={cn(
              'flex items-center gap-2 text-[12px] font-extrabold tracking-[0.02em]',
              deal.badgeColor
            )}
          >
            <DealIcon className="h-4 w-4" strokeWidth={2.2} />
            <span>{deal.badge}</span>
          </div>
          <h3 className="mt-2 text-[16px] font-bold leading-[1.35] tracking-[-0.03em] text-[#17307a]">
            {deal.title}
          </h3>
          <ul className="mt-3 space-y-1.5">
            {deal.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-[13px] leading-5 text-[#46608f]">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1f8a48]" strokeWidth={2.6} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className={cn('absolute inset-0', deal.imageGlow)} />
          <div className="absolute inset-x-7 bottom-6 h-5 rounded-full bg-black/10 blur-xl" />
          <img
            src={deal.image}
            alt={deal.title}
            className={cn('absolute bottom-1 right-1 max-w-none', deal.imageClassName)}
          />
        </div>
      </div>

      <div className="border-t border-[#edf2fb] bg-white/78 px-4 pb-3 pt-2.5 backdrop-blur-sm">
        <div className="flex flex-wrap items-end gap-2">
          {deal.pricePrefix ? (
            <span className="pb-0.5 text-[13px] font-semibold text-[#35539c]">{deal.pricePrefix}</span>
          ) : null}
          <span className={cn('text-[18px] font-extrabold tracking-[-0.03em]', deal.accent)}>
            {deal.displayPrice}
          </span>
          {deal.strikePrice ? (
            <span
              className={cn(
                'pb-0.5 text-[13px] font-semibold',
                deal.strikePriceLineThrough ? 'text-[#8998b8] line-through' : 'text-[#35539c]'
              )}
            >
              {deal.strikePrice}
            </span>
          ) : null}
          {deal.discountLabel ? (
            <span className="rounded-full bg-[#e8f8ec] px-2 py-1 text-[11px] font-bold text-[#259450]">
              {deal.discountLabel}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-[12px] font-medium text-[#6b7da5]">
            <span>Valid till {deal.validTill}</span>
            <span>Used {deal.usedCount}</span>
          </div>
          <Button variant="outline" size="sm" className="rounded-[10px] px-3.5 text-[12px] font-bold text-[#1f5cff]">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DealsPageContent() {
  const [activeFilter, setActiveFilter] = useState<DealCategory>('All Deals');
  const [sortBy, setSortBy] = useState<SortOption>('Most Relevant');
  const [comboOnly, setComboOnly] = useState(false);
  const [under2000Only, setUnder2000Only] = useState(false);
  const [highDiscountOnly, setHighDiscountOnly] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 9;
  const filtersRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchTerm((customEvent.detail ?? '').trim().toLowerCase());
      setCurrentPage(1);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowMoreFilters(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    window.addEventListener('dashboard-search', handleSearch);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('dashboard-search', handleSearch);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredDeals = useMemo(() => {
    let nextDeals = deals.filter((deal) => {
      const matchesFilter =
        activeFilter === 'All Deals' ? true : deal.categories.includes(activeFilter);
      const matchesCombo = comboOnly ? deal.isCombo : true;
      const matchesBudget = under2000Only ? deal.numericPrice <= 2000 : true;
      const matchesDiscount = highDiscountOnly ? deal.discountPercent >= 30 : true;
      const matchesSearch = searchTerm
        ? [deal.title, deal.badge, ...deal.bullets].join(' ').toLowerCase().includes(searchTerm)
        : true;

      return (
        matchesFilter &&
        matchesCombo &&
        matchesBudget &&
        matchesDiscount &&
        matchesSearch
      );
    });

    nextDeals = [...nextDeals].sort((left, right) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return left.numericPrice - right.numericPrice;
        case 'Price: High to Low':
          return right.numericPrice - left.numericPrice;
        case 'Highest Discount':
          return right.discountPercent - left.discountPercent;
        case 'Most Used':
          return right.usedCountValue - left.usedCountValue;
        case 'Most Relevant':
        default:
          return right.relevance - left.relevance;
      }
    });

    return nextDeals;
  }, [activeFilter, comboOnly, highDiscountOnly, searchTerm, sortBy, under2000Only]);

  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / pageSize));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDeals.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredDeals]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
  }, [currentPage, totalPages]);

  const fromDeal = filteredDeals.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toDeal = Math.min(currentPage * pageSize, filteredDeals.length);

  const resetExtraFilters = () => {
    setActiveFilter('All Deals');
    setComboOnly(false);
    setUnder2000Only(false);
    setHighDiscountOnly(false);
    setCurrentPage(1);
  };

  const activeFiltersCount = (activeFilter !== 'All Deals' ? 1 : 0) + (comboOnly ? 1 : 0) + (under2000Only ? 1 : 0) + (highDiscountOnly ? 1 : 0);

  return (
    <div className="space-y-5 pb-6">
      <section className="rounded-[24px] border border-white/80 bg-[radial-gradient(circle_at_top,#fff5e9_0%,rgba(255,255,255,0.96)_22%,#ffffff_100%)] px-5 py-5 shadow-[0_16px_40px_rgba(22,48,112,0.06)] sm:px-6">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.04em] text-[#17307a] sm:text-[24px]">
              View All Deals
            </h1>
            <p className="mt-1 text-[15px] font-medium text-[#536891]">
              Great offers on car care, parts &amp; services
            </p>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            {/* Desktop Filters (Hidden on Mobile) */}
            <div className="hidden lg:flex w-full gap-2 sm:flex-wrap xl:flex-1">
              {dealFilters.map((filter) => (
                <div key={filter.label} className="shrink-0">
                  <FilterChip
                    label={filter.label}
                    icon={filter.icon}
                    active={activeFilter === filter.label}
                    onClick={(label) => {
                      setActiveFilter(label);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Desktop Action Row (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-wrap items-center justify-between gap-3 px-1 sm:px-0 xl:shrink-0">
              <div className="relative" ref={filtersRef}>
                <button
                  type="button"
                  onClick={() => setShowMoreFilters((current) => !current)}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-[11px] border px-4 text-[13px] font-semibold transition-colors',
                    comboOnly || under2000Only || highDiscountOnly
                      ? 'border-[#c8d7ff] bg-[#f2f6ff] text-[#1f5cff]'
                      : 'border-[#e3eaf9] bg-white text-[#233b7a] hover:bg-[#f7faff]'
                  )}
                >
                  <Filter className="h-4 w-4" />
                  More Filters
                </button>

                {showMoreFilters ? (
                  <div className="absolute left-0 top-[calc(100%+10px)] z-20 w-[260px] rounded-[16px] border border-[#e3eaf9] bg-white p-4 shadow-[0_18px_40px_rgba(21,47,112,0.12)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-[14px] font-bold text-[#17307a]">Filter deals</div>
                      <button
                        type="button"
                        onClick={resetExtraFilters}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4a66b1]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        ['Combo offers only', comboOnly, setComboOnly],
                        ['Under \u20B92,000', under2000Only, setUnder2000Only],
                        ['30%+ discount', highDiscountOnly, setHighDiscountOnly],
                      ].map(([label, checked, setter]) => (
                        <label
                          key={label as string}
                          className="flex cursor-pointer items-center justify-between gap-3 rounded-[12px] bg-[#f8faff] px-3 py-2.5 text-[13px] font-semibold text-[#29417a]"
                        >
                          <span>{label as string}</span>
                          <input
                            type="checkbox"
                            checked={checked as boolean}
                            onChange={(event) => {
                              (setter as (value: boolean) => void)(event.target.checked);
                              setCurrentPage(1);
                            }}
                            className="h-4 w-4 rounded border-[#c9d7f7] text-[#1f5cff] focus:ring-[#bfd0ff]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden text-[14px] font-semibold text-[#26408a] min-[360px]:inline">Sort By:</span>
                <div className="relative" ref={sortRef}>
                  <button
                    type="button"
                    onClick={() => setSortOpen((curr) => !curr)}
                    className={cn(
                      "flex h-10 min-w-[140px] sm:min-w-[172px] items-center justify-between rounded-[11px] border px-3 sm:px-4 text-[12px] sm:text-[13px] font-semibold transition-colors",
                      sortOpen ? "border-[#bfd0ff] bg-[#f8fbff] text-[#1a56db]" : "border-[#e3eaf9] bg-white text-[#233b7a]"
                    )}
                  >
                    <span className="truncate">{sortBy}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", sortOpen ? "rotate-180 text-[#1a56db]" : "text-[#6f80a8]")} />
                  </button>

                  {sortOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-40 flex w-[220px] flex-col rounded-[14px] border border-[#dbe6ff] bg-white p-2 shadow-[0_18px_40px_rgba(30,58,138,0.14)]">
                      {[
                        'Most Relevant',
                        'Price: Low to High',
                        'Price: High to Low',
                        'Highest Discount',
                        'Most Used',
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSortBy(option as SortOption);
                            setCurrentPage(1);
                            setSortOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                            sortBy === option
                              ? "bg-[#eef4ff] text-[#1a56db]"
                              : "text-[#17307a] hover:bg-[#f8fbff]"
                          )}
                        >
                          <span className="truncate">{option}</span>
                          {sortBy === option && <Check className="h-4 w-4 shrink-0 text-[#1a56db]" strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Action Row (Hidden on Desktop) */}
            <div className="flex lg:hidden flex-wrap items-center gap-3">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileFiltersOpen((curr) => !curr);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "flex h-11 w-full items-center justify-between rounded-[14px] border border-[#dbe6ff] bg-white px-4 text-[14px] font-semibold text-[#17307a] shadow-[0_8px_20px_rgba(30,58,138,0.04)]",
                    mobileFiltersOpen && "border-[#bfd1ff] bg-[#f8fbff]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <SlidersHorizontal className="h-4 w-4 text-[#1a56db]" />
                    Filters {activeFiltersCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a56db] text-[10px] font-bold text-white">{activeFiltersCount}</span>}
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-[#6173a1] transition-transform", mobileFiltersOpen && "rotate-180")} />
                </button>

                {mobileFiltersOpen && (
                  <div className="absolute left-0 right-0 top-[54px] z-30 flex flex-col gap-5 rounded-[18px] border border-[#dbe6ff] bg-white p-5 shadow-[0_24px_50px_rgba(30,58,138,0.16)]">
                    <div className="flex items-center justify-between border-b border-[#eef3ff] pb-3">
                      <span className="text-[16px] font-bold tracking-[-0.02em] text-[#17307a]">All Filters</span>
                      {activeFiltersCount > 0 && (
                        <button
                          type="button"
                          onClick={resetExtraFilters}
                          className="flex items-center gap-1.5 text-[13px] font-bold text-[#d14343]"
                        >
                          <X className="h-3.5 w-3.5" />
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Category Filter */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-[#17307a]">
                          <Tag className="h-4 w-4 text-[#6173a1]" />
                          Category
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                            className={cn(
                              "flex h-11 w-full items-center justify-between rounded-[12px] border px-3.5 text-[13px] font-semibold transition-colors",
                              mobileCategoryOpen ? "border-[#1a56db] bg-[#f2f6ff] text-[#1a56db]" : "border-[#e3eaf9] bg-[#f8fbff] text-[#17307a]"
                            )}
                          >
                            <span className="truncate">{activeFilter}</span>
                            <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", mobileCategoryOpen ? "text-[#1a56db] rotate-180" : "text-[#6173a1]")} />
                          </button>
                          
                          {mobileCategoryOpen && (
                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 flex flex-col rounded-[14px] border border-[#dbe6ff] bg-white p-2 shadow-[0_18px_40px_rgba(30,58,138,0.14)]">
                              {dealFilters.map((filter) => (
                                <button
                                  key={filter.label}
                                  type="button"
                                  onClick={() => {
                                    setActiveFilter(filter.label);
                                    setCurrentPage(1);
                                    setMobileCategoryOpen(false);
                                  }}
                                  className={cn(
                                    "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                                    activeFilter === filter.label ? "bg-[#eef4ff] text-[#1a56db]" : "text-[#17307a] hover:bg-[#f8fbff]"
                                  )}
                                >
                                  <span className="truncate">{filter.label}</span>
                                  {activeFilter === filter.label && <Check className="h-4 w-4 shrink-0 text-[#1a56db]" strokeWidth={3} />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Extra Filters */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-[#17307a]">
                          <Filter className="h-4 w-4 text-[#6173a1]" />
                          Extra Filters
                        </label>
                        <div className="flex flex-col gap-1 rounded-[12px] border border-[#e3eaf9] bg-[#f8fbff] p-3">
                          {[
                            ['Combo offers only', comboOnly, setComboOnly],
                            ['Under \u20B92,000', under2000Only, setUnder2000Only],
                            ['30%+ discount', highDiscountOnly, setHighDiscountOnly],
                          ].map(([label, checked, setter]) => (
                            <label
                              key={label as string}
                              className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-2 py-2 text-[13px] font-semibold text-[#29417a]"
                            >
                              <span>{label as string}</span>
                              <input
                                type="checkbox"
                                checked={checked as boolean}
                                onChange={(event) => {
                                  (setter as (value: boolean) => void)(event.target.checked);
                                  setCurrentPage(1);
                                }}
                                className="h-4 w-4 rounded border-[#c9d7f7] text-[#1f5cff] focus:ring-[#bfd0ff]"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative" ref={sortRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setSortOpen((curr) => !curr);
                      setMobileFiltersOpen(false);
                    }}
                    className={cn(
                      "flex h-11 min-w-[130px] items-center justify-between rounded-[14px] border px-3 sm:px-4 text-[13px] font-semibold transition-colors",
                      sortOpen ? "border-[#bfd0ff] bg-[#f8fbff] text-[#1a56db]" : "border-[#dbe6ff] bg-white text-[#17307a]"
                    )}
                  >
                    <span className="truncate">{sortBy}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", sortOpen ? "rotate-180 text-[#1a56db]" : "text-[#6f80a8]")} />
                  </button>

                  {sortOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-40 flex w-[220px] flex-col rounded-[14px] border border-[#dbe6ff] bg-white p-2 shadow-[0_18px_40px_rgba(30,58,138,0.14)]">
                      {[
                        'Most Relevant',
                        'Price: Low to High',
                        'Price: High to Low',
                        'Highest Discount',
                        'Most Used',
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSortBy(option as SortOption);
                            setCurrentPage(1);
                            setSortOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                            sortBy === option
                              ? "bg-[#eef4ff] text-[#1a56db]"
                              : "text-[#17307a] hover:bg-[#f8fbff]"
                          )}
                        >
                          <span className="truncate">{option}</span>
                          {sortBy === option && <Check className="h-4 w-4 shrink-0 text-[#1a56db]" strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-[12px] border border-[#deefe2] bg-[#f3fbf5] px-4 py-3 text-[14px] font-semibold text-[#21834c]">
            <ShieldCheck className="h-4 w-4" />
            Save more on services, parts and combos from trusted garages and partners.
          </div>
        </div>
      </section>

      {searchTerm ? (
        <div className="rounded-[16px] border border-[#e4ecff] bg-white px-4 py-3 text-[14px] font-medium text-[#4f67a2] shadow-[0_8px_20px_rgba(20,44,112,0.04)]">
          Showing deals for <span className="font-bold text-[#1a56db]">{searchTerm}</span>
        </div>
      ) : null}

      {paginatedDeals.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </section>
      ) : (
        <Card className="rounded-[20px] border-[#e3eaf9] px-6 py-10 text-center shadow-[0_12px_28px_rgba(22,48,112,0.05)]">
          <div className="text-[20px] font-bold text-[#17307a]">No deals match these filters</div>
          <p className="mt-2 text-[14px] text-[#6477a1]">
            Try another category, remove a filter, or reset the search.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={resetExtraFilters}>
              Reset filters
            </Button>
          </div>
        </Card>
      )}

      <section className="grid gap-4 rounded-[20px] border border-white/80 bg-white/75 px-4 py-4 shadow-[0_12px_32px_rgba(22,48,112,0.05)] lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="hidden lg:block" />
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#dbe6ff] bg-white text-[#3d5afe] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {visiblePages.map((page, index) => {
            const previous = visiblePages[index - 1];
            const showGap = previous && page - previous > 1;

            return (
              <div key={page} className="flex items-center gap-2">
                {showGap ? <span className="px-1 text-[13px] font-semibold text-[#7c8db2]">...</span> : null}
                <button
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-[10px] border text-[13px] font-semibold',
                    currentPage === page
                      ? 'border-[#3d5afe] bg-[#eef3ff] font-bold text-[#3156f5]'
                      : 'border-[#dbe6ff] bg-white text-[#4d6295]'
                  )}
                >
                  {page}
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#dbe6ff] bg-white text-[#3d5afe] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center text-[14px] font-medium text-[#6a7ca4] lg:text-right">
          Showing <span className="font-bold text-[#26408a]">{fromDeal} - {toDeal}</span> of{' '}
          <span className="font-bold text-[#26408a]">{filteredDeals.length} deals</span>
        </div>
      </section>
    </div>
  );
}

export function DealsPage() {
  return (
    <DashboardShell header={<TopNavbar />}>
      <DealsPageContent />
    </DashboardShell>
  );
}
