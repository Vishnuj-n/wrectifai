'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, ChevronsRight, Gift } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { navItems } from '@/components/home/data';
import { cn } from '@/utils/cn';

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col rounded-[24px] border border-white/70 bg-white/92 p-3 shadow-[0_14px_42px_rgba(19,42,93,0.08)] backdrop-blur transition-[width,padding] duration-300 xl:min-h-screen xl:rounded-none xl:border-y-0 xl:border-l-0 xl:shadow-none',
        collapsed && 'xl:px-2.5'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-24 hidden h-8 w-8 items-center justify-center rounded-full border border-[#dbe6ff] bg-white text-[#1a56db] shadow-[0_10px_22px_rgba(19,42,93,0.14)] transition-colors hover:bg-[#f5f8ff] xl:flex"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </button>

      <Link
        href="/"
        className={cn(
          'mb-4 px-2 pt-2 transition-all',
          collapsed ? 'flex justify-center px-0' : 'px-2'
        )}
      >
        {collapsed ? (
          <Image
            src="/wrectifai-mark.png"
            alt="WrectifAI"
            width={1600}
            height={1600}
            priority
            className="h-auto w-[54px] object-contain"
          />
        ) : (
          <Image
            src="/fin_dashboard_logo.png"
            alt="WrectifAI"
            width={2048}
            height={811}
            priority
            className="h-auto w-[188px] object-contain xl:w-[198px]"
          />
        )}
      </Link>

      <nav className="-mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1 xl:mx-0 xl:mt-0 xl:flex-1 xl:flex-col xl:overflow-visible xl:px-0">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex h-10 min-w-fit items-center gap-3 rounded-[12px] px-3 text-left text-[15px] font-medium transition-colors xl:min-w-0',
                collapsed && 'xl:mx-auto xl:h-11 xl:w-11 xl:min-w-[44px] xl:justify-center xl:px-0',
                active
                  ? 'bg-[#1a56db] text-white shadow-[0_12px_24px_rgba(26,86,219,0.3)]'
                  : 'text-[#17307a] hover:bg-[#f5f8ff]'
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
              <span className={cn('whitespace-nowrap xl:flex-1', collapsed && 'xl:hidden')}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {collapsed ? (
        <Link
          href="/offers"
          className="mx-auto mt-5 flex h-[54px] w-[54px] items-center justify-center rounded-[16px] border border-[#edf2ff] bg-white shadow-[0_12px_24px_rgba(19,42,93,0.08)] transition-transform hover:-translate-y-0.5"
          title="Refer & Earn"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#fff1d8] to-[#ffb74d] text-[#d97706] shadow-[0_10px_20px_rgba(255,183,77,0.28)]">
            <Gift className="h-5 w-5" />
          </div>
        </Link>
      ) : (
        <Card className="mt-5 overflow-hidden bg-gradient-to-br from-[#f5f8ff] to-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h2 className="text-[22px] font-bold text-[#17307a]">Refer &amp; Earn</h2>
              <p className="max-w-[180px] text-[13px] leading-5 text-[#55658f]">
                Invite your friends and earn up to {'\u20B9500'}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#fff1d8] to-[#ffb74d] text-[#d97706] shadow-[0_10px_20px_rgba(255,183,77,0.35)]">
              <Gift className="h-8 w-8" />
            </div>
          </div>
          <Button asChild className="mt-4 w-full justify-center" size="sm">
            <Link href="/offers">Refer Now</Link>
          </Button>
        </Card>
      )}
    </aside>
  );
}
