import React from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Pause,
  Play,
  Shuffle,
} from 'lucide-react';
import { QuizQuestion, AudioSettings } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  timeLeft: number;
  totalTimerDuration: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isReadingQuestion: boolean;
  autoAdvanceCount: number | null;
  activeSegment: 'question' | 'option-0' | 'option-1' | 'option-2' | 'option-3' | null;
  isSpeaking: boolean;
  audioSettings: AudioSettings;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestartQuiz?: () => void;
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
  onReplayAudio: () => void;
  onReplayAnswer?: () => void;
  onSpeakSingleOption: (optionText: string, optionIndex: number) => void;
  onToggleMute: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  score,
  streak,
  timeLeft,
  totalTimerDuration,
  selectedOption,
  isAnswered,
  isReadingQuestion,
  autoAdvanceCount,
  activeSegment,
  isSpeaking,
  audioSettings,
  isPaused,
  onTogglePause,
  onRestartQuiz,
  onSelectOption,
  onNextQuestion,
  onReplayAudio,
  onReplayAnswer,
  onSpeakSingleOption,
  onToggleMute,
}) => {
  const timerPercentage = isReadingQuestion
    ? 100
    : Math.max(0, Math.min(100, (timeLeft / totalTimerDuration) * 100));
  const isUrgentTimer = !isReadingQuestion && timeLeft <= 4 && !isAnswered && !isPaused;

  const optionLetterLabels = ['A', 'B', 'C', 'D'];
  const optionTamilLabels = ['அ', 'ஆ', 'இ', 'ஈ'];

  // Formatted counter
  const paddedIndex = String(currentIndex + 1).padStart(2, '0');
  const paddedTotal = String(totalQuestions).padStart(2, '0');
  const paddedTimer = String(timeLeft).padStart(2, '0');

  // Radial calculation for circular HUD timer
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isReadingQuestion
    ? 0
    : circumference - (timerPercentage / 100) * circumference;

  return (
    <div
      id="quiz-card-container"
      className="w-full max-w-4xl mx-auto bg-[#0F0F0F] text-[#E5E5E5] flex flex-col relative"
    >
      {/* Top Progress Bar */}
      <div className="w-full h-1.5 bg-[#1A1A1A] mb-8 overflow-hidden rounded-full">
        <div
          id="quiz-timer-bar"
          className={`h-full transition-all duration-300 ease-out ${
            isUrgentTimer
              ? 'bg-rose-500 shadow-md shadow-rose-500/50'
              : isPaused
              ? 'bg-amber-400'
              : 'bg-[#FF9933]'
          }`}
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Header & Series Counter */}
      <div className="flex justify-between items-start mb-8 sm:mb-10 pb-6 border-b border-[#262626]">
        <div className="flex flex-col">
          <span className="text-[#FF9933] text-[11px] font-bold tracking-[0.3em] uppercase mb-1.5">
            கேள்வி வரிசை / Question Series
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#E5E5E5] font-mono">
            {paddedIndex} <span className="text-lg sm:text-xl text-[#666666]">/ {paddedTotal}</span>
          </h2>
        </div>

        {/* Right Info: Streak & Score Pill */}
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div
              id="quiz-streak-badge"
              className="flex items-center gap-1 text-xs font-bold text-[#FF9933] bg-[#FF9933]/10 border border-[#FF9933]/30 px-3 py-1.5 rounded-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-[#FF9933]" />
              <span className="font-mono">{streak} Streak</span>
            </div>
          )}

          <div
            id="quiz-score-display"
            className="flex items-center gap-1.5 text-xs font-bold text-[#E5E5E5] bg-[#1A1A1A] border border-[#333333] px-3.5 py-1.5 rounded-sm"
          >
            <span className="text-[#888888] font-sans">மதிப்பெண்:</span>
            <span className="text-sm font-bold text-[#FF9933] font-mono">{score}</span>
          </div>
        </div>
      </div>

      {/* Current Question Section */}
      <div className="max-w-3xl mb-8 sm:mb-10">
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[#FF9933] text-xs uppercase tracking-[0.25em] font-bold">
              Current Question • {question.cat}
            </p>

            {/* Live State Badge */}
            {isPaused ? (
              <span className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/40 px-2.5 py-0.5 rounded-sm font-mono">
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>இடைநிறுத்தப்பட்டுள்ளது (Paused)</span>
              </span>
            ) : isReadingQuestion ? (
              <span className="flex items-center gap-1.5 text-[11px] text-[#FF9933] bg-[#FF9933]/10 border border-[#FF9933]/40 px-2.5 py-0.5 rounded-sm animate-pulse font-mono">
                <Volume2 className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>கேள்வி வாசிக்கப்படுகிறது... (நேரக்கணிப்பு நிறுத்தம்)</span>
              </span>
            ) : !isAnswered ? (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-sm font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>15 வினாடிகள் சிந்தனை நேரம் (15s Timer)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-sm font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>விடை காட்டப்பட்டது (Answer Displayed)</span>
              </span>
            )}
          </div>

          {/* Quick Audio & Navigation Controls for Question */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Pause / Resume Button */}
            <button
              id="quiz-pause-toggle-btn"
              onClick={onTogglePause}
              className={`p-2 rounded-sm border transition active:scale-95 flex items-center gap-1.5 text-xs ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm'
                  : 'bg-[#1A1A1A] text-[#E5E5E5] border-[#333333] hover:border-[#FF9933] hover:text-[#FF9933]'
              }`}
              title={isPaused ? 'விளையாட்டைத் தொடரவும் (Resume - [P])' : 'விளையாட்டை இடைநிறுத்தவும் (Pause - [P])'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="hidden sm:inline font-mono text-[10px]">RESUME</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span className="hidden sm:inline font-mono text-[10px]">PAUSE</span>
                </>
              )}
            </button>

            <button
              id="replay-question-audio-btn"
              onClick={onReplayAudio}
              disabled={isPaused}
              className={`p-2 rounded-sm border transition active:scale-95 flex items-center gap-1.5 text-xs disabled:opacity-40 ${
                isSpeaking
                  ? 'bg-[#FF9933] text-black border-[#FF9933] shadow-md shadow-[#FF9933]/20'
                  : 'bg-[#1A1A1A] text-[#E5E5E5] border-[#333333] hover:border-[#FF9933] hover:text-[#FF9933]'
              }`}
              title="மீண்டும் கேட்கவும் (Replay Audio - [SPACE])"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline font-mono text-[10px]">REPLAY</span>
            </button>

            {onRestartQuiz && (
              <button
                id="quiz-shuffle-restart-btn"
                onClick={onRestartQuiz}
                className="p-2 rounded-sm bg-[#1A1A1A] hover:bg-[#262626] text-[#888888] hover:text-[#FF9933] border border-[#333333] hover:border-[#FF9933]/50 transition active:scale-95 flex items-center gap-1.5 text-xs"
                title="கேள்விகளைக் கலக்கி மீண்டும் தொடங்க (Shuffle & Restart - [R])"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-mono text-[10px]">SHUFFLE</span>
              </button>
            )}

            <button
              id="toggle-mute-btn"
              onClick={onToggleMute}
              className="p-2 rounded-sm bg-[#1A1A1A] text-[#888888] hover:text-[#E5E5E5] border border-[#333333] transition active:scale-95"
              title={audioSettings.enabled ? 'ஒலியை முடக்கு (Mute)' : 'ஒலியை இயக்கு (Unmute)'}
            >
              {audioSettings.enabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#FF9933]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#666666]" />
              )}
            </button>

            {/* Manual Next Question Button */}
            <button
              id="manual-header-next-btn"
              onClick={onNextQuestion}
              className="px-3 py-1.5 rounded-sm bg-[#1A1A1A] hover:bg-[#FF9933] text-[#E5E5E5] hover:text-black border border-[#333333] hover:border-[#FF9933] transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold font-mono group shadow-sm"
              title="அடுத்த கேள்விக்குச் செல்லவும் (Next Question - Shortcut: [N] or [➔])"
            >
              <span>{isAnswered ? 'அடுத்த கேள்வி' : 'அடுத்தது'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden md:inline-block text-[9px] px-1 py-0.5 bg-black/40 rounded text-[#FF9933] group-hover:text-black font-mono">
                [N]
              </span>
            </button>
          </div>
        </div>

        <h1
          id="quiz-question-text"
          className={`text-2xl sm:text-3xl lg:text-4xl font-serif font-medium leading-relaxed tracking-wide text-[#E5E5E5] transition-colors duration-300 ${
            activeSegment === 'question' ? 'text-[#FFB366]' : ''
          }`}
        >
          {question.q}
        </h1>
      </div>

      {/* Paused Banner Overlay */}
      {isPaused && (
        <div
          id="quiz-paused-card"
          className="mb-8 p-6 bg-[#141414] border border-amber-500/40 rounded-sm text-center space-y-4 animate-in fade-in duration-200"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Pause className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif text-[#E5E5E5]">
              விளையாட்டு இடைநிறுத்தப்பட்டது (Quiz Paused)
            </h3>
            <p className="text-xs text-[#AAAAAA] font-sans">
              தொடர கீழே உள்ள பொத்தானை அழுத்தவும் (கேள்வி மற்றும் விடைகள் மீண்டும் வாசிக்கப்படும்).
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-1">
            <button
              id="resume-quiz-inline-btn"
              onClick={onTogglePause}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9933] hover:bg-[#FFAA4D] text-black font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-[#FF9933]/20"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>தொடரவும் - கேள்வியை வாசி (Resume & Read Question)</span>
            </button>
          </div>
        </div>
      )}

      {/* Options Grid (Artistic Flair 2-column Layout) */}
      <div id="quiz-options-list" className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
        {question.options.map((option, idx) => {
          const isOptionBeingRead = activeSegment === `option-${idx}`;
          const isSelected = selectedOption === idx;
          const isCorrect = isAnswered && idx === question.answer;
          const isWrongSelection = isAnswered && isSelected && idx !== question.answer;

          let cardBorderBg =
            'bg-[#1A1A1A] border-[#333333] hover:border-[#FF9933]/70 hover:bg-[#222222] text-[#E5E5E5]';

          if (isOptionBeingRead) {
            cardBorderBg =
              'bg-[#FF9933]/15 border-[#FF9933] ring-1 ring-[#FF9933] text-[#FFE6CC] shadow-lg shadow-[#FF9933]/10';
          }
          if (isCorrect) {
            cardBorderBg =
              'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/60 text-emerald-200';
          } else if (isWrongSelection) {
            cardBorderBg =
              'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/60 text-rose-200';
          } else if (isAnswered) {
            cardBorderBg = 'bg-[#141414] border-[#262626] text-[#666666] opacity-60';
          }

          return (
            <div
              key={idx}
              id={`quiz-option-btn-${idx}`}
              onClick={() => !isAnswered && !isPaused && onSelectOption(idx)}
              className={`group relative border p-4 sm:p-5 flex items-center justify-between transition-all duration-200 ${cardBorderBg} ${
                !isAnswered && !isPaused ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <div className="flex flex-col flex-1 pr-3 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#FF9933] font-bold font-mono">
                    {optionLetterLabels[idx]}
                  </span>
                  <span className="text-[11px] text-[#888888] font-serif">
                    ({optionTamilLabels[idx]})
                  </span>
                </div>
                <span className="text-base sm:text-lg font-medium leading-normal tracking-wide text-[#E5E5E5] font-sans truncate">
                  {option}
                </span>
              </div>

              {/* Status Indicator & Single Option Audio Listen Button */}
              <div className="flex items-center gap-2 shrink-0">
                {isOptionBeingRead && (
                  <div className="w-6 h-6 rounded-full bg-[#FF9933] text-black flex items-center justify-center animate-pulse shadow-md">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                )}
                {isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                {isWrongSelection && (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                {!isAnswered && !isOptionBeingRead && (
                  <button
                    id={`listen-option-${idx}-btn`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPaused) onSpeakSingleOption(option, idx);
                    }}
                    className="p-1.5 rounded-sm bg-[#262626] hover:bg-[#FF9933] hover:text-black text-[#888888] transition opacity-0 group-hover:opacity-100 hidden sm:block"
                    title="இந்த விடையை மட்டும் கேட்க (Listen this option)"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Answer Explanation & Next Action Box with Auto-Advance */}
      {isAnswered && (
        <div
          id="quiz-explanation-container"
          className="mb-8 p-5 bg-[#1A1A1A] border border-[#333333] border-l-4 border-l-[#FF9933] space-y-4 animate-in fade-in duration-300"
        >
          {/* Answer Verdict & Audio Read Indicator */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#262626] flex-wrap">
            <div className="flex items-center gap-2">
              {selectedOption === question.answer ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold rounded-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>மிகச் சரி! (Correct Answer)</span>
                </span>
              ) : selectedOption === null ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold rounded-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>நேரம் முடிந்தது (Time Expired)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold rounded-sm">
                  <XCircle className="w-4 h-4" />
                  <span>தவறான விடை (Incorrect)</span>
                </span>
              )}

              {isSpeaking && (
                <span className="inline-flex items-center gap-1.5 text-xs text-[#FF9933] font-mono animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>குரல் வாசிக்கிறது...</span>
                </span>
              )}
            </div>

            {onReplayAnswer && (
              <button
                id="replay-answer-voice-btn"
                onClick={onReplayAnswer}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#262626] hover:bg-[#FF9933] hover:text-black text-[#CCCCCC] text-xs font-mono rounded-sm transition active:scale-95"
                title="சரியான விடையை மீண்டும் தமிழில் கேட்க (Listen answer again)"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>விடையைக் கேள் (Hear Answer)</span>
              </button>
            )}
          </div>

          {/* Correct Answer Highlight */}
          <div className="p-3 bg-black/40 border border-[#262626] rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#888888] font-mono">
              சரியான விடை (Correct Answer):
            </span>
            <p className="text-base text-[#FF9933] font-bold font-serif">
              {optionTamilLabels[question.answer]}. {question.options[question.answer]}
            </p>
          </div>

          {/* Detailed Explanation (Displayed on screen) */}
          {question.explanation && (
            <div className="flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#CCCCCC] uppercase tracking-wider font-mono">
                  விளக்கம் (Explanation):
                </span>
                <p className="text-sm text-[#AAAAAA] leading-relaxed font-serif">
                  {question.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Auto-advance banner / Manual next status & instant Next Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#262626]">
            <div className="flex items-center gap-2 text-xs text-[#AAAAAA] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933] animate-pulse" />
              {audioSettings.autoAdvance && autoAdvanceCount !== null ? (
                <span>
                  அடுத்த கேள்விக்கு செல்கிறது:{' '}
                  <strong className="text-[#FF9933] font-bold text-sm">
                    {autoAdvanceCount}s
                  </strong>
                </span>
              ) : (
                <span className="text-[#888888]">
                  அடுத்த கேள்விக்கு கீழே கிளிக் செய்யவும் அல்லது <kbd className="px-1 py-0.5 bg-[#262626] text-[#FF9933] text-[10px] rounded">[Enter] / [N]</kbd> அழுத்தவும்
                </span>
              )}
            </div>

            <button
              id="quiz-next-question-btn"
              onClick={onNextQuestion}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FF9933] hover:bg-[#FFAA4D] text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition active:scale-95 shadow-lg shadow-[#FF9933]/20"
            >
              <span>அடுத்த கேள்வி (Next Question)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Artistic Flair Footer HUD with HUD Radial Timer & Controls */}
      <footer className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto border-t border-[#262626] pt-6 pb-2">
        {/* Left: Engine & Dialect Metadata */}
        <div className="flex gap-8 order-2 sm:order-1">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter text-[#666666] font-mono">
              Voice Engine
            </span>
            <span className="text-xs text-[#CCCCCC] font-mono">
              {audioSettings.voiceMode === 'natural-ai'
                ? `AI Studio (${audioSettings.geminiVoice})`
                : 'Browser ta-IN'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter text-[#666666] font-mono">
              Topic
            </span>
            <span className="text-xs text-[#CCCCCC] font-serif truncate max-w-[140px]">
              {question.cat}
            </span>
          </div>
        </div>

        {/* Center: Radial HUD Countdown Timer / Voice Status */}
        <div className="relative flex items-center justify-center order-1 sm:order-2">
          <svg className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#262626"
              strokeWidth="3"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={
                isPaused
                  ? '#F59E0B'
                  : isReadingQuestion
                  ? '#FF9933'
                  : isUrgentTimer
                  ? '#F43F5E'
                  : isAnswered
                  ? '#10B981'
                  : '#FF9933'
              }
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={
                isReadingQuestion
                  ? 'animate-pulse transition-all duration-300'
                  : 'transition-all duration-1000 ease-linear'
              }
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            {isPaused ? (
              <>
                <Pause className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  PAUSED
                </span>
              </>
            ) : isReadingQuestion ? (
              <>
                <Volume2 className="w-4 h-4 text-[#FF9933] animate-bounce mb-0.5" />
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#FF9933]">
                  AUDIO
                </span>
              </>
            ) : isAnswered ? (
              <>
                <span className="text-xl font-mono font-bold leading-none text-emerald-400">
                  {autoAdvanceCount !== null ? `0${autoAdvanceCount}` : '✓'}
                </span>
                <span className="text-[7px] uppercase tracking-widest text-[#888888] font-mono mt-0.5">
                  NEXT
                </span>
              </>
            ) : (
              <>
                <span
                  id="quiz-timer-display"
                  className={`text-2xl font-mono font-bold leading-none ${
                    isUrgentTimer ? 'text-rose-400 animate-pulse' : 'text-[#FF9933]'
                  }`}
                >
                  {paddedTimer}
                </span>
                <span className="text-[7px] uppercase tracking-widest text-[#888888] font-mono mt-0.5">
                  SEC
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Shortcut cues */}
        <div className="flex flex-col items-center sm:items-end order-3 gap-0.5">
          <div className="flex items-center gap-1.5 text-xs text-[#888888] font-mono flex-wrap justify-center sm:justify-end">
            <span><kbd className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#333333] text-[#FF9933] text-[10px] rounded-sm">[P]</kbd> Pause</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#333333] text-[#FF9933] text-[10px] rounded-sm">[SPACE]</kbd> Replay</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#333333] text-[#FF9933] text-[10px] rounded-sm">[N]</kbd> Next</span>
          </div>
          <span className="text-[10px] text-[#666666] uppercase font-mono">
            {isPaused
              ? 'Quiz Paused'
              : isReadingQuestion
              ? 'Voice Narration Active'
              : isAnswered
              ? audioSettings.autoAdvance
                ? 'Auto Advancing (or press N)...'
                : 'Manual Mode - Click Next'
              : '15s Timer Active'}
          </span>
        </div>
      </footer>
    </div>
  );
};
