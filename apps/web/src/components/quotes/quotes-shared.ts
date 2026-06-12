export type QuoteStatus = 'new' | 'viewed' | 'expired' | 'open';

export type QuoteItem = {
  id: string;
  status: QuoteStatus;
  garage: string;
  image: string;
  rating: string;
  reviews: number;
  distance: string;
  meta: string;
  metaSecondary: string;
  price: string;
  savings: string;
  time: string;
  tag?: string;
};

const RUPEE = '\u20B9';

export const quotesList: QuoteItem[] = [
  {
    id: 'quickpit',
    status: 'new',
    garage: 'QuickPit Service Center',
    image: '/assets/garage_2_1778071173295.png',
    rating: '4.6',
    reviews: 128,
    distance: '3.1 km away',
    meta: 'Express service',
    metaSecondary: 'Certified technicians',
    price: `${RUPEE}3,050`,
    savings: `${RUPEE}450`,
    time: '10 mins ago',
    tag: 'Express service',
  },
  {
    id: 'autoworks',
    status: 'new',
    garage: 'AutoWorks Garage',
    image: '/assets/garage_3_1778071191282.png',
    rating: '4.4',
    reviews: 76,
    distance: '4.5 km away',
    meta: 'Specialized repair',
    metaSecondary: 'Genuine parts',
    price: `${RUPEE}3,450`,
    savings: `${RUPEE}250`,
    time: '25 mins ago',
    tag: 'Specialized repair',
  },
  {
    id: 'speedfix',
    status: 'new',
    garage: 'SpeedFix Auto Care',
    image: '/assets/garage_1_1778071156220.png',
    rating: '4.5',
    reviews: 96,
    distance: '3.3 km away',
    meta: 'Free pickup & drop',
    metaSecondary: '2 Year warranty',
    price: `${RUPEE}3,200`,
    savings: `${RUPEE}150`,
    time: '40 mins ago',
    tag: 'Free pickup & drop',
  },
  {
    id: 'fivestar',
    status: 'viewed',
    garage: 'Five Star Automotive',
    image: '/assets/garage_4_1778071611328.png',
    rating: '4.3',
    reviews: 65,
    distance: '5.2 km away',
    meta: '24/7 support',
    metaSecondary: 'Affordable pricing',
    price: `${RUPEE}3,600`,
    savings: `${RUPEE}0`,
    time: '1 hour ago',
  },
  {
    id: 'metro',
    status: 'viewed',
    garage: 'Metro Auto Bay',
    image: '/assets/garage_5_1778071628253.png',
    rating: '4.7',
    reviews: 142,
    distance: '2.8 km away',
    meta: 'Top rated service',
    metaSecondary: 'Verified garage',
    price: `${RUPEE}3,280`,
    savings: `${RUPEE}200`,
    time: '2 hours ago',
  },
  {
    id: 'prime',
    status: 'expired',
    garage: 'Prime Service Point',
    image: '/assets/garage_1_1778071156220.png',
    rating: '4.6',
    reviews: 119,
    distance: '4.4 km away',
    meta: 'Skilled technicians',
    metaSecondary: 'Fast turnaround',
    price: `${RUPEE}3,520`,
    savings: `${RUPEE}100`,
    time: '1 day ago',
  },
  {
    id: 'royal',
    status: 'open',
    garage: 'Royal Motor Service',
    image: '/assets/garage_2_1778071173295.png',
    rating: '4.2',
    reviews: 64,
    distance: '3.8 km away',
    meta: 'Budget friendly',
    metaSecondary: 'Pick-up available',
    price: `${RUPEE}3,250`,
    savings: `${RUPEE}120`,
    time: '3 hours ago',
  },
  {
    id: 'pitstop',
    status: 'open',
    garage: 'PitStop Car Care',
    image: '/assets/garage_3_1778071191282.png',
    rating: '4.1',
    reviews: 58,
    distance: '4.9 km away',
    meta: 'Local favorite',
    metaSecondary: 'Value pricing',
    price: `${RUPEE}3,180`,
    savings: `${RUPEE}80`,
    time: '5 hours ago',
  },
];
