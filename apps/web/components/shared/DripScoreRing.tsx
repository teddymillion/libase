"use client";
import { cn } from "@/lib/utils";

interface DripScoreProps {
  score: number;
  label: string;
  emoji: string;
  color: string;
}

export function DripScoreRing({ score, label, emoji, color }: DripScoreProps) {
  const radius      = 40;
  const stroke      = 6;
  const normalised  = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const offset      = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
          {/* Track */}
          <circle cx="45" cy="45" r={normalised} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
          {/* Progress */}
          <circle
            cx="45" cy="45" r={normalised}
            fill="none"
            stroke="#F97316"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-neutral-900">{score}</span>
          <span className="text-xs text-neutral-400 font-medium">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn("font-bold text-sm", color)}>{emoji} {label}</p>
        <p className="text-xs text-neutral-400">Drip Score</p>
      </div>
    </div>
  );
}
