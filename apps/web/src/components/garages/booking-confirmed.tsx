'use client';

import { useState } from 'react';
import {
  Calendar,
  MapPin,
  Wrench,
  Clock,
  CarFront,
  ShieldCheck,
  MessageSquare,
  Phone,
  Check,
  Copy,
  ThumbsUp,
  UserCheck,
  Store,
  Home,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { cn } from '@/utils/cn';
import type { Garage } from '@/pages/garages/garages-page';

interface BookingConfirmedProps {
  garage: Garage;
  selectedDate: string;
  selectedSlot: string;
  onViewBookings: () => void;
}

export function BookingConfirmed({
  garage,
  selectedDate,
  selectedSlot,
  onViewBookings,
}: BookingConfirmedProps) {
  const [copied, setCopied] = useState(false);
  const bookingId = `WRCT-2505${selectedDate}-0420`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: 'Booking Confirmed',
      desc: 'You will receive a confirmation shortly',
      active: true,
      icon: Store,
    },
    {
      title: 'Garage Assigned',
      desc: 'We will assign the best mechanic for you',
      active: false,
      icon: UserCheck,
    },
    {
      title: 'Service in Progress',
      desc: 'We will notify you when our team starts',
      active: false,
      icon: CarFront,
    },
    {
      title: 'Service Completed',
      desc: 'Pay after service & share your feedback',
      active: false,
      icon: ShieldCheck,
    },
  ];

  const bulletPoints = [
    'Complete vehicle inspection',
    'Engine oil change',
    'Filter replacement',
    'Performance check',
    'Basic adjustments',
  ];

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6b7da5] pt-1">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1a56db] transition-colors">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#a4b3d1]" />
        <button onClick={onViewBookings} className="hover:text-[#1a56db] transition-colors">
          Garages
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-[#a4b3d1]" />
        <span className="text-[#17307a] font-bold">Booking Confirmed</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
        {/* Left Column */}
        <div className="space-y-6">
        {/* Confirmed Banner Card */}
        <div className="relative overflow-hidden rounded-[20px] border border-[#d5eedb] bg-[#f4fcf7] p-6 shadow-[0_10px_28px_rgba(15,164,87,0.03)]">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
            
            {/* Elegant Check Indicator with Circular Confetti Particles matching reference */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#0fa457] text-white shadow-[0_6px_16px_rgba(15,164,87,0.25)]">
                <Check className="h-6 w-6 stroke-[3.5]" />
              </div>
              
              {/* Reference-matching confetti dots strategically positioned */}
              <div className="absolute -top-1 -left-1 w-[4.5px] h-[4.5px] rounded-full bg-[#c084fc] opacity-75" />
              <div className="absolute top-2 -right-2.5 w-[5px] h-[5px] rounded-full bg-[#fb923c] opacity-80" />
              <div className="absolute -bottom-1.5 right-2 w-[4px] h-[4px] rounded-full bg-[#34d399] opacity-75" />
              <div className="absolute bottom-2.5 -left-2.5 w-[5px] h-[5px] rounded-full bg-[#60a5fa] opacity-75" />
              <div className="absolute -top-2.5 right-1.5 w-[3.5px] h-[3.5px] rounded-full bg-[#f43f5e] opacity-70" />
              <div className="absolute bottom-6 -right-1 w-[3px] h-[3px] rounded-full bg-[#facc15] opacity-80" />
              <div className="absolute -bottom-2 -left-0.5 w-[4px] h-[4px] rounded-full bg-[#a78bfa] opacity-70" />
            </div>

            {/* Banner details */}
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-[20px] font-extrabold tracking-tight text-[#0fa457] sm:text-[21px]">
                Booking Confirmed!
              </h1>
              <p className="text-[13px] font-semibold text-[#1e293b]">
                Your appointment has been successfully booked.
              </p>
              
              <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-[12px] font-bold text-[#475569]">
                  Booking ID: <span className="text-[#0f172a] font-extrabold font-mono tracking-tight">{bookingId}</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white border border-[#e2eefc] text-[#1a56db] hover:bg-[#f0f4ff] active:scale-95 transition-all shadow-sm"
                  title="Copy Booking ID"
                >
                  {copied ? <Check className="h-3 w-3 text-[#0fa457]" strokeWidth={3} /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              
              <p className="text-[11px] font-semibold text-[#64748b] pt-0.5">
                We&apos;ve sent the booking details to your email and SMS.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details Grid Box */}
        <Card className="rounded-[22px] border-[#e7eefc] p-6 shadow-[0_12px_32px_rgba(21,48,122,0.05)] bg-white space-y-5">
          <h2 className="text-[14px] font-extrabold tracking-tight text-[#17307a]">
            Booking Details
          </h2>
          
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {/* Date & Time */}
            <div className="flex gap-3.5 items-start py-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2eefd] text-[#1a56db]">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11.5px] font-semibold text-[#64748b]">Date &amp; Time</div>
                <div className="text-[13px] font-extrabold text-[#0f172a]">
                  Fri, {selectedDate} May 2025 • {selectedSlot}
                </div>
              </div>
            </div>

            {/* Garage Info */}
            <div className="flex gap-3.5 items-start py-1 border-t border-[#f1f5f9] pt-4 sm:border-t-0 sm:pt-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2eefd] text-[#1a56db]">
                <Store className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11.5px] font-semibold text-[#64748b]">Garage</div>
                <div className="text-[13px] font-extrabold text-[#0f172a]">
                  {garage.name}
                </div>
                <div className="text-[11px] font-semibold text-[#64748b]">{garage.location}</div>
              </div>
            </div>

            {/* Service details */}
            <div className="flex gap-3.5 items-start py-1 border-t border-[#f1f5f9] pt-4 sm:pt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2eefd] text-[#1a56db]">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11.5px] font-semibold text-[#64748b]">Service</div>
                <div className="text-[13px] font-extrabold text-[#0f172a]">
                  General Service (Standard Service)
                </div>
                <div className="pt-0.5">
                  <span className="inline-block rounded-[6px] bg-[#eefbf3] px-2 py-0.5 text-[10px] font-bold text-[#228453]">
                    60-90 mins
                  </span>
                </div>
              </div>
            </div>

            {/* Response Time details */}
            <div className="flex gap-3.5 items-start py-1 border-t border-[#f1f5f9] pt-4 sm:pt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2eefd] text-[#1a56db]">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11.5px] font-semibold text-[#64748b]">Response Time</div>
                <div className="text-[13px] font-extrabold text-[#0f172a]">
                  {garage.responseMins} mins
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="flex gap-3.5 items-start py-1 border-t border-[#f1f5f9] pt-4 sm:pt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2eefd] text-[#1a56db]">
                <CarFront className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11.5px] font-semibold text-[#64748b]">Vehicle</div>
                <div className="text-[13px] font-extrabold text-[#0f172a]">Honda City</div>
                <div className="text-[11px] font-semibold text-[#64748b]">TS07 AB 1234 • Petrol • 2018</div>
              </div>
            </div>

            {/* Payment Mode details */}
            <div className="flex gap-3.5 items-start py-1 border-t border-[#f1f5f9] pt-4 sm:pt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2eefd] text-[#1a56db]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11.5px] font-semibold text-[#64748b]">Payment Mode</div>
                <div className="text-[13px] font-extrabold text-[#0f172a]">Pay after service</div>
                <div className="pt-0.5">
                  <span className="inline-block rounded-[6px] bg-[#eefbf3] px-2 py-0.5 text-[10px] font-bold text-[#228453]">
                    No upfront payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Process Steps Timeline ("What's Next") */}
        <Card className="rounded-[22px] border-[#e7eefc] p-6 shadow-[0_12px_32px_rgba(21,48,122,0.05)] bg-white space-y-6">
          <h2 className="text-[14.5px] font-extrabold tracking-tight text-[#17307a]">
            What&apos;s Next?
          </h2>

          <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-4 md:items-start">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isFirstStep = idx === 0;
              return (
                <div key={idx} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center flex-1 min-w-0 gap-4 md:gap-3 relative">
                  {/* Decorative horizontal dashed link lines between steps */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute left-[calc(50%+24px)] top-[20px] right-[calc(-50%+24px)] h-0.5 border-t border-dashed border-[#e2eefc]" />
                  )}
                  
                  {/* Icon Indicator bubble */}
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                      isFirstStep
                        ? 'border-[#d3eedc] bg-[#eefbf3] text-[#228453] shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                        : 'border-[#dbe6ff] bg-[#f0f4ff] text-[#1a56db]'
                    )}
                  >
                    <StepIcon className="h-4.5 w-4.5" />
                  </div>
                  
                  <div className="space-y-0.5 max-w-[140px] md:mx-auto">
                    <h4 className={cn('text-[12px] font-bold', isFirstStep ? 'text-[#228453]' : 'text-[#17307a]')}>
                      {step.title}
                    </h4>
                    <p className="text-[10px] font-semibold leading-normal text-[#6b7da5]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Support & illustrations row ("Need Help?") */}
        <Card className="relative overflow-hidden rounded-[22px] border-[#e7eefc] bg-white p-6 shadow-[0_12px_32px_rgba(21,48,122,0.05)]">
          <div className="relative z-10 flex flex-col justify-between sm:flex-row sm:items-center gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-[14.5px] font-extrabold tracking-tight text-[#17307a]">Need Help?</h3>
                <p className="text-[12px] font-semibold text-[#6b7da5] mt-0.5">Our support team is here to help you</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Button
                  variant="outline"
                  className="h-10 rounded-[12px] px-4 text-[11.5px] font-bold border-[#cbd4e6] text-[#17307a] hover:bg-[#f7f9fc] flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4 text-[#1a56db]" />
                  Chat with Us
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-[12px] px-4 text-[11.5px] font-bold border-[#cbd4e6] text-[#17307a] hover:bg-[#f7f9fc] flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-[#1a56db]" />
                  Call Garage
                </Button>
              </div>
            </div>

            {/* Gorgeous SVG illustration of car and shield */}
            <div className="relative w-[180px] h-[90px] shrink-0 self-center sm:self-auto overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Soft blue accent backdrop glowing spots */}
                <circle cx="120" cy="50" r="36" fill="#eff5ff" />
                <circle cx="70" cy="65" r="22" fill="#f0fdf4" />
                
                {/* SVG Car Graphic representation */}
                <g transform="translate(10, 15)">
                  {/* Car Shadow */}
                  <ellipse cx="78" cy="62" rx="66" ry="7" fill="#1e3a8a" fillOpacity="0.08" />
                  
                  {/* Car Body Base */}
                  <path d="M12 48C12 48 18 42 26 38C34 34 68 34 78 34C88 34 116 36 126 44C136 52 138 58 138 58H10C10 58 10 52 12 48Z" fill="#2563eb" />
                  <path d="M26 38L38 22H94L110 38H26Z" fill="#1d4ed8" />
                  
                  {/* Windows */}
                  <path d="M42 24H64V36H32L42 24Z" fill="#eff6ff" />
                  <path d="M68 24H88L98 36H68V24Z" fill="#eff6ff" />
                  
                  {/* Wheel arches & Wheels */}
                  <circle cx="34" cy="56" r="13" fill="#1e293b" />
                  <circle cx="34" cy="56" r="6" fill="#94a3b8" />
                  <circle cx="106" cy="56" r="13" fill="#1e293b" />
                  <circle cx="106" cy="56" r="6" fill="#94a3b8" />
                  
                  {/* Headlights & Tail lights */}
                  <polygon points="138,50 134,46 132,54" fill="#fbbf24" />
                  <rect x="10" y="44" width="4" height="6" rx="2" fill="#ef4444" />
                </g>
                
                {/* Floating Shield Check graphic for protection */}
                <g transform="translate(132, 28)">
                  <circle cx="20" cy="20" r="18" fill="white" filter="drop-shadow(0px 4px 10px rgba(30,58,138,0.12))" />
                  <path d="M20 9C20 9 27 12 27 16C27 23 20 28 20 28C20 28 13 23 13 16C13 12 20 9 20 9Z" fill="#10b981" />
                  <path d="M17 18.5L19 20.5L23 15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>
          </div>
        </Card>

        {/* View My Bookings trigger */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={onViewBookings}
            className="h-11 rounded-[12px] px-8 text-[12.5px] font-bold bg-[#1a56db] text-white hover:bg-[#0b43c4] shadow-md transition-all hover:scale-[1.01]"
          >
            View My Bookings
          </Button>
        </div>
      </div>

      {/* Right Column: Summaries & widgets */}
      <div className="space-y-6">
        {/* Booking Summary sidebar widget */}
        <Card className="rounded-[24px] border-[#e7eefc] bg-white p-5 shadow-[0_16px_40px_rgba(21,48,122,0.06)] space-y-4">
          <h3 className="text-[14px] font-extrabold tracking-tight text-[#17307a]">
            Booking Summary
          </h3>

          {/* Mini Garage detail widget */}
          <div className="flex gap-3 items-center">
            {garage.image && (
              <img
                src={garage.image}
                alt={garage.name}
                className="w-20 h-14 rounded-[10px] object-cover shrink-0 border border-[#e2eefc]"
              />
            )}
            <div className="min-w-0">
              <h4 className="text-[12.5px] font-bold text-[#17307a] truncate">{garage.name}</h4>
              <p className="text-[10.5px] font-semibold text-[#8a99ad] truncate mt-0.5">{garage.location}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[#f28c28]">
                <span className="flex items-center gap-0.5 text-[#ff9f1a]">★ {garage.rating.toFixed(1)}</span>
                <span className="text-[#8a99ad] font-semibold">({garage.reviews} Reviews)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#eef3ff] pt-3.5 space-y-3">
            {[
              { label: 'Service', val: 'General Service' },
              { label: 'Service Type', val: 'Standard Service' },
              { label: 'Date & Time', val: `Fri, ${selectedDate} May 2025 at ${selectedSlot}` },
              { label: 'Estimated Duration', val: '60-90 mins' },
              { label: 'Response Time', val: `${garage.responseMins} mins` },
            ].map((row, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a99ad] block">
                  {row.label}
                </span>
                <span className="text-[12px] font-extrabold text-[#17307a] block leading-tight">
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#eef3ff] pt-3.5 space-y-2">
            <span className="text-[10.5px] font-bold tracking-tight text-[#17307a] block">
              What&apos;s Included
            </span>
            <ul className="space-y-1.5">
              {bulletPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-[11px] font-semibold text-[#536891]">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#228453]" strokeWidth={3} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-[#f0f4ff] p-3 text-center border border-[#dbe6ff]">
            <span className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#1a56db]">
              <ShieldCheck className="h-4 w-4 text-[#1a56db]" strokeWidth={2.5} />
              No upfront payment • Pay after service
            </span>
          </div>
        </Card>

        {/* Change / cancellation widget */}
        <Card className="rounded-[24px] border-[#e7eefc] bg-white p-5 shadow-[0_16px_40px_rgba(21,48,122,0.06)] space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-[12.5px] font-bold tracking-tight text-[#17307a]">Need to make changes?</h3>
            <p className="text-[11px] font-semibold text-[#8a99ad] leading-normal">
              You can reschedule or cancel your booking before {selectedDate} May 2025, 02:00 PM.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-10 rounded-[12px] text-[11px] font-bold border-[#cbd4e6] text-[#17307a] hover:bg-[#f7f9fc]"
            >
              Reschedule
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-10 rounded-[12px] text-[11px] font-bold border-[#ffd2d2] text-[#d14343] hover:bg-[#fff9f9]"
            >
              Cancel Booking
            </Button>
          </div>
        </Card>

        {/* Hassle free service banner */}
        <Card className="rounded-[24px] border-[#d3eedc] bg-[#eefbf3] p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-[12px] font-bold text-[#228453]">Enjoy hassle-free service!</h4>
            <p className="text-[10px] font-semibold text-[#3a684f] leading-snug">
              Our team will take great care of your vehicle.
            </p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#228453]">
            <ThumbsUp className="h-4.5 w-4.5" />
          </div>
        </Card>
      </div>
    </div>
  </div>
  );
}

export default BookingConfirmed;
