import React from 'react';
import { Play, BookOpen, Volume2, Clock, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { QuizCategory } from '../types';

interface StartScreenProps {
  selectedCategory: QuizCategory;
  onStartGame: () => void;
  onOpenCategoryPicker: () => void;
  onOpenSettings: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedCategory,
  onStartGame,
  onOpenCategoryPicker,
  onOpenSettings,
}) => {
  return (
    <div
      id="quiz-start-screen"
      className="w-full max-w-2xl mx-auto bg-[#1A1A1A] border border-[#333333] p-6 sm:p-10 shadow-2xl space-y-7 animate-in fade-in duration-300 relative overflow-hidden"
    >
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-amber-400 to-[#FF9933]" />

      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-[#0F0F0F] border border-[#FF9933]/50 flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-[#FF9933] font-bold text-2xl font-serif">த்</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF9933] font-mono">
              TAMIL SCHOOL QUIZ
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#E5E5E5] font-serif">
              திருவள்ளுவர் தமிழ் பள்ளி
            </h1>
          </div>
        </div>

        <button
          id="start-screen-settings-btn"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F0F0F] hover:bg-[#262626] border border-[#333333] hover:border-[#FF9933]/50 text-xs text-[#CCCCCC] transition active:scale-95 font-mono"
        >
          <Sliders className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>அமைப்புகள்</span>
        </button>
      </div>

      {/* Selected Topic Card */}
      <div className="p-5 bg-[#0F0F0F] border border-[#262626] relative group">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#888888] font-mono">
              தேர்ந்தெடுக்கப்பட்ட பகுதி (Selected Topic):
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#FF9933] font-serif">
              {selectedCategory.name}
            </h2>
            <p className="text-xs text-[#AAAAAA] font-sans pt-0.5">
              {selectedCategory.description}
            </p>
          </div>

          <button
            id="start-screen-change-topic-btn"
            onClick={onOpenCategoryPicker}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] hover:border-[#FF9933]/50 text-xs text-[#E5E5E5] transition active:scale-95 font-serif"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>மாற்று</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#1F1F1F] text-xs font-mono text-[#888888]">
          <span className="px-2 py-0.5 bg-[#1A1A1A] border border-[#333333] text-[#FF9933] font-bold">
            {selectedCategory.questionCount} வினாக்கள் ({selectedCategory.questionCount} Questions)
          </span>
        </div>
      </div>

      {/* Rules / Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#0F0F0F] border border-[#262626] space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold font-mono">15 வினாடிகள்</span>
          </div>
          <p className="text-[11px] text-[#888888] leading-relaxed font-sans">
            ஒவ்வொரு வினாவிற்கும் 15 வினாடிகள் சிந்தனை நேரம்.
          </p>
        </div>

        <div className="p-3.5 bg-[#0F0F0F] border border-[#262626] space-y-1">
          <div className="flex items-center gap-2 text-[#FF9933]">
            <Volume2 className="w-4 h-4" />
            <span className="text-xs font-bold font-mono">குரல் வாசிப்பு</span>
          </div>
          <p className="text-[11px] text-[#888888] leading-relaxed font-sans">
            தூய தமிழ் உச்சரிப்பில் வினா மற்றும் விடைகள் வாசிப்பு.
          </p>
        </div>

        <div className="p-3.5 bg-[#0F0F0F] border border-[#262626] space-y-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold font-mono">உடனடி விடை</span>
          </div>
          <p className="text-[11px] text-[#888888] leading-relaxed font-sans">
            விடை அளித்தவுடன் சரியான விடை அறிவிக்கப்படும்.
          </p>
        </div>
      </div>

      {/* Primary Action Button: Start Game */}
      <div className="space-y-3 pt-2">
        <button
          id="start-game-btn"
          onClick={onStartGame}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#FF9933] hover:bg-[#FFAA4D] text-black font-bold text-base uppercase tracking-wider transition active:scale-98 shadow-xl shadow-[#FF9933]/25 cursor-pointer font-sans"
        >
          <Play className="w-5 h-5 fill-black stroke-black" />
          <span>விளையாட்டைத் தொடங்கு (Start Game)</span>
        </button>

        <div className="flex items-center justify-between text-xs text-[#666666] font-mono px-1">
          <span>விளையாட்டைத் தொடங்க மேலே கிளிக் செய்யவும்</span>
          <span>Shortcut: <kbd className="px-1.5 py-0.5 bg-[#0F0F0F] border border-[#333333] text-[#FF9933] text-[10px] rounded">[Enter]</kbd></span>
        </div>
      </div>
    </div>
  );
};
