import React from 'react';
import { Trophy, Shuffle, BookOpen, Star, CheckCircle, XCircle, Award } from 'lucide-react';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  categoryName: string;
  onRestart: () => void;
  onChangeCategory: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({
  score,
  totalQuestions,
  categoryName,
  onRestart,
  onChangeCategory,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  let message = 'நன்றாக முயற்சி செய்தீர்கள்!';
  let stars = 1;
  if (percentage >= 80) {
    message = 'அருமை! சிறந்த தேர்ச்சி! 🌟';
    stars = 3;
  } else if (percentage >= 50) {
    message = 'நல்ல முயற்சி! வாழ்த்துகள்! 👏';
    stars = 2;
  }

  return (
    <div
      id="quiz-end-screen"
      className="w-full max-w-xl mx-auto bg-[#1A1A1A] border border-[#333333] p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300"
    >
      {/* Trophy Badge */}
      <div className="relative inline-block">
        <div className="w-20 h-20 bg-[#0F0F0F] border border-[#FF9933]/50 p-1 mx-auto shadow-xl shadow-black flex items-center justify-center">
          <Trophy className="w-10 h-10 text-[#FF9933]" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-1">
        <span className="text-[#FF9933] text-xs font-bold tracking-[0.3em] uppercase font-mono">
          Quiz Completed • வினாடி வினா முடிவு
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#E5E5E5] font-serif pt-1">
          வாழ்த்துகள்! (Congratulations)
        </h2>
        <p className="text-[#A0A0A0] text-sm font-serif">{message}</p>
        <p className="text-xs text-[#666666] font-mono mt-1">{categoryName}</p>
      </div>

      {/* Stars Display */}
      <div className="flex justify-center items-center gap-2">
        {[1, 2, 3].map((starIndex) => (
          <Star
            key={starIndex}
            className={`w-6 h-6 ${
              starIndex <= stars
                ? 'text-[#FF9933] fill-[#FF9933] drop-shadow-md'
                : 'text-[#333333]'
            }`}
          />
        ))}
      </div>

      {/* Detailed Score Card (HUD Monospace Matrix) */}
      <div className="grid grid-cols-3 gap-3 p-5 bg-[#0F0F0F] border border-[#333333]">
        <div className="space-y-1">
          <div className="flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs font-semibold font-mono">சரி (CORRECT)</span>
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">{score}</div>
        </div>

        <div className="space-y-1 border-x border-[#262626]">
          <div className="flex items-center justify-center text-rose-400">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs font-semibold font-mono">தவறு (WRONG)</span>
          </div>
          <div className="text-2xl font-bold text-rose-300 font-mono">{totalQuestions - score}</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center text-[#FF9933]">
            <Award className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs font-semibold font-mono">சதவீதம் (SCORE)</span>
          </div>
          <div className="text-2xl font-bold text-[#FF9933] font-mono">{percentage}%</div>
        </div>
      </div>

      {/* Motivational Tamil Quote */}
      <div className="p-4 bg-[#0F0F0F] border border-[#262626] border-l-2 border-l-[#FF9933] text-xs text-[#CCCCCC] font-serif italic text-left">
        "கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் தக" — திருவள்ளுவர்
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          id="restart-quiz-btn"
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#FF9933] hover:bg-[#FFAA4D] text-black font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-[#FF9933]/20"
        >
          <Shuffle className="w-4 h-4" />
          <span>மீண்டும் விளையாடு (Play Again - Shuffled)</span>
        </button>

        <button
          id="change-category-end-btn"
          onClick={onChangeCategory}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#1A1A1A] hover:bg-[#262626] text-[#E5E5E5] font-semibold text-xs uppercase tracking-wider border border-[#333333] hover:border-[#FF9933]/50 transition active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-[#FF9933]" />
          <span>பகுதியை மாற்று (Change Topic)</span>
        </button>
      </div>
    </div>
  );
};
