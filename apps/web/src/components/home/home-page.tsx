import { MainContent } from '@/components/home/main-content';
import { RightPanel } from '@/components/home/right-panel';
import { Sidebar } from '@/components/home/sidebar';
import { TopNavbar } from '@/components/home/top-navbar';

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f8fe]">
      <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-4 xl:h-screen xl:overflow-hidden xl:px-5 xl:py-4">
        <div className="grid gap-4 xl:h-full xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          <div className="xl:sticky xl:top-0 xl:h-screen">
            <Sidebar />
          </div>

          <div className="flex min-h-0 flex-col gap-4 xl:h-full xl:overflow-y-auto xl:pr-1">
            <TopNavbar />
            <MainContent />
          </div>

          <div className="xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:pl-1">
            <RightPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
