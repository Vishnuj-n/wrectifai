'use client';

import { FormEvent, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/common/input';
import { topNavIcons } from '@/components/home/data';
import { cn } from '@/utils/cn';

export function TopNavbar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <header className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-4">
      <div className="order-1 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#dbe6ff] bg-white text-[#1a56db] shadow-sm lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="order-1 flex h-10 shrink-0 items-center gap-4 rounded-lg border border-[#dbe6ff] bg-white px-3 text-[13px] font-semibold text-[#17307a] lg:w-[140px]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef4ff]">
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 text-[#1a56db]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 21s-6-4.35-6-11a6 6 0 1 1 12 0c0 6.65-6 11-6 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </div>
          <span>Hyderabad</span>
          <ChevronDown className="h-4 w-4 text-[#17307a]" />
        </div>
      </div>

      <div className="order-3 ml-auto flex items-center gap-1.5 sm:gap-2">
        {topNavIcons.map(({ icon: Icon, badge, label }) => (
          <div
            key={label}
            aria-label={label}
            className={cn(
              "relative h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#17307a] shadow-sm ring-1 ring-[#e5ecfb]",
              label !== 'Notifications' ? "hidden lg:flex" : "flex"
            )}
          >
            <Icon className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
            {badge ? (
              <span className="absolute right-0 top-0 lg:right-1 flex h-4 lg:h-5 min-w-4 lg:min-w-5 items-center justify-center rounded-full bg-[#ff2f44] px-1 text-[9px] lg:text-[9.5px] font-bold text-white">
                {badge}
              </span>
            ) : null}
          </div>
        ))}

        <div className="ml-1 flex h-9 lg:h-10 shrink-0 items-center gap-2 rounded-full border border-[#dbe6ff] bg-white p-0.5 lg:py-1 lg:pl-1.5 lg:pr-3">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Rahul" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full object-cover" />
          <span className="hidden text-[13px] font-semibold text-[#17307a] lg:block">Hi, Rahul</span>
          <ChevronDown className="hidden h-4 w-4 text-[#17307a] lg:block" />
        </div>
      </div>

      <form className="relative order-3 w-[360px] lg:order-2 lg:ml-9 lg:w-[420px]" onSubmit={handleSubmit}>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7aa5]" />
        <Input
          value={query}
          onChange={(event) => {
            const newQuery = event.target.value;
            setQuery(newQuery);
            window.dispatchEvent(
              new CustomEvent('dashboard-search', {
                detail: newQuery.trim(),
              })
            );
          }}
          className="h-10 rounded-lg pl-11 pr-4"
          placeholder="Search for services, parts, garages..."
          aria-label="Search for services, parts, garages"
        />
      </form>
    </header>
  );
}
