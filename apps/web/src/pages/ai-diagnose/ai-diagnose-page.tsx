'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Check,
  CheckCircle2,
  CirclePlay,
  Clock3,
  Edit3,
  Gauge,
  ImageIcon,
  Lock,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
  ArrowRight,
  ChevronDown,
  Target,
  Bomb,
  Settings,
  Contact,
  ArrowLeft,
  PenLine,
  PhoneCall,
  Wrench,
  CircleAlert,
  Info,
  Headset,
  BadgeCheck,
  Shield,
  CarFront,
  type LucideIcon,
} from 'lucide-react';
import {
  fallbackCategoryQuestion,
  getCategoryById,
  getCategoryByLabel,
  issueCategories,
  MAX_DIAGNOSE_QUESTIONS,
  rankIssueCategories,
  type DiagnosticIssueResult,
  type IssueCategoryConfig,
  type IssueQuestion,
} from '@/components/ai-diagnose/issue-intake-config';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Card } from '@/components/common/card';
import { cn } from '@/utils/cn';

type ChatEntry =
  | {
      id: string;
      sender: 'assistant';
      time: string;
      kind: 'message';
      text: string;
      highlighted?: boolean;
    }
  | {
      id: string;
      sender: 'assistant';
      time: string;
      kind: 'question';
      question: string;
      options: string[];
      selected: string;
    }
  | {
      id: string;
      sender: 'user';
      time: string;
      kind: 'reply';
      text: string;
    };

const trustItems = [
  {
    label: '98% Accurate Diagnosis',
    icon: Target,
    iconClass: 'text-[#20409a]',
  },
  {
    label: 'Secure & Private',
    icon: Lock,
    iconClass: 'text-[#1e9b57]',
  },
  {
    label: 'Expert Verified',
    icon: ShieldCheck,
    iconClass: 'text-[#2b61f0]',
  },
];

const footerFeatures = [
  {
    title: 'Save Time & Money',
    description: 'Accurate diagnosis helps you save up to 30%',
    icon: Bomb,
  },
  {
    title: 'Expert AI Analysis',
    description: 'Trained on 2M+ real car problems',
    icon: Settings,
  },
  {
    title: '100% Free',
    description: 'No charges for diagnosis and recommendations',
    icon: Zap,
  },
  {
    title: 'Trusted Garages',
    description: 'Only verified & rated garages',
    icon: Contact,
  },
];

const legacyResultIssues = [
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

const legacyResultSummaryItems = [
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

const resultNextSteps = [
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

const resultTrustItems = [
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

const CATEGORY_MATCH_QUESTION_ID = 'category_match';
const FALLBACK_NONE_OPTION = 'None of these';
const DEFAULT_ISSUE_TEXT = 'I need help diagnosing my car issue.';

type AnswerMap = Record<string, string>;

type AnswerSummaryItem = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type ResultSummaryItem = {
  title: string;
  heading: string;
  body: string;
  pill: string;
  pillClass: string;
  icon: LucideIcon;
  iconClass: string;
};

type InitialFlowState = {
  issueText: string;
  introText: string;
  initialQuestion: IssueQuestion;
  activeCategoryId: string | null;
};

const summaryIcons: LucideIcon[] = [Gauge, CheckCircle2, Clock3, Wrench, Info];

function getCurrentTimeLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createQuestionEntry(question: IssueQuestion): ChatEntry {
  return {
    id: question.id,
    sender: 'assistant',
    time: getCurrentTimeLabel(),
    kind: 'question',
    question: question.question,
    options: question.options,
    selected: '',
  };
}

function buildInitialFlow(issueText: string): InitialFlowState {
  const trimmedIssue = issueText.trim();
  const rankedMatches = rankIssueCategories(trimmedIssue);
  const candidateCategories = rankedMatches.slice(0, 3).map((entry) => entry.category);

  if (candidateCategories.length === 1) {
    return {
      issueText: trimmedIssue || DEFAULT_ISSUE_TEXT,
      introText: `This sounds like ${candidateCategories[0].label.toLowerCase()}. I will ask a few targeted questions.`,
      initialQuestion: candidateCategories[0].questions[0],
      activeCategoryId: candidateCategories[0].id,
    };
  }

  if (candidateCategories.length > 1) {
    return {
      issueText: trimmedIssue || DEFAULT_ISSUE_TEXT,
      introText: 'I found a few likely issue groups. Pick the closest one so I can ask the right questions.',
      initialQuestion: {
        id: CATEGORY_MATCH_QUESTION_ID,
        label: 'Best match',
        question: 'Which of these best matches the issue you typed?',
        options: [...candidateCategories.map((category) => category.label), FALLBACK_NONE_OPTION],
      },
      activeCategoryId: null,
    };
  }

  return {
    issueText: trimmedIssue || DEFAULT_ISSUE_TEXT,
    introText: trimmedIssue
      ? 'I could not classify that directly, so I will narrow it down with a few issue-specific questions.'
      : 'Describe the issue and I will narrow it down with a few issue-specific questions.',
    initialQuestion: fallbackCategoryQuestion,
    activeCategoryId: null,
  };
}

function getNextQuestion(activeCategoryId: string | null, answers: AnswerMap) {
  const category = activeCategoryId ? getCategoryById(activeCategoryId) : undefined;
  if (!category) {
    return null;
  }

  return category.questions.find((question) => !answers[question.id]) ?? null;
}

function getResolvedIssues(activeCategoryId: string | null) {
  return getCategoryById(activeCategoryId ?? '')?.possibleIssues ?? issueCategories[0].possibleIssues;
}

function getResultSummaryItems(
  activeCategory: IssueCategoryConfig | undefined,
  issues: DiagnosticIssueResult[]
): ResultSummaryItem[] {
  if (!activeCategory && issues.length === legacyResultIssues.length) {
    return legacyResultSummaryItems as ResultSummaryItem[];
  }

  const topIssue = issues[0];
  const secondaryIssues = issues.slice(1);

  return [
    {
      title: 'Top Concern',
      heading: topIssue?.title ?? 'Further inspection needed',
      body: topIssue?.description ?? 'Your answers suggest a primary issue, but a garage inspection is still recommended.',
      pill: 'High Priority',
      pillClass: 'bg-[#ffe9ec] text-[#ff5a63]',
      icon: CircleAlert,
      iconClass: 'bg-[#fff1f1] text-[#ff5d67]',
    },
    {
      title: 'Other Possible Issues',
      heading: secondaryIssues.length ? secondaryIssues.map((issue) => issue.title).join(', ') : 'No strong secondary match',
      body: secondaryIssues.length
        ? `These ${activeCategory?.label.toLowerCase() ?? 'related'} issues can also produce similar symptoms.`
        : 'Your answers point more strongly to one primary issue than multiple competing matches.',
      pill: 'Medium Priority',
      pillClass: 'bg-[#fff1de] text-[#f39b20]',
      icon: Wrench,
      iconClass: 'bg-[#fff5e8] text-[#f39b20]',
    },
    {
      title: 'What This Means',
      heading: activeCategory ? `${activeCategory.label} is the most likely issue family` : 'Targeted inspection recommended',
      body:
        activeCategory?.summaryMeaning ??
        'The follow-up answers are enough to narrow the issue family, but a physical inspection is still required for confirmation.',
      pill: 'Important',
      pillClass: 'bg-[#e8f8eb] text-[#23a249]',
      icon: Info,
      iconClass: 'bg-[#edf2ff] text-[#4974ff]',
    },
  ];
}

function buildAnswerSummaryItems(answers: AnswerMap) {
  const questionLookup = new Map<string, IssueQuestion>();

  issueCategories.forEach((category) => {
    category.questions.forEach((question) => {
      questionLookup.set(question.id, question);
    });
  });

  questionLookup.set(CATEGORY_MATCH_QUESTION_ID, {
    id: CATEGORY_MATCH_QUESTION_ID,
    label: 'Best match',
    question: '',
    options: [],
  });
  questionLookup.set(fallbackCategoryQuestion.id, fallbackCategoryQuestion);

  return Object.entries(answers)
    .map(([questionId, value], index) => {
      const question = questionLookup.get(questionId);
      if (!question || !value) {
        return null;
      }

      return {
        label: question.label,
        value,
        icon: summaryIcons[index % summaryIcons.length],
      };
    })
    .filter((item): item is AnswerSummaryItem => item !== null);
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 31;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative h-[86px] w-[86px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 86 86" aria-hidden="true">
        <circle cx="43" cy="43" r={radius} fill="none" stroke="#edf2ff" strokeWidth="6" />
        <circle
          cx="43"
          cy="43"
          r={radius}
          fill="none"
          stroke="#3f6fff"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[14px] font-bold text-[#214ccf]">{progress}%</span>
      </div>
    </div>
  );
}

function AssistantPill() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dce7ff] bg-white shadow-[0_6px_16px_rgba(31,94,255,0.08)] overflow-hidden">
      <Image
        src="/assets/Robo_icon.png"
        alt="WrectifAI"
        width={28}
        height={28}
        className="h-full w-full object-contain p-0.5"
      />
    </div>
  );
}

function DiagnoseAnalyzingScreen({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const step1 = setTimeout(() => setCurrentStep(1), 1000);
    const step2 = setTimeout(() => setCurrentStep(2), 2000);
    const step3 = setTimeout(() => setCurrentStep(3), 3000);
    const done = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4000);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(done);
    };
  }, [onComplete]);

  const analyzingSteps = [
    {
      title: 'Analyzing issue',
      description: 'Reading your input',
      icon: Sparkles,
    },
    {
      title: 'Checking systems',
      description: 'Scanning possible causes',
      icon: Settings,
    },
    {
      title: 'Matching solutions',
      description: 'Finding best fixes',
      icon: Gauge,
    },
    {
      title: 'Preparing results',
      description: 'Almost there...',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="px-4 pb-4 pt-1 md:px-7">
      <div className="overflow-hidden rounded-[24px] border border-[#e8eefc] bg-[radial-gradient(circle_at_top,#f7f9ff_0%,#ffffff_60%)] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] md:px-8 md:py-6">
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
          <div className="pointer-events-none absolute left-1/2 top-[69px] hidden h-px w-[72%] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(72,117,255,0)_0%,rgba(72,117,255,0.2)_18%,rgba(72,117,255,0.42)_50%,rgba(72,117,255,0.2)_82%,rgba(72,117,255,0)_100%)] md:block" />

          <div className="relative flex h-[150px] w-[150px] items-center justify-center">
            <div className="absolute inset-[8px] rounded-full border-[6px] border-[#edf3ff]" />
            <div className="absolute inset-0 rounded-full border-[6px] border-[#2f67ff] border-t-transparent border-l-transparent animate-spin [animation-duration:2.4s]" />
            <div className="absolute inset-[24px] rounded-full border border-[#dae6ff] bg-white/70 shadow-[0_24px_48px_rgba(39,73,154,0.08)] backdrop-blur-sm" />
            <div className="absolute inset-[36px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#275dff_0%,#143fb8_58%,#0d2f8f_100%)] shadow-[0_20px_40px_rgba(24,69,198,0.28)]" />
            <div className="relative flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/25 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),rgba(255,255,255,0.04))]">
              <Image
                src="/Logo_noBg.png"
                alt="WrectifAI Logo"
                width={50}
                height={50}
                priority
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-[#1f43a8]">
            Analyzing your issue...
          </h2>
          <p className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-[#46619d]">
            WrectifAI is checking possible causes and preparing the best solutions for you.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e3ebff] bg-white/90 px-4 py-2 text-[13px] font-medium text-[#4b63a0] shadow-[0_10px_26px_rgba(39,73,154,0.06)]">
            <Clock3 className="h-4 w-4 text-[#416cff]" />
            <span>This may take a few seconds, please wait.</span>
          </div>

          <div className="mt-6 grid w-full gap-4 md:grid-cols-4">
            {analyzingSteps.map(({ title, description, icon: Icon }, index) => {
              const isComplete = index < currentStep;
              const isActive = index === currentStep;
              return (
                <div key={title} className="relative flex flex-col items-center text-center">
                  {index < analyzingSteps.length - 1 ? (
                    <div className="absolute left-[calc(50%+22px)] top-[22px] hidden h-px w-[calc(100%-44px)] bg-[#d9e4ff] md:block">
                      <div
                        className={cn(
                          'h-full bg-[#2350f6] transition-all duration-500 ease-out',
                          index < currentStep ? 'w-full' : 'w-0'
                        )}
                      />
                    </div>
                  ) : null}
                  <div
                    className={cn(
                      'relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300',
                      isComplete
                        ? 'border-[#1ea84a] bg-[#1ea84a] text-white shadow-[0_8px_20px_rgba(30,168,74,0.15)]'
                        : isActive
                          ? 'border-[#2350f6] bg-[#2350f6] text-white shadow-[0_8px_20px_rgba(35,80,246,0.25)] scale-110'
                          : 'border-[#dce7ff] bg-white text-[#7d8bb0]'
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-5 w-5 stroke-[3]" />
                    ) : (
                      <Icon className={cn('h-5 w-5', isActive ? 'animate-pulse' : '')} />
                    )}
                  </div>
                  <div
                    className={cn(
                      'mt-3 text-[13px] font-semibold transition-colors duration-300',
                      isActive ? 'text-[#2350f6]' : isComplete ? 'text-[#1ea84a]' : 'text-[#21419a]'
                    )}
                  >
                    {title}
                  </div>
                  <div
                    className={cn(
                      'mt-1 text-[12px] transition-colors duration-300',
                      isActive ? 'text-[#5a8bff]' : 'text-[#647aa8]'
                    )}
                  >
                    {description}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 w-full rounded-[18px] border border-[#e8eefc] bg-white/90 px-4 py-3.5 shadow-[0_10px_28px_rgba(39,73,154,0.04)]">
            <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-[#2d59d3]">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>WrectifAI scans thousands of data points to provide accurate diagnosis and recommendations.</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-[#6c7fa8]">
            <Lock className="h-3.5 w-3.5" />
            <span>100% Secure</span>
            <span>•</span>
            <span>Your data is safe with us</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfidenceGauge({ value }: { value: number }) {
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

type DiagnoseResultsScreenProps = {
  issueText: string;
  answerSummaryItems: AnswerSummaryItem[];
  activeCategory: IssueCategoryConfig | undefined;
  resultIssues: DiagnosticIssueResult[];
  selectedIssues: string[];
  detailsText: string;
  onDetailsTextChange: (value: string) => void;
  onToggleIssue: (issueId: string) => void;
  onEditIssue: () => void;
  onRequestQuotes: () => void;
};

function DiagnoseResultsScreen({
  issueText,
  answerSummaryItems,
  activeCategory,
  resultIssues,
  selectedIssues,
  detailsText,
  onDetailsTextChange,
  onToggleIssue,
  onEditIssue,
  onRequestQuotes,
}: DiagnoseResultsScreenProps) {
  const selectedCount = selectedIssues.length;
  const detailsTabs = ['Text Details', 'Photo', 'Video', 'Audio'];
  const resultSummaryItems = getResultSummaryItems(activeCategory, resultIssues);
  const collectedSummaryText = answerSummaryItems.length
    ? answerSummaryItems.map((item) => `${item.label}: ${item.value}`).join(' | ')
    : 'No structured follow-up answers were captured.';

  return (
    <div className="space-y-5 pb-6">
      <div className="space-y-2">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#2f54d1] transition-colors hover:text-[#163cb3]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <div>
          <h1 className="text-[37px] font-semibold tracking-[-0.045em] text-[#183db1]">
            WrectifAI Diagnosis Results
          </h1>
          <p className="mt-1 text-[16px] text-[#6176ac]">Here&apos;s what WrectifAI found based on your input</p>
        </div>
      </div>

      <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-5 shadow-[0_12px_28px_rgba(37,73,153,0.04)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-[18px] font-semibold text-[#1f3da4]">Your Issue</div>
            <p className="mt-3 text-[14px] leading-7 text-[#3d568f]">
              {issueText}
            </p>
            <p className="mt-3 text-[13px] leading-6 text-[#6c7ca6]">
              WrectifAI used the issue you typed and the follow-up chat answers below to build this diagnosis.
            </p>
            {activeCategory ? (
              <div className="mt-4 inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-semibold text-[#2853e8]">
                Detected issue family: {activeCategory.label}
              </div>
            ) : null}
            <div className="mt-5 rounded-[16px] border border-[#e8eefc] bg-[#fbfcff] px-4 py-4">
              <div className="text-[13px] font-semibold text-[#24459f]">Collected From Chat</div>
              <p className="mt-2 text-[13px] leading-6 text-[#60729d]">
                {collectedSummaryText}
              </p>
              {answerSummaryItems.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {answerSummaryItems.map(({ label, value }) => (
                    <span
                      key={label}
                      className="rounded-full border border-[#dbe6ff] bg-white px-3 py-1.5 text-[12px] font-medium text-[#31508f]"
                    >
                      {label}: {value}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onEditIssue}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[12px] border border-[#dde6ff] px-5 text-[14px] font-medium text-[#2451e5] transition-colors hover:bg-[#f8fbff]"
          >
            <PenLine className="h-4 w-4" />
            <span>Edit Issue</span>
          </button>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_242px]">
        <div className="space-y-5">
          <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[18px] font-semibold text-[#183db1]">WrectifAI Diagnosis Summary</h2>
              <span className="rounded-full bg-[#e8f8eb] px-3 py-1 text-[11px] font-semibold text-[#25a24a]">
                Analysis completed in 8.4s
              </span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="flex flex-col items-center rounded-[18px] bg-[radial-gradient(circle_at_top,#f8faff_0%,#ffffff_70%)] px-4 py-5 text-center">
                <Image
                  src="/assets/mega car.png"
                  alt="Car"
                  width={230}
                  height={132}
                  className="h-auto w-[190px] object-contain"
                />
                <div className="mt-3 text-[15px] font-semibold text-[#26408d]">Honda City (TS07 AB 1234)</div>
                <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-left text-[12px] text-[#6a7ca9]">
                  <span>Petrol</span>
                  <span>2018</span>
                  <span className="col-span-2">KM Driven: 58,320 km</span>
                </div>
              </div>

              <div>
                <p className="text-center text-[13px] text-[#687ba8] lg:text-left">
                  WrectifAI analysis indicates potential issues that need immediate attention.
                </p>
                <div className="mt-6 space-y-5">
                  {resultSummaryItems.map(({ title, heading, body, pill, pillClass, icon: Icon, iconClass }) => (
                    <div key={title} className="flex items-start gap-4">
                      <span className={cn('mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconClass)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] text-[#7b89b0]">{title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <div className="text-[16px] font-semibold text-[#2142a2]">{heading}</div>
                          <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', pillClass)}>
                            {pill}
                          </span>
                        </div>
                        <p className="mt-2 text-[13px] leading-6 text-[#60729d]">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-semibold text-[#183db1]">Top Possible Issues</h2>
                <span className="text-[12px] text-[#7a88af]">(Select one or more to request quotes)</span>
              </div>
              <button type="button" className="inline-flex items-center gap-2 text-[12px] font-medium text-[#2854e9]">
                <Info className="h-3.5 w-3.5" />
                <span>Understand Results</span>
              </button>
            </div>

            <div className="mt-5 divide-y divide-[#edf1fb]">
              {resultIssues.map((issue, index) => {
                const checked = selectedIssues.includes(issue.id);
                return (
                  <div key={issue.id} className="grid gap-4 py-5 md:grid-cols-[26px_74px_minmax(0,1fr)_92px_112px] md:items-center">
                    <label className="flex items-start justify-center pt-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleIssue(issue.id)}
                        className="h-4.5 w-4.5 rounded border-[#cdd9fb] text-[#2551f6] focus:ring-[#2551f6]"
                      />
                    </label>
                    <div className="flex justify-center md:justify-start">
                      <Image
                        src={issue.imageSrc}
                        alt={issue.title}
                        width={72}
                        height={72}
                        className="h-[64px] w-[64px] object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-[17px] font-semibold text-[#183aa7]">
                          {index + 1}. {issue.title}
                        </div>
                        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', issue.badgeClass)}>
                          {issue.badge}
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] leading-6 text-[#61729f]">{issue.description}</p>
                      <div className="mt-3 text-[12px] font-semibold text-[#35508d]">Risk if ignored:</div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#6b7ba7]">
                        {issue.risks.map((risk) => (
                          <span key={risk}>• {risk}</span>
                        ))}
                      </div>
                      <div className="mt-3 text-[13px] text-[#5d6f9a]">
                        <span className="font-semibold text-[#35508d]">Estimated Cost:</span>{' '}
                        <span>{issue.estimatedCost}</span>
                      </div>
                    </div>
                    <div className="text-left md:text-center">
                      <div className="text-[40px] font-semibold tracking-[-0.05em] text-[#173ab3]">{issue.match}%</div>
                      <div className="text-[13px] text-[#7382ab]">Match</div>
                    </div>
                    <div className="flex items-center md:justify-end">
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#dde6ff] px-4 text-[13px] font-medium text-[#2853e8] transition-colors hover:bg-[#f8fbff]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <div>
              <h2 className="text-[18px] font-semibold text-[#183db1]">
                Provide more details for selected issue(s) <span className="text-[13px] font-medium text-[#8090b7]">(Optional)</span>
              </h2>
              <p className="mt-2 text-[13px] text-[#6f7fa9]">
                The more details you provide, the more accurate quotes you&apos;ll receive.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-8 border-b border-[#eaf0fd] px-2">
              {detailsTabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    'border-b-2 pb-3 text-[13px] font-medium transition-colors',
                    index === 0 ? 'border-[#3d68ff] text-[#244fe2]' : 'border-transparent text-[#8090b7]'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-[16px] border border-[#e8eefc] bg-[#fcfdff] px-4 py-4">
              <textarea
                value={detailsText}
                onChange={(event) => onDetailsTextChange(event.target.value)}
                placeholder="Add more details about the issue..."
                className="min-h-[96px] w-full resize-none bg-transparent text-[13px] leading-6 text-[#2b4278] outline-none placeholder:text-[#a5b1cb]"
              />
              <div className="text-right text-[11px] text-[#9babca]">{detailsText.length}/1000</div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-4 py-6 text-center shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <h3 className="text-[16px] font-semibold text-[#183db1]">Diagnosis Confidence</h3>
            <div className="mt-6">
              <ConfidenceGauge value={92} />
            </div>
            <p className="mx-auto mt-4 max-w-[180px] text-[13px] leading-7 text-[#6a7ca9]">
              Based on WrectifAI analysis of your issue description and thousands of similar cases.
            </p>
          </Card>

          <Card className="rounded-[22px] border-[#ffe4e2] bg-[linear-gradient(180deg,#fff8f7_0%,#fffdfd_100%)] px-4 py-6 shadow-[0_12px_30px_rgba(255,102,102,0.06)]">
            <h3 className="text-[16px] font-semibold text-[#ff4a43]">Need Immediate Help?</h3>
            <p className="mt-3 text-[13px] leading-6 text-[#8f7480]">
              Talk to our experts or get roadside assistance
            </p>
            <div className="mt-5 space-y-3">
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#dde6ff] bg-white text-[13px] font-medium text-[#2551e5]"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Support</span>
              </button>
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#dde6ff] bg-white text-[13px] font-medium text-[#2551e5]"
              >
                <Headset className="h-4 w-4" />
                <span>Roadside Assistance</span>
              </button>
            </div>
            <div className="mt-4 inline-flex rounded-full bg-[#ffe8e7] px-3 py-1 text-[11px] font-semibold text-[#ff584d]">
              24/7 Available
            </div>
          </Card>

          <Card className="rounded-[22px] border-[#e6ecfb] bg-white px-4 py-6 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
            <h3 className="text-[16px] font-semibold text-[#183db1]">Next Steps</h3>
            <div className="mt-6 space-y-6">
              {resultNextSteps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2f5ff] text-[12px] font-semibold text-[#3059e1]">
                    {step.step}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#2243a4]">{step.title}</div>
                    <p className="mt-1 text-[12px] leading-5 text-[#6b7ca8]">{step.body}</p>
                    <div className="mt-2 text-[11px] font-medium text-[#5b72b3]">◉ {step.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="rounded-[22px] border-[#e6ecfb] bg-[linear-gradient(180deg,#fbfcff_0%,#ffffff_100%)] px-6 py-4 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f2f5ff] text-[#365ff1]">
              <ShieldCheck className="h-5.5 w-5.5" />
            </span>
            <div>
              <div className="text-[17px] font-bold text-[#17307a]">
                Ready to get the best quotes from trusted garages?
              </div>
              <p className="mt-1 text-[13px] text-[#5f7099]">
                Send your selected issues and compare the best offers.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5 lg:items-end">
            <button
              type="button"
              onClick={onRequestQuotes}
              className="flex h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(90deg,#1a46e8_0%,#245cff_100%)] px-6 text-[14.5px] font-semibold text-white shadow-[0_10px_24px_rgba(37,82,235,0.18)] transition-transform hover:scale-[1.01]"
            >
              <Send className="h-4.5 w-4.5" />
              <span>Request Quotes ({selectedCount})</span>
            </button>
            <div className="text-[11.5px] text-[#7f8eb5]">You will receive quotes within 30 mins</div>
          </div>
        </div>
      </Card>

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
    </div>
  );
}

type FindingQuotesScreenProps = {
  resultIssues: DiagnosticIssueResult[];
  selectedIssues: string[];
  onBack: () => void;
};

function FindingQuotesScreen({ resultIssues, selectedIssues, onBack }: FindingQuotesScreenProps) {
  const chosenIssues = resultIssues.filter((issue) => selectedIssues.includes(issue.id));
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.push(`/request-aent?issues=${selectedIssues.join(',')}`);
    }
  }, [currentStep, selectedIssues, router]);

  return (
    <div className="space-y-5 pb-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#2f54d1] transition-colors hover:text-[#163cb3]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to WrectifAI Diagnosis Results</span>
        </button>
      </div>

      <div className="rounded-[24px] px-4 py-4">
        <div className="mx-auto max-w-[760px] text-center">
          <h1 className="text-[35px] font-semibold tracking-[-0.05em] text-[#173cab]">
            Finding the best garages for you...
          </h1>
          <p className="mt-2 text-[18px] text-[#4f65aa]">This will only take a few seconds</p>

          <div className="relative mx-auto mt-8 h-[210px] w-[390px] max-w-full">
            <div className="absolute inset-x-1/2 top-0 h-[124px] w-[124px] -translate-x-1/2 rounded-[26px] border border-[#cfe0ff] bg-[radial-gradient(circle_at_top,#ffffff_0%,#edf3ff_78%)] shadow-[0_16px_40px_rgba(44,92,255,0.12)]">
              <div className="absolute inset-0 rounded-[26px] border border-[#edf3ff]" />
              <div className="absolute inset-[13px] rounded-[18px] border-2 border-dashed border-[#b6cbff]" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src="/Logo_noBg.png"
                  alt="WrectifAI Logo"
                  width={80}
                  height={80}
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <div className="absolute left-1/2 top-[92px] h-[95px] w-[320px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(74,121,255,0.16)_0%,rgba(74,121,255,0)_72%)] blur-md" />
            <div className="absolute left-1/2 top-[106px] -translate-x-1/2">
              <Image
                src="/assets/mega car.png"
                alt="Car"
                width={260}
                height={110}
                className="h-auto w-[250px] object-contain drop-shadow-[0_16px_24px_rgba(28,74,188,0.18)]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <div className="absolute left-[20px] top-[86px] h-px w-[98px] bg-[#d7e3ff]" />
              <div className="absolute right-[20px] top-[86px] h-px w-[98px] bg-[#d7e3ff]" />
              <div className="absolute left-[48px] top-[72px] h-2 w-2 rounded-full bg-[#bfd1ff]" />
              <div className="absolute left-[82px] top-[120px] h-1.5 w-1.5 rounded-full bg-[#bfd1ff]" />
              <div className="absolute right-[54px] top-[68px] h-2 w-2 rounded-full bg-[#bfd1ff]" />
              <div className="absolute right-[86px] top-[124px] h-1.5 w-1.5 rounded-full bg-[#bfd1ff]" />
            </div>
          </div>
        </div>
      </div>

      <Card className="rounded-[22px] border-[#e7edfd] bg-white px-5 py-0 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
        <div className="grid md:grid-cols-4">
          {[
            { label: 'Analyzing your issue' },
            { label: 'Finding nearby trusted garages' },
            { label: 'Matching with best service providers' },
            { label: 'Sending your request' },
          ].map((step, index) => {
            const isComplete = index < currentStep;
            const isActive = index === currentStep;
            return (
              <div
                key={step.label}
                className={cn(
                  'flex items-center gap-4 px-5 py-7',
                  index < 3 ? 'border-b border-[#eef2ff] md:border-b-0 md:border-r md:border-[#eef2ff]' : ''
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300',
                    isComplete
                      ? 'border-[#17884f] bg-[#17884f] text-white'
                      : isActive
                        ? 'border-[#2351f6] bg-white text-[#2351f6]'
                        : 'border-[#7d85ba] bg-white text-transparent'
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <span className="h-3 w-3 rounded-full bg-current" />
                  )}
                </span>
                <div className={cn('text-[14px] font-medium transition-colors duration-300', isActive ? 'text-[#1e46ce]' : 'text-[#213882]')}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="rounded-[20px] border-[#e7edfd] bg-[linear-gradient(180deg,#fbfcff_0%,#ffffff_100%)] px-6 py-5 shadow-[0_12px_28px_rgba(37,73,153,0.04)]">
        <div className="flex items-center justify-center gap-3 text-center text-[15px] font-medium text-[#1f46c7]">
          <ShieldCheck className="h-5 w-5" />
          <span>We share your request only with verified and trusted garages.</span>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[254px_minmax(0,1fr)_390px]">
        <Card className="rounded-[22px] border-[#e7edfd] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
          <h3 className="text-[18px] font-semibold text-[#183db1]">Your Vehicle</h3>
          <div className="mt-10 flex flex-col items-center text-center">
            <span className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#f5f8ff_0%,#edf2ff_100%)] text-[#244fe5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <CarFront className="h-11 w-11" />
            </span>
            <div className="mt-8 text-[18px] font-semibold tracking-[-0.03em] text-[#193daa]">Honda City (TS07 AB 1234)</div>
            <div className="mt-5 flex items-center gap-4 text-[14px] text-[#6679a6]">
              <span>Petrol</span>
              <span className="h-1 w-1 rounded-full bg-[#8997bc]" />
              <span>2018</span>
            </div>
            <div className="mt-4 text-[14px] text-[#546a9f]">KM Driven: 58,320 km</div>
          </div>
        </Card>

        <Card className="rounded-[22px] border-[#e7edfd] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-semibold text-[#183db1]">Your Selected Issues</h3>
            <span className="text-[14px] text-[#6c80b0]">({chosenIssues.length} Selected)</span>
          </div>
          <div className="mt-5 divide-y divide-[#edf2fb]">
            {chosenIssues.map((issue, index) => (
              <div key={issue.id} className="grid gap-4 py-5 md:grid-cols-[76px_minmax(0,1fr)_92px] md:items-center">
                <div className="flex justify-center md:justify-start">
                  <Image
                    src={issue.imageSrc}
                    alt={issue.title}
                    width={72}
                    height={72}
                    className="h-[66px] w-[66px] object-contain"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-[16px] font-semibold text-[#183aa7]">
                      {index + 1}. {issue.title}
                    </div>
                    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', issue.badgeClass)}>
                      {issue.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-7 text-[#61729f]">{issue.description}</p>
                </div>
                <div className="text-left md:text-center">
                  <div className="text-[40px] font-semibold tracking-[-0.05em] text-[#173ab3]">{issue.match}%</div>
                  <div className="text-[13px] text-[#7382ab]">Match</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[22px] border-[#e7edfd] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(37,73,153,0.04)]">
          <h3 className="text-[18px] font-semibold text-[#183db1]">What&apos;s Happening?</h3>
          <div className="mt-8 space-y-7">
            {[
              { title: 'Analyzing your issue' },
              { title: 'Finding nearby trusted garages' },
              { title: 'Matching with best service providers' },
              { title: 'Sending your request' },
            ].map((step, index, array) => {
              const isComplete = index < currentStep;
              const isActive = index === currentStep;
              const status = isComplete ? 'Completed' : isActive ? 'In progress' : 'Pending';
              return (
                <div key={step.title} className="relative flex gap-4">
                  {index < array.length - 1 ? (
                    <div className="absolute left-[13px] top-[32px] h-[34px] w-px border-l border-dashed border-[#d8e4ff]" />
                  ) : null}
                  <span
                    className={cn(
                      'relative z-10 mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300',
                      isComplete
                        ? 'border-[#17884f] bg-[#17884f] text-white'
                        : isActive
                          ? 'border-[#2351f6] bg-white text-[#2351f6]'
                          : 'border-[#707ab3] bg-white text-transparent'
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    )}
                  </span>
                  <div>
                    <div className="text-[16px] font-medium text-[#183aa7]">{step.title}</div>
                    <div
                      className={cn(
                        'mt-2 text-[14px] font-medium transition-colors duration-300',
                        isComplete ? 'text-[#6477a6]' : isActive ? 'text-[#2351f6]' : 'text-[#7f8db3]'
                      )}
                    >
                      {status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

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
    </div>
  );
}

export function AIDiagnosePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIssueParam = searchParams?.get('issue')?.trim() ?? '';
  const initialFlow = buildInitialFlow(initialIssueParam);
  const [issueText, setIssueText] = useState(initialFlow.issueText);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(initialFlow.activeCategoryId);
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'message-1',
      sender: 'assistant',
      time: '10:30 AM',
      kind: 'message',
      text: initialFlow.introText,
      highlighted: true,
    },
    createQuestionEntry(initialFlow.initialQuestion),
  ]);

  const [answers, setAnswers] = useState<AnswerMap>({});

  const [progress, setProgress] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('WrectifAI is thinking...');
  const [activeStepId, setActiveStepId] = useState('2'); // '1' = Describe, '2' = Analyzing, '3' = Completed
  const [isDiagnosed, setIsDiagnosed] = useState(false);
  const [isFindingQuotes, setIsFindingQuotes] = useState(false);
  const [isAnalyzingResults, setIsAnalyzingResults] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [detailsText, setDetailsText] = useState('');
  
  const pageRootRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const pageScroller = (() => {
      let node = pageRootRef.current?.parentElement ?? null;
      while (node) {
        if (node.scrollHeight > node.clientHeight) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    })();

    window.scrollTo({ top: 0, behavior: 'auto' });
    pageScroller?.scrollTo({ top: 0, behavior: 'auto' });
    chatScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const chatScroller = chatScrollRef.current;
    if (!chatScroller) return;
    chatScroller.scrollTo({ top: chatScroller.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const applyDiagnoseFlow = (nextIssue: string) => {
    const flow = buildInitialFlow(nextIssue);

    setMessages([
      {
        id: 'message-1',
        sender: 'assistant',
        time: '10:30 AM',
        kind: 'message',
        text: flow.introText,
        highlighted: true,
      },
      createQuestionEntry(flow.initialQuestion),
    ]);
    setIssueText(flow.issueText);
    setActiveCategoryId(flow.activeCategoryId);
    setAnswers({});
    setProgress(60);
    setIsTyping(false);
    setTypingText('WrectifAI is thinking...');
    setActiveStepId('2');
    setIsDiagnosed(false);
    setIsFindingQuotes(false);
    setIsAnalyzingResults(false);
    setTypedMessage('');
    setSelectedIssues(
      flow.activeCategoryId
        ? getResolvedIssues(flow.activeCategoryId)
            .slice(0, 2)
            .map((issue) => issue.id)
        : []
    );
    setDetailsText('');
  };

  useEffect(() => {
    applyDiagnoseFlow(initialIssueParam);
  }, [initialIssueParam]);

  const resetDiagnoseFlow = () => {
    applyDiagnoseFlow(initialIssueParam);
    return;
    setMessages([
      {
        id: 'message-1',
        sender: 'assistant',
        time: '10:30 AM',
        kind: 'message',
        text: "Thanks! Let's narrow this down ✨",
        highlighted: true,
      },
      {
        id: 'question-1',
        sender: 'assistant',
        time: '10:30 AM',
        kind: 'question',
        question: 'When do you feel the vibration?',
        options: ['Only while braking', 'While accelerating', 'At constant speed', 'Always'],
        selected: '',
      },
    ]);
    setAnswers({ occursAt: '-', wheelShakes: '-', started: '-' });
    setProgress(60);
    setIsTyping(false);
    setTypingText('WrectifAI is thinking...');
    setActiveStepId('2');
    setIsDiagnosed(false);
    setIsFindingQuotes(false);
    setIsAnalyzingResults(false);
    setTypedMessage('');
    setSelectedIssues(['wheel-balance', 'wheel-alignment']);
    setDetailsText('');
  };

  const toggleSelectedIssue = (issueId: string) => {
    setSelectedIssues((current) =>
      current.includes(issueId)
        ? current.filter((item) => item !== issueId)
        : [...current, issueId]
    );
  };

  const activeCategory = activeCategoryId ? getCategoryById(activeCategoryId) : undefined;
  const resultIssues = activeCategoryId ? getResolvedIssues(activeCategoryId) : legacyResultIssues;
  const answerSummaryItems = buildAnswerSummaryItems(answers);

  const handleSelectOption = (questionId: string, option: string) => {
    if (isAnalyzingResults) return;

    // Prevent re-selecting options once chosen
    const question = messages.find(m => m.id === questionId);
    if (question && question.kind === 'question' && question.selected) return;

    const nextAnswers = { ...answers, [questionId]: option };
    const nextAnsweredCount = Object.keys(nextAnswers).length;
    const nextProgress = Math.min(95, 55 + nextAnsweredCount * 10);

    setMessages((prev) =>
      [
        ...prev.map((msg) =>
          msg.id === questionId && msg.kind === 'question'
            ? { ...msg, selected: option }
            : msg
        ),
        {
          id: `reply-${questionId}`,
          sender: 'user',
          time: getCurrentTimeLabel(),
          kind: 'reply',
          text: option,
        } satisfies ChatEntry,
      ]
    );
    setAnswers(nextAnswers);
    setProgress(nextProgress);

    const queueNextQuestion = (nextQuestion: IssueQuestion, nextCategoryId?: string | null) => {
      setIsTyping(true);
      setTypingText('WrectifAI is processing...');

      setTimeout(() => {
        setIsTyping(false);

        if (typeof nextCategoryId !== 'undefined') {
          setActiveCategoryId(nextCategoryId);

          if (nextCategoryId) {
            setSelectedIssues(getResolvedIssues(nextCategoryId).slice(0, 2).map((issue) => issue.id));
          }
        }

        setMessages((prev) => [...prev, createQuestionEntry(nextQuestion)]);
      }, 1000);
    };

    if (questionId === CATEGORY_MATCH_QUESTION_ID) {
      if (option === FALLBACK_NONE_OPTION) {
        queueNextQuestion(fallbackCategoryQuestion, null);
        return;
      }

      const matchedCategory = getCategoryByLabel(option);
      const nextQuestion = matchedCategory?.questions[0];

      if (!matchedCategory || !nextQuestion || nextAnsweredCount >= MAX_DIAGNOSE_QUESTIONS) {
        setActiveStepId('2');
        setIsAnalyzingResults(true);
        return;
      }

      queueNextQuestion(nextQuestion, matchedCategory.id);
      return;
    }

    if (questionId === fallbackCategoryQuestion.id) {
      const matchedCategory = getCategoryByLabel(option);
      const nextQuestion = matchedCategory?.questions[0];

      if (!matchedCategory || !nextQuestion || nextAnsweredCount >= MAX_DIAGNOSE_QUESTIONS) {
        setActiveStepId('2');
        setIsAnalyzingResults(true);
        return;
      }

      queueNextQuestion(nextQuestion, matchedCategory.id);
      return;
    }

    const nextQuestion = getNextQuestion(activeCategoryId, nextAnswers);

    if (!nextQuestion || nextAnsweredCount >= MAX_DIAGNOSE_QUESTIONS) {
      setActiveStepId('2');
      setIsAnalyzingResults(true);
      return;
    }

    queueNextQuestion(nextQuestion);
    return;

    // 1. Update selected option in the question bubble
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === questionId && msg.kind === 'question'
          ? { ...msg, selected: option }
          : msg
      )
    );

    // 2. Add User's reply bubble
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userReply: ChatEntry = {
      id: `reply-${questionId}`,
      sender: 'user',
      time: currentTime,
      kind: 'reply',
      text: option,
    };

    setMessages((prev) => [...prev, userReply]);

    // 3. Chain next bot action
    if (questionId === 'question-1') {
      setAnswers((prev) => ({ ...prev, occursAt: option }));
      setProgress(75);
      setIsTyping(true);
      setTypingText('WrectifAI is processing...');

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'question-2',
            sender: 'assistant',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kind: 'question',
            question: 'Does the steering wheel shake?',
            options: ['Yes', 'No'],
            selected: '',
          },
        ]);
      }, 1000);
    } else if (questionId === 'question-2') {
      setAnswers((prev) => ({ ...prev, wheelShakes: option }));
      setProgress(90);
      setIsTyping(true);
      setTypingText('Evaluating parameters...');

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'question-3',
            sender: 'assistant',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kind: 'question',
            question: 'When did this issue start?',
            options: ['Recently (within a week)', 'Gradually over time', 'Long back'],
            selected: '',
          },
        ]);
      }, 1000);
    } else if (questionId === 'question-3') {
      setAnswers((prev) => ({ ...prev, started: option }));
      setProgress(95);
      setActiveStepId('2'); // AI Analysis Step
      setIsAnalyzingResults(true);
    }
  };

  const handleSendMessage = () => {
    if (isAnalyzingResults) return;
    if (!typedMessage.trim()) return;


    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatEntry = {
      id: `user-manual-${Date.now()}`,
      sender: 'user',
      time: currentTime,
      kind: 'reply',
      text: typedMessage.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const inputDetail = typedMessage.trim();
    setTypedMessage('');
    setIsTyping(true);
    setTypingText('WrectifAI is thinking...');

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-reply-${Date.now()}`,
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          kind: 'message',
          text: isDiagnosed
            ? `I've noted: "${inputDetail}". This extra context has been shared with your inspection summary! Feel free to book an appointment with our matching garages below.`
            : `Understood! Let's finish the quick diagnostic questionnaire above first to ensure accurate results.`,
        },
      ]);
    }, 1200);
  };

  // Step Tracker component
  const StepTracker = () => {
    return (
      <div className="overflow-x-auto">
        <div className="mx-auto flex min-w-[620px] max-w-[720px] items-center px-2 py-0.5">
          {/* Step 1: Describe Issue */}
          <div className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 text-[#2b61f0] stroke-[3]" />
            <span className="text-[13px] font-semibold text-[#2b61f0]">Describe Issue</span>
          </div>
          
          {/* Connector 1: 1 -> 2 */}
          <div className="mx-4 h-px flex-1 bg-[#7fa2ff]" />
          
          {/* Step 2: AI Analysis */}
          <div className="flex items-center gap-2">
            {activeStepId === '3' ? (
              <Check className="h-4.5 w-4.5 text-[#2b61f0] stroke-[3]" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2b61f0] text-white text-[12px] font-bold shadow-[0_4px_12px_rgba(43,97,240,0.16)] animate-in scale-in-95 duration-200">
                2
              </div>
            )}
            <span className={cn(
              "text-[13px] font-semibold transition-colors duration-300",
              activeStepId === '3' ? "text-[#2b61f0]" : "text-[#1a56db] font-bold"
            )}>
              WrectifAI Analysis
            </span>
          </div>
          
          {/* Connector 2: 2 -> 3 */}
          <div className={cn(
            "mx-4 h-px flex-1 transition-all duration-500",
            activeStepId === '3' ? "bg-[#7fa2ff]" : "bg-[#edf2ff]"
          )} />
          
          {/* Step 3: Results */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300",
              activeStepId === '3' 
                ? "bg-[#2b61f0] text-white shadow-[0_4px_12px_rgba(43,97,240,0.16)]" 
                : "bg-[#f1f4fb] text-[#9aa8c8]"
            )}>
              3
            </div>
            <span className={cn(
              "text-[13px] font-semibold transition-colors duration-300",
              activeStepId === '3' ? "text-[#1a56db] font-bold" : "text-[#a0abc6]"
            )}>
              Results
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Next Steps Tracker
  const nextSteps = [
    { id: '1', title: 'Analyzing', description: 'WrectifAI is analyzing your inputs', active: !isDiagnosed },
    { id: '2', title: 'Detecting Issues', description: 'Identifying possible root causes', active: activeStepId === '2' },
    { id: '3', title: 'Matching Garages', description: 'Finding best garages for you', active: activeStepId === '3' },
    { id: '4', title: 'Getting Quotes', description: "We'll notify you once quotes are ready", active: false },
  ];

  if (isDiagnosed) {
    if (isFindingQuotes) {
      return (
        <DashboardShell header={<TopNavbar />}>
          <div ref={pageRootRef} className="pt-1">
            <FindingQuotesScreen
              resultIssues={resultIssues}
              selectedIssues={selectedIssues}
              onBack={() => setIsFindingQuotes(false)}
            />
          </div>
        </DashboardShell>
      );
    }

    return (
      <DashboardShell header={<TopNavbar />}>
        <div ref={pageRootRef} className="pt-1">
          <DiagnoseResultsScreen
            issueText={issueText}
            answerSummaryItems={answerSummaryItems}
            activeCategory={activeCategory}
            resultIssues={resultIssues}
            selectedIssues={selectedIssues}
            detailsText={detailsText}
            onDetailsTextChange={setDetailsText}
            onToggleIssue={toggleSelectedIssue}
            onEditIssue={resetDiagnoseFlow}
            onRequestQuotes={() => router.push(`/finding-quotes?issues=${selectedIssues.join(',')}`)}
          />
        </div>
      </DashboardShell>
    );
  }

  const handleAnalysisComplete = () => {
    setIsAnalyzingResults(false);
    setProgress(100);
    setActiveStepId('3'); // Completed
    setIsDiagnosed(true);
  };

  if (isAnalyzingResults) {
    return (
      <DashboardShell header={<TopNavbar />}>
        <div ref={pageRootRef} className="pt-1">
          <DiagnoseAnalyzingScreen onComplete={handleAnalysisComplete} />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell header={<TopNavbar />}>
      <div ref={pageRootRef} className="space-y-4 pb-6 pt-1">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-[#21419a]">
            WrectifAI Diagnose
          </h1>
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-[12px] border border-[#e3eaf9] bg-white px-4 text-[13px] font-medium text-[#4f68a9] shadow-[0_10px_20px_rgba(35,64,143,0.03)] hover:bg-[#fbfcff]"
          >
            <CirclePlay className="h-4.5 w-4.5 text-[#4472ff]" />
            <span>How it works</span>
          </button>
        </div>

        <StepTracker />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_286px]">
          {/* LEFT CHAT CONTAINER */}
          <div className="min-w-0 flex flex-col h-full lg:h-[1280px]">
            <div className="flex-1 flex flex-col rounded-[18px] border border-[#edf1fa] bg-white p-3 shadow-[0_12px_28px_rgba(35,64,143,0.03)] h-full overflow-hidden">
              <div className="flex-1 flex flex-col rounded-[18px] bg-[radial-gradient(circle_at_top,#f5f7ff_0%,#ffffff_62%)] p-0 overflow-hidden">
                
                {/* Bot Header Card */}
                <div className="shrink-0 rounded-[18px] bg-[linear-gradient(90deg,#dce3ff_0%,#e7e9ff_48%,#e7e4ff_100%)] px-6 pt-4 pb-0 shadow-[0_14px_34px_rgba(39,73,154,0.08)]">
                  <div className="flex items-end gap-4">
                    <Image
                      src="/assets/New_chatbot.png"
                      alt="WrectifAI assistant"
                      width={90}
                      height={90}
                      className="h-[90px] w-[90px] object-contain shrink-0 block -mb-[4px]"
                      priority
                    />
                    <div className="pb-4">
                      <h2 className="text-[14px] font-semibold text-[#2447a2]">
                        {isDiagnosed
                          ? "WrectifAI Diagnostics Complete!"
                          : isAnalyzingResults
                            ? "WrectifAI is analyzing your issue."
                            : "I need a bit more information to diagnose accurately."}
                      </h2>
                      <p className="mt-1 text-[13px] text-[#334c85]">
                        {isDiagnosed
                          ? "Review your results and connect with garages below."
                          : isAnalyzingResults
                            ? "Please wait while we prepare your diagnosis."
                            : "Please answer a few quick questions."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conversational Timeline container (SCROLLABLE FEED) */}
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-3 pt-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-100 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {isAnalyzingResults ? (
                    <DiagnoseAnalyzingScreen />
                  ) : (
                    <>
                      {/* Initial User message */}
                      <div className="mb-7 flex justify-end">
                        <div className="w-full max-w-[250px] rounded-[14px] border border-[#dfe9fb] bg-[#f8fbff] px-4 py-3 shadow-[0_10px_22px_rgba(39,73,154,0.04)]">
                          <div className="mb-1 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-[#3155a8]">You</span>
                            <span className="text-[#a4b1cb]">10:30 AM</span>
                          </div>
                          <p className="text-[13px] leading-6 text-[#35518d]">
                            {issueText}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic messages rendering */}
                      <div className="relative mt-6 pb-3">
                        {/* Vertical Dashed Timeline Line */}
                        <div className="absolute left-[13.5px] top-2 bottom-0 w-0 border-l border-dashed border-[#c7d8ff] z-0" />
                        <div className="space-y-8">
                          {messages.map((entry) => {
                        if (entry.sender === 'user') {
                          return (
                            <div key={entry.id} className="relative flex justify-end animate-in fade-in slide-in-from-right-3 duration-300">
                              {/* Timeline dot for user reply */}
                              <div className="absolute left-0 flex h-7 w-7 items-center justify-center z-20">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#2b61f0] border-2 border-white shadow-[0_2px_6px_rgba(43,97,240,0.2)]" />
                              </div>
                              <div className="w-full max-w-[250px] rounded-[14px] border border-[#dfe9fb] bg-[#f8fbff] px-4 py-3 shadow-[0_10px_22px_rgba(39,73,154,0.04)]">
                                <div className="mb-1 flex items-center justify-between text-[10px]">
                                  <span className="font-semibold text-[#3155a8]">You</span>
                                  <span className="text-[#a4b1cb]">{entry.time}</span>
                                </div>
                                <p className="text-[13px] leading-6 text-[#35518d]">{entry.text}</p>
                              </div>
                            </div>
                          );
                        }

                        if (entry.kind === 'message') {
                          const isFirstMessage = entry.id === 'message-1';
                          return (
                            <div key={entry.id} className="relative flex gap-4 animate-in fade-in duration-400">
                              {/* Chevron pointing down above the bot avatar if it's NOT the first message */}
                              {!isFirstMessage && (
                                <div className="absolute left-0 -top-6 flex h-4 w-7 items-center justify-center text-[#9db5ff] z-20">
                                  <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                                </div>
                              )}
                              <div className="relative z-10 mt-[2px]">
                                <AssistantPill />
                              </div>
                              <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2 text-[10px]">
                                  <span className="font-semibold text-[#3a60ba]">WrectifAI</span>
                                  <span className="text-[#a4b1cb]">{entry.time}</span>
                                </div>
                                <div
                                  className={cn(
                                    'inline-flex rounded-[12px] border px-4 py-3 shadow-[0_8px_20px_rgba(39,73,154,0.04)]',
                                    entry.highlighted
                                      ? 'border-[#ebf0fb] bg-white'
                                      : 'border-[#e7ecf8] bg-[#fafdff]'
                                  )}
                                >
                                  <p className="whitespace-pre-line text-[13px] leading-6 text-[#31508f]">
                                    {entry.text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Question card rendering
                        const hasSelected = !!entry.selected;
                        const isQuestion1 = entry.id === 'question-1';
                        return (
                          <div key={entry.id} className="relative flex gap-4 animate-in fade-in duration-400">
                            {/* Chevron pointing down above the bot avatar/pill container if it's NOT question-1 */}
                            {!isQuestion1 && (
                              <div className="absolute left-0 -top-6 flex h-4 w-7 items-center justify-center text-[#9db5ff] z-20">
                                <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                              </div>
                            )}
                            <div className="relative z-10 mt-[2px]">
                              {isQuestion1 ? (
                                <div className="flex h-7 w-7 items-center justify-center bg-white rounded-full z-20">
                                  <div className="h-2.5 w-2.5 rounded-full bg-[#2b61f0] border-2 border-white shadow-[0_2px_6px_rgba(43,97,240,0.2)]" />
                                </div>
                              ) : (
                                <AssistantPill />
                              )}
                            </div>
                            <div className="min-w-0 w-full">
                              <div className="mb-2 flex items-center gap-2 text-[10px]">
                                <span className="font-semibold text-[#3a60ba]">WrectifAI</span>
                                <span className="text-[#a4b1cb]">{entry.time}</span>
                              </div>
                              
                              <div className="w-full max-w-[290px] rounded-[14px] border border-[#ebf0fb] bg-white p-4 shadow-[0_12px_24px_rgba(35,64,143,0.05)]">
                                <h3 className="text-[13px] font-semibold leading-5 text-[#1d3f96]">{entry.question}</h3>
                                <div className="mt-3 space-y-2">
                                  {entry.options.map((option) => {
                                    const isSelected = option === entry.selected;
                                    return (
                                      <button
                                        key={option}
                                        type="button"
                                        disabled={hasSelected}
                                        onClick={() => handleSelectOption(entry.id, option)}
                                        className={cn(
                                          'flex w-full h-[42px] items-center justify-between rounded-[9px] border px-3.5 text-[13px] font-medium transition-all text-left',
                                          isSelected
                                            ? 'border-[#4d81ff] bg-[#fbfdff] text-[#2a5eea] shadow-[inset_0_0_0_1px_rgba(77,129,255,0.14)] font-bold'
                                            : hasSelected
                                              ? 'border-[#f2f4f8] bg-[#fafbfc] text-[#b0c0df] cursor-not-allowed'
                                              : 'border-[#e8edf8] bg-white text-[#52658f] hover:border-[#b9ccf9] hover:bg-[#f6f9ff]'
                                        )}
                                      >
                                        <span>{option}</span>
                                        {isSelected ? (
                                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2c62f0] text-white">
                                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                                          </span>
                                        ) : null}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                          })}

                          {/* Typing indicator bubble */}
                          {isTyping && (
                            <div className="relative flex gap-4 animate-pulse duration-700">
                              <div className="relative z-10 mt-[2px]">
                                <AssistantPill />
                              </div>
                              <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2 text-[10px]">
                                  <span className="font-semibold text-[#3a60ba]">WrectifAI</span>
                                </div>
                                <div className="inline-flex rounded-[12px] border border-[#e7ecf8] bg-[#fafdff] px-4 py-3 shadow-[0_8px_20px_rgba(39,73,154,0.04)]">
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-[13px] text-[#31508f] font-medium whitespace-pre-line leading-relaxed">{typingText}</span>
                                    <span className="flex items-center gap-1 shrink-0">
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#3a60ba] animate-bounce [animation-delay:-0.3s]" />
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#3a60ba] animate-bounce [animation-delay:-0.15s]" />
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#3a60ba] animate-bounce" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Dynamic Booking / Matching CTA Buttons */}
                          {isDiagnosed && (
                            <div className="mt-8 flex flex-wrap gap-4 pl-11 animate-in fade-in slide-in-from-bottom-4 duration-700">
                              <button
                                type="button"
                                className="flex h-[42px] items-center gap-2 rounded-[11px] bg-[#1a56db] px-5 text-[13.5px] font-bold text-white shadow-[0_8px_22px_rgba(26,86,219,0.3)] hover:bg-[#1546b8] transition-all hover:scale-[1.02] active:scale-[0.98]"
                              >
                                <span>View Matching Garages</span>
                                <ArrowRight className="h-4.5 w-4.5" />
                              </button>
                              <button
                                type="button"
                                className="flex h-[42px] items-center gap-2 rounded-[11px] border border-[#dbe6ff] bg-white px-5 text-[13.5px] font-bold text-[#1a56db] hover:bg-[#f8fbff] transition-all shadow-[0_4px_12px_rgba(26,86,219,0.02)] active:scale-[0.98]"
                              >
                                <span>Get Free Quotes</span>
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Chat Input section */}
              <div className="shrink-0 mt-3 rounded-[16px] border border-[#edf1fa] bg-white p-3.5 shadow-[0_8px_20px_rgba(35,64,143,0.03)]">
                <div className="text-[10px] font-medium text-[#8f9cbc]">Add more details (optional)</div>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-medium text-[#7284ab]">
                  <button type="button" className="flex items-center gap-1.5 hover:text-[#1a56db] transition-colors">
                    <ImageIcon className="h-3.5 w-3.5 text-[#6a8cff]" />
                    <span>Upload Photo</span>
                  </button>
                  <button type="button" className="flex items-center gap-1.5 hover:text-[#1a56db] transition-colors">
                    <Video className="h-3.5 w-3.5 text-[#6a8cff]" />
                    <span>Upload Video</span>
                  </button>
                  <button type="button" className="flex items-center gap-1.5 hover:text-[#1a56db] transition-colors">
                    <Mic className="h-3.5 w-3.5 text-[#6a8cff]" />
                    <span>Record Sound</span>
                  </button>
                </div>
                
                <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-[#e4eafb] bg-[#fbfcff] px-4 py-1.5">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type additional details or ask a question..."
                    disabled={isAnalyzingResults}
                    className="w-full bg-transparent py-2 text-[13px] text-[#31508f] placeholder-[#a7b2ca] outline-none border-none focus:ring-0 shadow-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={isAnalyzingResults}
                    className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a56db]/5 text-[#1a56db] hover:bg-[#1a56db] hover:text-white transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#98a5c1]">
                  <Lock className="h-3 w-3" />
                  <span>Your information is 100% secure and private</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <div className="space-y-6">
            {/* Progress Panel */}
            <Card className="rounded-[18px] border-[#e8edf8] bg-white p-5 shadow-[0_12px_28px_rgba(35,64,143,0.04)]">
              <h2 className="text-[13px] font-semibold text-[#21419a]">Diagnosis in Progress</h2>
              <div className="mt-5 flex items-center gap-4">
                <ProgressRing progress={progress} />
                <div>
                  <h3 className="text-[14px] font-semibold text-[#2b4ea8]">
                    {progress === 100 ? "Analysis Complete!" : activeStepId === '2' ? "Identifying Issues" : "Analyzing your inputs"}
                  </h3>
                  <p className="mt-1 text-[13px] leading-5 text-[#4c6090]">
                    {progress === 100 ? "Review the suggestions below." : "Please answer the questions..."}
                  </p>
                </div>
              </div>
            </Card>

            {/* Summary Panel */}
            <Card className="rounded-[18px] border-[#e8edf8] bg-white p-5 shadow-[0_12px_28px_rgba(35,64,143,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-[#21419a]">Your Issue Summary</h2>
                <button
                  type="button"
                  onClick={() => {
                    resetDiagnoseFlow();
                    return;
                    // Reset back to initial state
                    setMessages([
                      {
                        id: 'message-1',
                        sender: 'assistant',
                        time: '10:30 AM',
                        kind: 'message',
                        text: "Thanks! Let's narrow this down ✨",
                        highlighted: true,
                      },
                      {
                        id: 'question-1',
                        sender: 'assistant',
                        time: '10:30 AM',
                        kind: 'question',
                        question: 'When do you feel the vibration?',
                        options: ['Only while braking', 'While accelerating', 'At constant speed', 'Always'],
                        selected: '',
                      },
                    ]);
                    setAnswers({ occursAt: '-', wheelShakes: '-', started: '-' });
                    setProgress(60);
                    setActiveStepId('2');
                    setIsDiagnosed(false);
                    setIsAnalyzingResults(false);
                  }}
                  className="flex items-center gap-1 text-[12px] font-medium text-[#3b6bff] hover:text-[#184aff] transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="mt-4 rounded-[14px] border border-[#edf1fa] bg-white px-4 py-4">
                <div>
                  <div className="text-[12px] font-semibold text-[#2747a0]">Original Issue</div>
                  <p className="mt-3 max-w-[235px] text-[13px] leading-6 text-[#273f75]">
                    {issueText}
                  </p>
                </div>

                <div className="mt-5 space-y-4 border-t border-[#eef2fb] pt-4">
                  {answerSummaryItems.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-[#273f75]">
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#cfe0ff] text-[#3566f0]">
                          <Icon className="h-2.5 w-2.5" />
                        </span>
                        <span>{label}</span>
                      </div>
                      <span className="max-w-[112px] text-right text-[12px] font-semibold leading-5 text-[#1b316e] break-words">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[14px] border border-[#ddf3e3] bg-[#f3fff6] px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#1e9b57] shadow-[0_4px_10px_rgba(30,155,87,0.1)]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <p className="text-[12px] leading-5 text-[#4b8a61]">
                    Accurate answers help us improve accuracy and match you with the right garages.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Features banner */}
        <div className="grid gap-4 rounded-[18px] border border-[#edf1fa] bg-white p-4 shadow-[0_12px_28px_rgba(35,64,143,0.03)] md:grid-cols-2 xl:grid-cols-4">
          {footerFeatures.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f7ff] text-[#5d7df4]">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="text-[12px] font-semibold text-[#35508e]">{title}</h3>
                <p className="mt-1 text-[10px] leading-4 text-[#5a709b]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

export default AIDiagnosePage;
