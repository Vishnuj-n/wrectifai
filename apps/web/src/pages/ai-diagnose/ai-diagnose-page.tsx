'use client';

import Image from 'next/image';
import Link from 'next/link';
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
} from 'lucide-react';
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

export function AIDiagnosePage() {
  const [messages, setMessages] = useState<ChatEntry[]>([
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

  const [answers, setAnswers] = useState({
    occursAt: '-',
    wheelShakes: '-',
    started: '-',
  });

  const [progress, setProgress] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('WrectifAI is thinking...');
  const [activeStepId, setActiveStepId] = useState('2'); // '1' = Describe, '2' = Analyzing, '3' = Completed
  const [isDiagnosed, setIsDiagnosed] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  
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

  const handleSelectOption = (questionId: string, option: string) => {
    // Prevent re-selecting options once chosen
    const question = messages.find(m => m.id === questionId);
    if (question && question.kind === 'question' && question.selected) return;

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
      setIsTyping(true);
      setTypingText('Analyzing your answers...\nThis will just take a few seconds');
      setActiveStepId('2'); // AI Analysis Step

      setTimeout(() => {
        setIsTyping(false);
        setProgress(100);
        setActiveStepId('3'); // Results/Completed Step
        setIsDiagnosed(true);
        setMessages((prev) => [
          ...prev,
          {
            id: 'message-diag-complete',
            sender: 'assistant',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kind: 'message',
            text: `Diagnostic Complete! 🛠️

Based on WrectifAI's evaluation of your inputs against 2M+ real-world automotive cases, we detected:

1. ⚠️ **Wheel Unbalance** (88% match)
   *Potential cause:* Uneven tyre wear or loss of wheel weights.
   *Urgency:* Medium - requires wheel alignment & balancing service.

2. ⚠️ **Worn Brake Rotors** (42% match)
   *Potential cause:* Distorted brake disc surface.
   *Urgency:* Low to Medium - inspect brake pads & discs.

You can now connect with our verified service partners to resolve this.`,
          },
        ]);
      }, 2500);
    }
  };

  const handleSendMessage = () => {
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
              AI Analysis
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
    { id: '1', title: 'Analyzing', description: 'AI is analyzing your inputs', active: !isDiagnosed },
    { id: '2', title: 'Detecting Issues', description: 'Identifying possible root causes', active: activeStepId === '2' },
    { id: '3', title: 'Matching Garages', description: 'Finding best garages for you', active: activeStepId === '3' },
    { id: '4', title: 'Getting Quotes', description: "We'll notify you once quotes are ready", active: false },
  ];

  return (
    <DashboardShell header={<TopNavbar />}>
      <div ref={pageRootRef} className="space-y-4 pb-6 pt-1">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-[#21419a]">
            AI Diagnose
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
                        {isDiagnosed ? "AI Diagnostics Complete!" : "I need a bit more information to diagnose accurately."}
                      </h2>
                      <p className="mt-1 text-[13px] text-[#334c85]">
                        {isDiagnosed ? "Review your results and connect with garages below." : "Please answer a few quick questions."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conversational Timeline container (SCROLLABLE FEED) */}
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-3 pt-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-100 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {/* Initial User message */}
                  <div className="mb-7 flex justify-end">
                    <div className="w-full max-w-[250px] rounded-[14px] border border-[#dfe9fb] bg-[#f8fbff] px-4 py-3 shadow-[0_10px_22px_rgba(39,73,154,0.04)]">
                      <div className="mb-1 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-[#3155a8]">You</span>
                        <span className="text-[#a4b1cb]">10:30 AM</span>
                      </div>
                      <p className="text-[13px] leading-6 text-[#35518d]">
                        Car is shaking at 70-80 kmph and I can feel vibration in the steering wheel.
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
                    className="w-full bg-transparent py-2 text-[13px] text-[#31508f] placeholder-[#a7b2ca] outline-none border-none focus:ring-0 shadow-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
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
                    Car is shaking at 70-80 kmph and I can feel vibration in the steering wheel.
                  </p>
                </div>

                <div className="mt-5 space-y-4 border-t border-[#eef2fb] pt-4">
                  {[
                    { label: 'Occurs at', value: answers.occursAt, icon: Gauge },
                    { label: 'Steering wheel shakes', value: answers.wheelShakes, icon: CheckCircle2 },
                    { label: 'Started', value: answers.started, icon: Clock3 },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-[12px] text-[#273f75]">
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

            {/* Next steps Panel */}
            <Card className="rounded-[18px] border-[#e8edf8] bg-white p-5 shadow-[0_12px_28px_rgba(35,64,143,0.04)]">
              <h2 className="text-[13px] font-semibold text-[#21419a]">What happens next?</h2>
              <div className="mt-5 space-y-6">
                {nextSteps.map((step) => (
                  <div key={step.id} className="flex gap-3">
                    <div
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-300',
                        step.active
                          ? 'border-[#d9e5ff] bg-white text-[#2b61f0] shadow-[0_8px_18px_rgba(43,97,240,0.08)]'
                          : 'border-[#eef1f7] bg-[#f7f9fd] text-[#a2aec8]'
                      )}
                    >
                      {step.active ? <span className="h-2.5 w-2.5 rounded-full bg-[#2b61f0] animate-ping" /> : step.id}
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'text-[13px] font-medium transition-colors',
                          step.active ? 'text-[#2b61f0] font-bold' : 'text-[#516692]'
                        )}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[12px] leading-5 text-[#516692]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trust Panel */}
            <Card className="rounded-[18px] border-[#e8edf8] bg-white p-5 shadow-[0_12px_28px_rgba(35,64,143,0.04)]">
              <h2 className="text-[13px] font-semibold text-[#21419a]">Trusted by 35,000+ Car Owners</h2>
              <p className="mt-2 text-[12px] leading-5 text-[#4c6090]">
                We use advanced AI to provide accurate diagnosis and reliable recommendations.
              </p>
              <div className="mt-5 space-y-4">
                {trustItems.map(({ label, icon: Icon, iconClass }) => (
                  <div key={label} className="flex items-center gap-3 text-[12px] font-medium text-[#2b4278]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon className={cn("h-4.5 w-4.5", iconClass)} />
                    </span>
                    <span>{label}</span>
                  </div>
                ))}
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
