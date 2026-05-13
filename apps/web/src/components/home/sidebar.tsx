'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, ChevronsRight, Gift, X } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { navItems } from '@/components/home/data';
import { cn } from '@/utils/cn';

export function Sidebar({
  collapsed,
  onToggle,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-[#e4ecff] bg-white p-2 pb-3 transition-[width,padding] duration-300',
        collapsed ? 'px-2' : 'px-2.5'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-24 hidden h-8 w-8 items-center justify-center rounded-full border border-[#dbe6ff] bg-white text-[#1a56db] shadow-[0_10px_22px_rgba(19,42,93,0.14)] transition-colors hover:bg-[#f5f8ff] lg:flex"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </button>

      <div className={cn(
        "flex items-center justify-between pt-1",
        collapsed ? "mb-3.5" : "mb-1"
      )}>
        <Link
          href="/"
          className={cn(
            'px-2 transition-all',
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
              className="h-[28px] [@media(max-height:850px)]:h-[24px] w-[54px] object-cover object-top"
            />
          ) : (
            <Image
              src="/fin_dashboard_logo.png"
              alt="WrectifAI"
              width={2048}
              height={811}
              priority
              className="h-auto w-[148px] object-contain"
            />
          )}
        </Link>
        <button 
          className="lg:hidden p-2 text-[#17307a] hover:bg-[#f5f8ff] rounded-full" 
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-0.5 flex flex-col gap-[2px] overflow-x-hidden overflow-y-auto pr-0 pb-0.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex h-[30px] shrink-0 items-center gap-2 rounded-[8px] px-2.5 text-left text-[11px] font-medium transition-colors',
                collapsed && 'mx-auto h-[30px] w-[30px] min-w-[26px] justify-center px-0',
                active
                  ? 'bg-[#1a56db] text-white shadow-[0_6px_12px_rgba(26,86,219,0.2)]'
                  : 'text-[#17307a] hover:bg-[#f5f8ff]'
              )}
            >
              <Icon className="h-[16px] w-[16px] shrink-0" strokeWidth={active ? 2.2 : 1.7} />
              <span className={cn('whitespace-nowrap flex-1', collapsed && 'hidden')}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 shrink-0">
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
          <div className="relative mt-0.5 overflow-hidden rounded-[14px] border border-[#edf2fd] bg-white p-2.5 shadow-[0_4px_12px_rgba(20,44,112,0.02)]">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0">
                <h2 className="text-[12px] font-bold text-[#0a2357]">Refer &amp; Earn</h2>
                <p className="max-w-[115px] text-[10px] font-medium leading-tight text-[#55658f]">
                  Invite friends and earn up to {'\u20B9500'}
                </p>
              </div>
              <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-[#ffedd5] to-[#fed7aa] text-[#ea580c] shadow-[0_2px_6px_rgba(234,88,12,0.08)]">
                <Gift className="h-4 w-4" strokeWidth={1.8} />
              </div>
            </div>
            <Button asChild className="mt-2 h-[30px] w-full rounded-[9px] bg-[#1a56db] font-semibold hover:bg-[#1a56db]/90 text-[11px] shadow-none" size="sm">
              <Link href="/offers">Refer Now</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
