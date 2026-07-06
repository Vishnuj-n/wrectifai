import { apiClient } from './api-client';
import type { QuoteItem } from '@/components/quotes/quotes-shared';

export async function fetchQuotes(): Promise<QuoteItem[]> {
  return apiClient.get('/quotes');
}

export async function fetchQuote(id: string): Promise<QuoteItem> {
  return apiClient.get(`/quotes/${id}`);
}
