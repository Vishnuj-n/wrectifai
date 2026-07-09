import { apiClient } from './api-client';

export interface Garage {
  id: string;
  badge: string;
  badgeTone: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  distance?: string;
  price?: string;
  responseMins: number;
  chips: string[];
  facade?: string;
  tone?: string;
  artwork?: string;
  verified: boolean;
  image?: string;
}

export interface Promo {
  id: string;
  badge: string;
  badgeColor: string;
  icon: string;
  title: string;
  bullets: string[];
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
  bgColor: string;
  imageGlow: string;
  accent: string;
  categories: string[];
  isCombo: boolean;
  relevance: number;
}

export async function fetchGarages(): Promise<Garage[]> {
  return apiClient.get('/garages/search');
}

export async function fetchGarage(id: string): Promise<Garage> {
  return apiClient.get(`/garages/${id}`);
}

export async function fetchPromos(): Promise<Promo[]> {
  return apiClient.get('/promos');
}
