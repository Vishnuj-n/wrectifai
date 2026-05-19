'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, ChevronsRight, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/common/button';

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
        'relative flex h-full flex-col border-r border-[#e4ecff] bg-white p-2 pb-1.5 transition-[width,padding] duration-300',
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
        'flex items-center justify-between',
        collapsed ? 'mb-3.5 pt-1' : 'mb-1.5'
      )}>
        <Link
          href="/"
          className={cn(
            'transition-all',
            collapsed ? 'flex justify-center px-0' : 'flex flex-1 items-center px-0'
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
            <div className="relative h-[48px] w-[248px] overflow-hidden -ml-2">
              <Image
                src="/Dashboard_car.png"
                alt="WrectifAI"
                width={1536}
                height={1024}
                priority
                className="absolute top-[-34px] left-[2px] h-[138px] w-auto max-w-none object-contain"
              />
            </div>
          )}
        </Link>
        <button 
          className="lg:hidden p-2 text-[#17307a] hover:bg-[#f5f8ff] rounded-full" 
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-0.5 flex flex-col gap-[3px] overflow-x-hidden overflow-y-auto pr-0.5 pb-0.5 [scrollbar-width:thin] [scrollbar-color:#e4ecff_transparent] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e4ecff] hover:[&::-webkit-scrollbar-thumb]:bg-[#cbd5e1] [&::-webkit-scrollbar-track]:bg-transparent">
        {navItems.map(({ label, icon: Icon, href, chevron }) => {
          const active = pathname
            ? (href === '/' ? (pathname === '/' || pathname.startsWith('/deals')) : pathname.startsWith(href))
            : false;

          return (
            <Link
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex h-[32px] shrink-0 items-center gap-2 rounded-[8px] px-2 text-left text-[12px] font-semibold transition-colors',
                collapsed && 'mx-auto h-[32px] w-[32px] min-w-[28px] justify-center px-0',
                active
                  ? 'bg-[#1a56db] text-white shadow-[0_6px_12px_rgba(26,86,219,0.2)]'
                  : 'text-[#17307a] hover:bg-[#f5f8ff]'
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.2 : 1.7} />
              <span className={cn('whitespace-nowrap flex-1', collapsed && 'hidden')}>
                {label}
              </span>
              {chevron && !collapsed ? (
                <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-1 shrink-0">
        {collapsed ? (
          <Link
            href="/offers"
            className="mx-auto mt-2 flex h-[48px] w-[48px] items-center justify-center rounded-[12px] bg-[#f3f7ff] shadow-none hover:bg-[#ebf2fd] transition-colors"
            title="Refer & Earn"
          >
            <Image
              src="/assets/gift icon.png"
              alt="Refer & Earn Gift"
              width={32}
              height={32}
              priority
              style={{ height: 'auto' }}
              className="w-[32px] h-auto object-contain"
            />
          </Link>
        ) : (
          <div className="relative mt-0.5 overflow-hidden rounded-[14px] bg-[#f3f7ff] p-3 shadow-none">
            <div className="flex items-center justify-between gap-1">
              <div className="flex-1 flex flex-col">
                <h2 className="text-[12.5px] font-bold text-[#17307a] tracking-tight mb-0.5">Refer &amp; Earn</h2>
                <p className="max-w-[130px] text-[10.5px] font-normal leading-snug text-[#17307a] mb-2.5">
                  Invite your friends and earn up to {'\u20B9500'}
                </p>
                <Button asChild className="h-[25px] w-fit rounded-[6px] bg-[#1a56db] font-semibold hover:bg-[#1a56db]/90 text-[10.5px] px-3.5 shadow-none" size="sm">
                  <Link href="/offers">Refer Now</Link>
                </Button>
              </div>
              <div className="shrink-0 flex items-center justify-center pl-1">
                <Image
                  src="/assets/gift icon.png"
                  alt="Refer & Earn Gift"
                  width={56}
                  height={56}
                  priority
                  style={{ height: 'auto' }}
                  className="w-[56px] h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
