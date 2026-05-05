import type { LucideIcon } from 'lucide-react';
import {
  BatteryCharging,
  Bell,
  CalendarDays,
  CarFront,
  ChevronRight,
  CircleHelp,
  Disc3,
  FileText,
  Fuel,
  Gift,
  Heart,
  Lightbulb,
  MapPin,
  MessageSquare,
  Package,
  Shield,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
  UserRound,
  Wallet,
  Wrench,
  WrenchIcon,
  Settings,
  Siren,
  Phone,
} from 'lucide-react';

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  chevron?: boolean;
};

export const navItems: NavItem[] = [
  { label: 'Home', icon: Store, active: true },
  { label: 'AI Diagnose', icon: Sparkles },
  { label: 'Services', icon: Wrench, chevron: true },
  { label: 'Shop', icon: ShoppingBag },
  { label: 'Garages', icon: CalendarDays },
  { label: 'Bookings', icon: CalendarDays },
  { label: 'Quotes', icon: FileText },
  { label: 'Vehicles', icon: CarFront },
  { label: 'Offers', icon: Tag },
  { label: 'Car Tips', icon: Lightbulb },
  { label: 'Wallet & Payments', icon: Wallet },
  { label: 'Profile', icon: UserRound },
  { label: 'Settings', icon: Settings },
  { label: 'Help & Support', icon: CircleHelp },
];

export const categoryItems = [
  { label: 'Repair Services', icon: WrenchIcon },
  { label: 'Maintenance', icon: Fuel },
  { label: 'Parts & Components', icon: Settings },
  { label: 'Tyres & Wheels', icon: Disc3 },
  { label: 'Car Care & Detailing', icon: Sparkles },
  { label: 'Insurance', icon: Shield },
  { label: 'Accessories & Upgrades', icon: Tag },
];

export const maintenanceItems = [
  { label: 'Engine Oil Change', due: 'Due in 1,500 KM', icon: Fuel },
  { label: 'AC Checkup', due: 'Due in 20 Days', icon: Snowflake },
  { label: 'Brake Inspection', due: 'Due in 15 Days', icon: Disc3 },
  { label: 'Tyre Rotation', due: 'Due in 3,000 KM', icon: Truck },
  { label: 'Battery Check', due: 'Due in 30 Days', icon: BatteryCharging },
];

export const garages = [
  {
    badge: 'Top Rated',
    tone: 'green' as const,
    name: 'SpeedFix Auto Care',
    rating: '4.6',
    reviews: 128,
    location: 'Kondapur, Hyderabad',
    distance: '2.2 km',
    price: 'Starting ₹499',
    artwork:
      'from-[#0b121d] via-[#2a241f] to-[#5b3823]',
  },
  {
    badge: 'Most Trusted',
    tone: 'orange' as const,
    name: 'QuickPit Service Center',
    rating: '4.5',
    reviews: 96,
    location: 'Madhapur, Hyderabad',
    distance: '3.1 km',
    price: 'Starting ₹599',
    artwork:
      'from-[#16181f] via-[#362219] to-[#5d2b20]',
  },
  {
    badge: 'Best Value',
    tone: 'blue' as const,
    name: 'AutoWorks Garage',
    rating: '4.4',
    reviews: 110,
    location: 'Gachibowli, Hyderabad',
    distance: '4.5 km',
    price: 'Starting ₹449',
    artwork:
      'from-[#2f2419] via-[#3c3127] to-[#1a1d25]',
  },
  {
    badge: '',
    tone: 'blue' as const,
    name: 'Five Star Automotive',
    rating: '4.3',
    reviews: 78,
    location: 'Banjara Hills, Hyderabad',
    distance: '5.2 km',
    price: 'Starting ₹699',
    artwork:
      'from-[#151515] via-[#343434] to-[#6f4a3e]',
  },
];

export const seasonalDeals = [
  {
    title: 'Summer Care Combo',
    subtitle: 'Coolant + AC + Engine Oil Combo',
    price: '₹2,999',
    strikePrice: '₹4,500',
    discount: '33% OFF',
    tone: 'red',
    imageTone: 'from-[#120606] via-[#733014] to-[#f0b760]',
  },
  {
    title: 'Monsoon Care Combo',
    subtitle: 'Wiper Blades + Tyres + Checkup Combo',
    price: '₹1,999',
    strikePrice: '₹3,000',
    discount: '33% OFF',
    tone: 'green',
    imageTone: 'from-[#0c2434] via-[#7ea7c7] to-[#e4f4ff]',
  },
  {
    title: 'Winter Care Combo',
    subtitle: 'Battery + Engine Oil + Coolant Combo',
    price: '₹2,499',
    strikePrice: '₹3,800',
    discount: '34% OFF',
    tone: 'blue',
    imageTone: 'from-[#162033] via-[#4f5d74] to-[#d2d7e2]',
  },
];

export const careTips = [
  {
    title: 'Check tyre pressure regularly for better mileage and safety.',
    icon: Disc3,
  },
  {
    title: 'Change engine oil every 5,000-7,000 km for optimal performance.',
    icon: Fuel,
  },
  {
    title: 'Use quality coolant to keep your engine from overheating.',
    icon: BatteryCharging,
  },
  {
    title: 'Replace wiper blades every 6-12 months for clear visibility.',
    icon: Sparkles,
  },
  {
    title: 'Check battery health regularly, especially before long drives.',
    icon: BatteryCharging,
  },
];

export const overviewItems = [
  {
    title: 'Upcoming Bookings',
    value: '2',
    description: 'Next: 25 Apr, 10:00 AM',
    cta: 'View All',
    icon: CalendarDays,
    colors: 'from-[#7c3aed] to-[#9f67ff]',
  },
  {
    title: 'Part Orders',
    value: '3',
    description: '1 Order In Transit',
    cta: 'View All',
    icon: Package,
    colors: 'from-[#f97316] to-[#f59e0b]',
  },
  {
    title: 'Pending Quotes',
    value: '2',
    description: 'Action Required',
    cta: 'View All',
    icon: FileText,
    colors: 'from-[#3b82f6] to-[#2563eb]',
  },
  {
    title: 'Vehicles',
    value: '2',
    description: 'Manage Vehicles',
    cta: 'Manage',
    icon: CarFront,
    colors: 'from-[#10b981] to-[#14b8a6]',
  },
];

export const emergencyItems = [
  { title: 'Roadside Assistance', icon: Siren },
  { title: 'Tow Truck', icon: Truck },
  { title: 'Battery Jump Start', icon: BatteryCharging },
  { title: 'Call Support', icon: Phone },
];

export const promoItems = [
  {
    eyebrow: 'MEGA CAR WASH OFFER',
    title: 'Premium Wash + Interior Cleaning',
    price: '₹499',
    strikePrice: '₹699',
    discount: '29% OFF',
    accent: 'text-[#238453]',
    fill: 'from-[#edf9ef] to-[#f8fbff]',
    icon: CarFront,
  },
  {
    eyebrow: 'BRAKE CARE SPECIAL',
    title: 'Brake Pads + Disc Inspection',
    price: '₹1,299',
    strikePrice: '₹1,799',
    discount: '28% OFF',
    accent: 'text-[#ff3b30]',
    fill: 'from-[#fff2f2] to-[#fff8f8]',
    icon: Disc3,
  },
  {
    eyebrow: 'AC SERVICE OFFER',
    title: 'AC Checkup + Gas Top-up',
    price: '₹1,199',
    strikePrice: '₹1,599',
    discount: '26% OFF',
    accent: 'text-[#1a56db]',
    fill: 'from-[#eff5ff] to-[#fafcff]',
    icon: Snowflake,
  },
];

export const topNavIcons = [
  { icon: Bell, badge: '3' },
  { icon: MessageSquare },
  { icon: Heart },
];

export const miscIcons = {
  gift: Gift,
  mapPin: MapPin,
  chevronRight: ChevronRight,
  star: Star,
  sparkles: Sparkles,
};
