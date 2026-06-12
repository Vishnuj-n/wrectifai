'use client';

import { BadgeCheck, Check, CircleAlert, Gauge, Info, Lock, PhoneCall, Send, Shield, ShieldCheck, Wrench } from 'lucide-react';
import { cn } from '@/utils/cn';

export type DiagnoseIssue = {
  id: string;
  title: string;
  badge: string;
  badgeClass: string;
  description: string;
  match: number;
  risks: string[];
  estimatedCost: string;
  imageSrc: string;
};

export const resultIssues: DiagnoseIssue[] = [
  {
    id: 'wheel-balance',
    title: 'Wheel Balancing Issue',
    badge: 'High Match',
    badgeClass: 'bg-[#ffe8ea] text-[#ff4f68]',
    description:
      'Unbalanced wheels can cause vibration in the steering wheel, especially at higher speeds.',
    match: 85,
    risks: ['Uneven tyre wear', 'Suspension damage'],
    estimatedCost: '₹1,500 - ₹2,500',
    imageSrc: '/assets/tyres_and_wheels.png',
  },
  {
    id: 'wheel-alignment',
    title: 'Wheel Alignment Issue',
    badge: 'Medium Match',
    badgeClass: 'bg-[#fff2df] text-[#f59a23]',
    description:
      'Improper alignment can cause vibrations and pulling to one side.',
    match: 65,
    risks: ['Uneven tyre wear', 'Handling issues'],
    estimatedCost: '₹800 - ₹1,500',
    imageSrc: '/assets/Tyre_rotataion.png',
  },
  {
    id: 'brake-disc',
    title: 'Brake Disc Warped',
    badge: 'Low Match',
    badgeClass: 'bg-[#edf2ff] text-[#4974ff]',
    description:
      'Warped brake discs can cause vibration in the steering wheel while braking.',
    match: 40,
    risks: ['Reduced braking performance', 'Safety risk'],
    estimatedCost: '₹2,500 - ₹4,500',
    imageSrc: '/assets/brake_rotor.png',
  },
];

export const resultSummaryItems = [
  {
    title: 'Top Concern',
    heading: 'Wheel Balancing Issue',
    body: 'Unbalanced wheels are the most likely cause of the vibration.',
    pill: 'High Priority',
    pillClass: 'bg-[#ffe9ec] text-[#ff5a63]',
    icon: CircleAlert,
    iconClass: 'bg-[#fff1f1] text-[#ff5d67]',
  },
  {
    title: 'Other Possible Issues',
    heading: 'Wheel Alignment, Brake Disc Warped',
    body: 'These issues may also contribute to the problem.',
    pill: 'Medium Priority',
    pillClass: 'bg-[#fff1de] text-[#f39b20]',
    icon: Wrench,
    iconClass: 'bg-[#fff5e8] text-[#f39b20]',
  },
  {
    title: 'What This Means',
    heading: 'Address this issue early',
    body: 'Addressing these issues early can prevent further damage and ensure safety.',
    pill: 'Important',
    pillClass: 'bg-[#e8f8eb] text-[#23a249]',
    icon: Info,
    iconClass: 'bg-[#edf2ff] text-[#4974ff]',
  },
];

export const resultNextSteps = [
  {
    step: '01',
    title: 'Get Quotes',
    body: 'Receive quotes from trusted garages',
    meta: 'Within 30 mins',
  },
  {
    step: '02',
    title: 'Compare & Choose',
    body: 'Compare prices, ratings & reviews',
    meta: 'At your convenience',
  },
  {
    step: '03',
    title: 'Book Appointment',
    body: 'Choose time slot & book',
    meta: 'Instant confirmation',
  },
  {
    step: '04',
    title: 'Get Service',
    body: 'Visit garage & get your car fixed',
    meta: 'Quality service',
  },
];

export const resultTrustItems = [
  {
    title: '100% Free',
    description: 'No hidden charges',
    icon: Shield,
  },
  {
    title: 'Trusted Garages Only',
    description: 'Verified & rated garages',
    icon: BadgeCheck,
  },
  {
    title: 'Best Price Guarantee',
    description: 'Get the best deals',
    icon: Gauge,
  },
  {
    title: 'Secure & Private',
    description: 'Your data is safe with us',
    icon: Lock,
  },
];

export function ConfidenceGauge({ value }: { value: number }) {
  const radius = 52;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (circumference * value) / 100;

  return (
    <div className="relative mx-auto h-[126px] w-[190px] overflow-hidden">
      <svg className="absolute inset-0" viewBox="0 0 190 126" aria-hidden="true">
        <path
          d="M 31 95 A 64 64 0 0 1 159 95"
          fill="none"
          stroke="#e7edff"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M 31 95 A 64 64 0 0 1 159 95"
          fill="none"
          stroke="url(#confidence-gradient)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        <defs>
          <linearGradient id="confidence-gradient" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#1533d5" />
            <stop offset="100%" stopColor="#5a8bff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-x-0 top-[38px] text-center">
        <div className="text-[44px] font-semibold tracking-[-0.05em] text-[#1d37b9]">{value}%</div>
        <div className="mt-2 text-[18px] font-semibold text-[#2aaa4c]">High Confidence</div>
      </div>
    </div>
  );
}

export function ResultTrustFooter() {
  return (
    <div className="grid gap-4 rounded-[22px] border border-[#e6ecfb] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)] md:grid-cols-2 xl:grid-cols-4">
      {resultTrustItems.map(({ title, description, icon: Icon }) => (
        <div key={title} className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4f7ff] text-[#3158e1]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[15px] font-semibold text-[#2243a3]">{title}</div>
            <div className="mt-1 text-[13px] text-[#7586b0]">{description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepRibbon({
  steps,
}: {
  steps: Array<{
    id: string;
    title: string;
    description: string;
    complete: boolean;
    active: boolean;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#e6ecfb] bg-white p-0 shadow-[0_14px_32px_rgba(37,73,153,0.04)]">
      <div className={cn('grid', steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4')}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'relative flex items-center gap-4 px-6 py-6',
              index < steps.length - 1 ? 'border-b border-[#eef2ff] md:border-b-0 md:border-r' : '',
              index < steps.length - 1 ? 'border-[#eef2ff]' : ''
            )}
          >
            {index < steps.length - 1 ? (
              <div className="pointer-events-none absolute right-[-23px] top-0 z-10 hidden h-full w-[46px] bg-white md:block [clip-path:polygon(0_0,100%_50%,0_100%,18%_100%,72%_50%,18%_0)]" />
            ) : null}
            <div
              className={cn(
                'relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[16px] font-semibold',
                step.complete && !step.active
                  ? 'bg-[#1ea84a] text-white'
                  : step.active
                    ? 'bg-[#2350f6] text-white'
                    : 'bg-[#eef1fb] text-[#9da8c6]'
              )}
            >
              {step.complete && !step.active ? <Check className="h-5 w-5 stroke-[3]" /> : step.id}
            </div>
            <div className="relative z-20">
              <div className={cn('text-[14px] font-semibold', step.active ? 'text-[#1e46ce]' : 'text-[#1f3275]')}>
                {step.title}
              </div>
              <div className="mt-1 text-[13px] text-[#7384af]">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const sharedIcons = {
  PhoneCall,
  Send,
  ShieldCheck,
};
