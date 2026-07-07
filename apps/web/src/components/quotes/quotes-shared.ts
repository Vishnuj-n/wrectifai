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
  details?: any;
};

const DOLLAR = '$';

export const quoteContextDefaultIssueIds = ['wheel-balance', 'wheel-alignment'];
export const aiEstimatedQuoteRange = `${DOLLAR}2,800 - ${DOLLAR}3,600`;

export const quotesList: QuoteItem[] = [];
