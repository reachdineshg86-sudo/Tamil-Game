import React from 'react';
import { BookOpen, Feather, Trees, HeartHandshake, GraduationCap, Check } from 'lucide-react';
import { CATEGORIES } from '../data/questions';
import { QuizCategory } from '../types';

interface CategoryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryId: number;
  onSelectCategory: (category: QuizCategory) => void;
}

export const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  isOpen,
  onClose,
  selectedCategoryId,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Feather':
        return <Feather className="w-5 h-5" />;
      case 'Trees':
        return <Trees className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      default:
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <div
      id="category-picker-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="category-picker-modal"
        className="w-full max-w-lg bg-[#1A1A1A] border border-[#333333] p-6 sm:p-7 shadow-2xl text-[#E5E5E5] space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF9933] font-mono">
              CURRICULUM TOPICS
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#E5E5E5] font-serif">
              பாடப்பிரிவைத் தேர்ந்தெடுக்கவும்
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 hover:bg-[#262626] transition"
          >
            ✕
          </button>
        </div>

        {/* Categories List */}
        <div className="grid gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-option-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className={`w-full p-4 border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933]'
                    : 'border-[#262626] bg-[#0F0F0F] text-[#E5E5E5] hover:border-[#333333] hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 border shrink-0 ${
                      isSelected
                        ? 'bg-[#0F0F0F] border-[#FF9933] text-[#FF9933]'
                        : 'bg-[#1A1A1A] border-[#333333] text-[#888888]'
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#E5E5E5] font-serif flex items-center gap-2">
                      {cat.name}
                    </div>
                    <p className="text-xs text-[#888888] mt-0.5 font-sans">{cat.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-mono font-semibold px-2 py-0.5 bg-[#1A1A1A] text-[#FF9933] border border-[#333333]">
                      {cat.questionCount} QUESTIONS ({cat.questionCount} வினாக்கள்)
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 bg-[#FF9933] text-black flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
