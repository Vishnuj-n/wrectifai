'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from '@/components/home/sidebar';
import { cn } from '@/utils/cn';

export function DashboardShell({
  header,
  children,
  aside,
}: {
  header?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed((current) => !current);
  };

  return (
    <main id="top" className="min-h-screen bg-[#f6f8fe]">
      <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-4 lg:px-5 xl:h-screen xl:overflow-hidden xl:py-4">
        <div
          className={cn(
            'grid gap-4 xl:h-full xl:gap-0 xl:[grid-template-columns:var(--sidebar-width)_minmax(0,1fr)]'
          )}
          style={
            {
              '--sidebar-width': collapsed ? '84px' : '248px',
            } as CSSProperties
          }
        >
          <div className="xl:sticky xl:top-0 xl:h-screen">
            <Sidebar collapsed={collapsed} onToggle={handleToggle} />
          </div>

          <div className="flex min-h-0 flex-col gap-4 xl:h-full xl:overflow-y-auto xl:px-4 xl:pr-1">
            {header ? <div>{header}</div> : null}
            <div
              className={cn(
                'grid gap-4 xl:items-start xl:gap-4',
                aside ? 'xl:grid-cols-[minmax(0,1fr)_300px]' : 'xl:grid-cols-1'
              )}
            >
              <div className="min-w-0">{children}</div>
              {aside ? <div className="min-w-0">{aside}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
