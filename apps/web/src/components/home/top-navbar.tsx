'use client';

import { FormEvent, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/common/input';
import { topNavIcons } from '@/components/home/data';

export function TopNavbar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent('dashboard-search', {
        detail: query.trim(),
      })
    );
  };

  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
          className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#dbe6ff] bg-white text-[#1a56db] shadow-sm lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="flex h-10 w-fit items-center gap-3 rounded-[14px] border border-[#dbe6ff] bg-white px-4 text-[15px] font-semibold text-[#17307a] shadow-sm">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef4ff]">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-[#1a56db]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 21s-6-4.35-6-11a6 6 0 1 1 12 0c0 6.65-6 11-6 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </div>
        Hyderabad
        <ChevronDown className="h-4 w-4 text-[#17307a]" />
      </div>
      </div>

      <form className="relative flex-1" onSubmit={handleSubmit}>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7aa5]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-10 rounded-[14px] pl-11 pr-4"
          placeholder="Search for services, parts, garages..."
          aria-label="Search for services, parts, garages"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2 lg:self-auto">
        {topNavIcons.map(({ icon: Icon, badge, label }) => (
          <div
            key={label}
            aria-label={label}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#17307a] shadow-sm ring-1 ring-[#e5ecfb]"
          >
            <Icon className="h-[18px] w-[18px]" />
            {badge ? (
              <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff2f44] px-1 text-[10px] font-bold text-white">
                {badge}
              </span>
            ) : null}
          </div>
        ))}

        <div className="ml-0 flex items-center gap-2 rounded-full border border-[#dbe6ff] bg-white py-1 pl-1.5 pr-3 lg:ml-1">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Rahul" className="flex h-8 w-8 items-center justify-center rounded-full object-cover" />
          <span className="text-[15px] font-semibold text-[#17307a]">Hi, Rahul</span>
          <ChevronDown className="h-4 w-4 text-[#17307a]" />
        </div>
      </div>
    </header>
  );
}
