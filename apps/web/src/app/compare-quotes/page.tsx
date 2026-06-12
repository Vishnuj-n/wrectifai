import { CompareQuotesPage } from '@/pages/compare-quotes/compare-quotes-page';

export default async function CompareQuotesRoute({
  searchParams,
}: {
  searchParams?: Promise<{ ids?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return <CompareQuotesPage ids={resolvedSearchParams?.ids} />;
}
