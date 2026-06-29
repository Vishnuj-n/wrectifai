import { RequestAentPage } from '@/pages/request-aent/request-aent-page';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ issues?: string }>;
}) {
  const params = await searchParams;
  return <RequestAentPage issues={params.issues} />;
}
