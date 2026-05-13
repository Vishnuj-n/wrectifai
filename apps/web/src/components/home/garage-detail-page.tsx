'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Shield,
  Wrench,
  Gauge,
  Tag,
  CheckCircle2,
  Snowflake,
  Battery,
  ClipboardList,
  SlidersHorizontal,
  Phone,
  MessageSquare,
  Map,
  Heart,
  Check,
  Eye,
  Award,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { cn } from '@/utils/cn';
import type { Garage } from './garages-page';

interface GarageDetailPageProps {
  garage: Garage;
  onBack: () => void;
}

const appointmentDates = [
  { day: 'Fri', date: '23', month: 'May' },
  { day: 'Sat', date: '24', month: 'May' },
  { day: 'Sun', date: '25', month: 'May' },
  { day: 'Mon', date: '26', month: 'May' },
  { day: 'Tue', date: '27', month: 'May' },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM',
  '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM',
];

const servicesOffered = [
  { name: 'General Service', icon: Wrench },
  { name: 'Engine Repair', icon: Sparkles },
  { name: 'AC Service', icon: Snowflake },
  { name: 'Brakes & Suspension', icon: Gauge },
  { name: 'Battery Service', icon: Battery },
  { name: 'Tyres & Wheel Care', icon: Award },
  { name: 'Diagnostics', icon: ClipboardList },
  { name: 'More Services', icon: SlidersHorizontal },
];

export function GarageDetailPage({ garage, onBack }: GarageDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('23');
  const [selectedSlot, setSelectedSlot] = useState('04:00 PM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);

  const reviews = [
    {
      avatar: 'AR',
      name: 'Arjun R.',
      status: 'Verified Customer',
      date: '5 days ago',
      rating: 5,
      text: 'Excellent service and professional staff. They explained everything clearly and fixed my car on time.',
    },
    {
      avatar: 'SM',
      name: 'Suresh M.',
      status: 'Verified Customer',
      date: '1 week ago',
      rating: 4.8,
      text: 'Very helpful team, free pickup and drop was extremely convenient. Highly recommend their service!',
    },
    {
      avatar: 'KP',
      name: 'Kiran P.',
      status: 'Verified Customer',
      date: '2 weeks ago',
      rating: 5,
      text: 'Best AC service I have had. Honest pricing and transparent updates throughout the day.',
    },
    {
      avatar: 'RN',
      name: 'Rahul N.',
      status: 'Verified Customer',
      date: '3 weeks ago',
      rating: 4.5,
      text: 'Very neat work. The technicians are highly skilled and explain the root cause of the issue before starting repair.',
    },
  ];

  const handleBookAppointment = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-[#1a56db] transition-colors hover:text-[#0b43c4]"
      >
        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        Back to Garages
      </button>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Banner Container */}
          <div className="relative h-[240px] w-full overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-r from-slate-900 to-slate-800 shadow-[0_16px_40px_rgba(22,48,112,0.08)] sm:h-[300px]">
            {garage.image && (
              <img
                src={garage.image}
                alt={garage.name}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            
            {/* Banner Overlay Info */}
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
              <span className="text-[16.5px] font-bold tracking-[0.02em] text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                {garage.facade}
              </span>
            </div>

            {/* Badge & Favorite Button */}
            {garage.badge && (
              <span className="absolute left-4 top-4 rounded-[10px] bg-[#1aa14a] px-3.5 py-1.5 text-[12px] font-bold text-white shadow-lg">
                {garage.badge}
              </span>
            )}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1a56db] shadow-[0_8px_20px_rgba(30,58,138,0.15)] transition-transform hover:scale-105 active:scale-95"
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-colors',
                  isFavorite ? 'fill-[#e53e3e] text-[#e53e3e]' : 'text-[#1a56db]'
                )}
              />
            </button>
          </div>

          {/* Garage Details Header Row */}
          <Card className="rounded-[22px] border-[#e7eefc] p-6 shadow-[0_12px_32px_rgba(21,48,122,0.05)] bg-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3.5 md:max-w-[65%]">
                <div className="flex items-center gap-2">
                  <h1 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#17307a] sm:text-[25px]">
                    {garage.name}
                  </h1>
                  {garage.verified && (
                    <CheckCircle2 className="h-6 w-6 shrink-0 fill-[#1a56db] text-[#1a56db]" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-[13px] font-semibold text-[#536891]">
                  <div className="flex items-center gap-1">
                    <Star className="h-4.5 w-4.5 fill-[#ff9f1a] text-[#ff9f1a]" />
                    <span className="text-[#f28c28]">{garage.rating.toFixed(1)}</span>
                    <span className="text-[#92a1c2]">({garage.reviews} Reviews)</span>
                  </div>
                  <span className="text-[#cbd4e6]">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-[#1a56db]" />
                    <span>{garage.distanceKm.toFixed(1)} km away</span>
                  </div>
                  <span className="text-[#cbd4e6]">•</span>
                  <span>{garage.location}</span>
                </div>

                {/* Response / Time Pills */}
                <div className="flex flex-wrap gap-2.5 pt-1.5">
                  <div className="flex items-center gap-2 rounded-full bg-[#f0f4ff] px-3.5 py-1.5 text-[11px] font-bold text-[#1a56db]">
                    <Clock className="h-4 w-4" />
                    <span>{garage.responseMins} mins response time</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#eefbf3] px-3.5 py-1.5 text-[11px] font-bold text-[#228453]">
                    <Clock className="h-4 w-4" />
                    <span>Open until 10:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#fdf5ed] px-3.5 py-1.5 text-[11px] font-bold text-[#f28c28]">
                    <Shield className="h-4 w-4" />
                    <span>20+ years in service</span>
                  </div>
                </div>

                {/* Adaptive Description */}
                <div className="space-y-2 pt-3">
                  <p className="text-[13px] font-medium leading-[1.6] text-[#42526e]">
                    {garage.name} is a trusted car service and repair center in {garage.location}. 
                    We offer a wide range of services with certified mechanics, modern equipment and 
                    a customer-first approach. {isExpanded && "Our facility handles everything from scheduled maintenance to complex diagnostics, ensuring absolute precision and absolute satisfaction."}
                  </p>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[#1a56db] hover:underline"
                  >
                    <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                    <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
                  </button>
                </div>
              </div>

              {/* Highlights Subcard */}
              <div className="flex-1 rounded-[18px] border border-[#e2eefc] bg-[#f8fbff] p-5 md:max-w-[32%]">
                <h3 className="text-[14px] font-bold text-[#17307a] mb-4">Garage Highlights</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Certified Technicians', icon: Wrench },
                    { label: 'Advanced Diagnostic Tools', icon: Gauge },
                    { label: 'Genuine Spare Parts', icon: Shield },
                    { label: 'Transparent Pricing', icon: Tag },
                    { label: '4000+ Happy Customers', icon: Star },
                  ].map((hl, index) => (
                    <li key={index} className="flex items-center gap-3 text-[12px] font-bold text-[#42548a]">
                      <hl.icon className="h-4 w-4 shrink-0 text-[#1a56db]" />
                      <span className="truncate">{hl.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Services Offered */}
          <section className="space-y-3.5">
            <h2 className="text-[16.5px] font-bold text-[#17307a]">Services Offered</h2>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {servicesOffered.map((svc, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center rounded-[16px] border border-[#e2eefc] bg-white p-5 text-center shadow-[0_8px_20px_rgba(22,48,112,0.03)] transition-all hover:border-[#1a56db]/30 hover:shadow-[0_12px_28px_rgba(26,86,219,0.06)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f4ff] text-[#1a56db] mb-3">
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[12px] font-bold text-[#17307a]">{svc.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="space-y-3.5">
            <h2 className="text-[16.5px] font-bold text-[#17307a]">Why Choose {garage.name}?</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { title: '1 Month Warranty', desc: 'On all repairs and services', icon: Shield },
                { title: 'Free Inspection', desc: 'Complete vehicle checkup', icon: Eye },
                { title: 'Free Pickup & Drop', desc: 'Within 10 km radius', icon: MapPin },
                { title: 'Pay After Service', desc: 'No upfront payment', icon: CheckCircle2 },
                { title: 'Genuine Parts', desc: '100% original parts used', icon: Sparkles },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-[16px] border border-[#deefe2] bg-[#f3fbf5] p-4 text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e2f7e9] text-[#21834c] mb-3">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-[12px] font-bold text-[#17307a]">{item.title}</h4>
                  <p className="mt-1 text-[10px] font-medium leading-[1.3] text-[#536891]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Reviews */}
          <section className="space-y-4">
            <h2 className="text-[16.5px] font-bold text-[#17307a]">Customer Reviews ({garage.reviews})</h2>
            <div className="grid gap-4 md:grid-cols-[200px_1fr_1fr]">
              {/* Overall Rating Card */}
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#e2eefc] bg-white p-6 text-center">
                <span className="text-[47px] font-extrabold tracking-tight text-[#17307a]">
                  {garage.rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 my-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(garage.rating) ? "fill-[#ff9f1a] text-[#ff9f1a]" : "text-[#dbe6ff]"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[14px] font-bold text-[#228453]">Excellent</span>
                <span className="mt-1 text-[11px] font-semibold text-[#8a99ad]">{garage.reviews} reviews</span>
              </div>

              {/* Progress Bars Card */}
              <div className="rounded-[20px] border border-[#e2eefc] bg-white p-5 space-y-2.5 flex flex-col justify-center">
                {[
                  { stars: 5, pct: '62%', count: '60' },
                  { stars: 4, pct: '25%', count: '24' },
                  { stars: 3, pct: '8%', count: '8' },
                  { stars: 2, pct: '3%', count: '3' },
                  { stars: 1, pct: '2%', count: '1' },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 text-[11px] font-bold text-[#536891]">
                    <span className="w-2.5 text-right">{row.stars}</span>
                    <Star className="h-3.5 w-3.5 fill-[#cbd4e6] text-[#cbd4e6]" />
                    <div className="h-2 flex-1 rounded-full bg-[#f0f4ff] overflow-hidden">
                      <div className="h-full rounded-full bg-[#1aa14a]" style={{ width: row.pct }} />
                    </div>
                    <span className="w-8 text-right">{row.pct}</span>
                    <span className="w-8 text-right text-[#8a99ad]">({row.count})</span>
                  </div>
                ))}
              </div>

              {/* Individual Review Card */}
              <div className="relative rounded-[20px] border border-[#e2eefc] bg-white p-5 shadow-[0_4px_16px_rgba(22,48,112,0.02)] flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4ff] text-[12px] font-bold text-[#1a56db]">
                        {reviews[reviewPage].avatar}
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#17307a]">{reviews[reviewPage].name}</div>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-[#228453]">
                          <CheckCircle2 className="h-3 w-3 fill-[#228453] text-white" />
                          <span>{reviews[reviewPage].status}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#8a99ad]">{reviews[reviewPage].date}</span>
                  </div>

                  <div className="flex items-center gap-0.5 mt-2.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < Math.floor(reviews[reviewPage].rating) ? "fill-[#ff9f1a] text-[#ff9f1a]" : "text-[#cbd4e6]"
                        )}
                      />
                    ))}
                  </div>

                  <p className="mt-2.5 text-[12px] font-medium leading-[1.5] text-[#536891]">
                    "{reviews[reviewPage].text}"
                  </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-1.5 pt-3">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewPage(i)}
                      className={cn(
                        "h-2 w-2 rounded-full transition-colors",
                        i === reviewPage ? "bg-[#1a56db]" : "bg-[#cbd4e6]"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          {/* Appointment Booking Widget */}
          <Card className="rounded-[24px] border-[#e7eefc] bg-white p-5 shadow-[0_16px_40px_rgba(21,48,122,0.06)] space-y-5">
            <div>
              <h3 className="text-[16.5px] font-bold text-[#17307a]">Book Appointment</h3>
              <p className="text-[12px] font-semibold text-[#8a99ad] mt-1">Choose a date and time that works for you</p>
            </div>

            {/* Appointment Dates Carousel */}
            <div className="flex items-center gap-1.5 justify-between">
              {appointmentDates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-[14px] border p-2.5 w-[60px] h-[72px] transition-all",
                    selectedDate === d.date
                      ? "border-[#1a56db] bg-[#1a56db] text-white shadow-[0_8px_18px_rgba(26,86,219,0.18)]"
                      : "border-[#e2eefc] bg-white text-[#17307a] hover:bg-[#f8fbff]"
                  )}
                >
                  <span className={cn("text-[10px] font-bold", selectedDate === d.date ? "text-white/80" : "text-[#8a99ad]")}>
                    {d.day}
                  </span>
                  <span className="text-[16.5px] font-extrabold tracking-tight mt-1 leading-[1]">
                    {d.date}
                  </span>
                  <span className={cn("text-[9px] font-bold mt-1 uppercase tracking-wider", selectedDate === d.date ? "text-white/80" : "text-[#8a99ad]")}>
                    {d.month.slice(0,3)}
                  </span>
                </button>
              ))}
            </div>

            {/* Available Slots */}
            <div className="space-y-3">
              <span className="text-[12px] font-bold text-[#17307a]">Available Slots</span>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "flex items-center justify-center h-10 rounded-[10px] border text-[11px] font-bold tracking-tight transition-all",
                      selectedSlot === slot
                        ? "border-[#1a56db] bg-[#1a56db] text-white shadow-md"
                        : "border-[#e2eefc] bg-white text-[#17307a] hover:bg-[#f8fbff]"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleBookAppointment}
                className="w-full h-12 rounded-[14px] text-[14px] font-bold bg-[#1a56db] text-white hover:bg-[#0b43c4] shadow-lg transition-transform hover:scale-[1.01]"
              >
                Continue Booking
              </Button>
              <div className="flex flex-col gap-1.5 text-[11px] font-bold text-[#8a99ad] items-center justify-center pt-1 border-t border-[#eef3ff]">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-[#228453]" strokeWidth={3} />
                  <span>No upfront payment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-[#228453]" strokeWidth={3} />
                  <span>Final quote after inspection</span>
                </div>
              </div>
            </div>
          </Card>
          {/* Trust & Safety */}
          <Card className="rounded-[24px] border-[#e7eefc] bg-white p-5 shadow-[0_16px_40px_rgba(21,48,122,0.06)] space-y-4">
            <h3 className="text-[14.5px] font-bold text-[#17307a]">Trust & Safety</h3>
            <ul className="space-y-3.5">
              {[
                'Background Verified',
                '100% Secure Transactions',
                'Customer Data Protected',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-[12px] font-bold text-[#228453]">
                  <Check className="h-4.5 w-4.5 shrink-0" strokeWidth={3} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Booking Toast */}
      {bookingConfirmed && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#eefbf3] border border-[#a3e2bc] p-4 shadow-[0_10px_30px_rgba(35,132,83,0.15)] animate-in slide-in-from-bottom duration-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2f7e9] text-[#228453]">
            <Check className="h-5 w-5" strokeWidth={3} />
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#17307a]">Appointment Confirmed!</div>
            <div className="text-[11px] font-semibold text-[#536891]">
              For May {selectedDate} at {selectedSlot} with {garage.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
