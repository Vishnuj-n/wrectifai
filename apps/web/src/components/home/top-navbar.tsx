import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/common/input';
import { topNavIcons } from '@/components/home/data';

export function TopNavbar() {
  return (
    <header className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <button className="flex h-10 items-center gap-3 rounded-[14px] border border-[#dbe6ff] bg-white px-4 text-[15px] font-semibold text-[#17307a] shadow-sm">
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
      </button>

      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7aa5]" />
        <Input
          className="h-10 rounded-[14px] pl-11 pr-4"
          placeholder="Search for services, parts, garages..."
        />
      </div>

      <div className="flex items-center gap-2 self-end xl:self-auto">
        {topNavIcons.map(({ icon: Icon, badge }, index) => (
          <button
            key={index}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#17307a] shadow-sm ring-1 ring-[#e5ecfb]"
          >
            <Icon className="h-[18px] w-[18px]" />
            {badge ? (
              <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff2f44] px-1 text-[10px] font-bold text-white">
                {badge}
              </span>
            ) : null}
          </button>
        ))}

        <button className="ml-1 flex h-10 items-center gap-3 rounded-full bg-white py-1 pl-1.5 pr-3 shadow-sm ring-1 ring-[#e5ecfb]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd68a] to-[#ff9f43] text-[16px]">
            <span>🧔</span>
          </div>
          <span className="text-[15px] font-semibold text-[#17307a]">Hi, Rahul</span>
          <ChevronDown className="h-4 w-4 text-[#17307a]" />
        </button>
      </div>
    </header>
  );
}
