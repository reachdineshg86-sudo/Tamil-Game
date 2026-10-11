import React from 'react';
import { Volume2, VolumeX, Settings, BookOpen, Pause, Play } from 'lucide-react';
import { AudioSettings } from '../types';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenCategoryPicker: () => void;
  audioSettings: AudioSettings;
  isSpeaking: boolean;
  selectedCategoryName: string;
  isGameStarted: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenCategoryPicker,
  audioSettings,
  isSpeaking,
  selectedCategoryName,
  isGameStarted,
  isPaused,
  onTogglePause,
}) => {
  return (
    <header className="w-full bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#262626] text-[#E5E5E5] py-3.5 px-4 sm:px-8 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand and Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#FF9933]/40 flex items-center justify-center shrink-0 shadow-lg shadow-black">
            <span className="text-[#FF9933] font-bold text-xl font-serif">த்</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-wide text-[#E5E5E5] font-serif">
                திருவள்ளுவர் தமிழ் பள்ளி
              </h1>
              <span className="hidden md:inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/30 rounded-sm">
                Authentic Voice Quiz
              </span>
            </div>
            <p className="text-[11px] text-[#888888] font-sans tracking-tight">
              15 வினாடி நேரக்கணிப்புடன் கூடிய வினா-விடை
            </p>
          </div>
        </div>

        {/* Action Controls & Audio Equalizer Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Equalizer status indicator */}
          <div className="hidden lg:flex items-center gap-3 pr-2 border-r border-[#262626]">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#FF9933]">
                Audio Status
              </span>
              <span className="text-xs text-[#888888]">
                {audioSettings.enabled
                  ? isSpeaking
                    ? 'Narrating...'
                    : 'Voice Ready'
                  : 'Muted'}
              </span>
            </div>
            <div className="flex items-end gap-1 h-6 px-1.5 py-0.5 bg-[#1A1A1A] border border-[#333333] rounded-sm">
              <div
                className={`w-1 bg-[#FF9933] rounded-full transition-all duration-200 ${
                  isSpeaking && !isPaused ? 'animate-eq-1' : 'h-1.5 opacity-40'
                }`}
              />
              <div
                className={`w-1 bg-[#FF9933] rounded-full transition-all duration-200 ${
                  isSpeaking && !isPaused ? 'animate-eq-2' : 'h-3 opacity-40'
                }`}
              />
              <div
                className={`w-1 bg-[#FF9933] rounded-full transition-all duration-200 ${
                  isSpeaking && !isPaused ? 'animate-eq-3' : 'h-2 opacity-40'
                }`}
              />
              <div
                className={`w-1 bg-[#FF9933] rounded-full transition-all duration-200 ${
                  isSpeaking && !isPaused ? 'animate-eq-4' : 'h-3.5 opacity-40'
                }`}
              />
              <div
                className={`w-1 bg-[#FF9933] rounded-full transition-all duration-200 ${
                  isSpeaking && !isPaused ? 'animate-eq-5' : 'h-1.5 opacity-40'
                }`}
              />
            </div>
          </div>

          {/* Pause / Resume Button (Visible when game has started) */}
          {isGameStarted && (
            <button
              id="header-pause-game-btn"
              onClick={onTogglePause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-semibold transition active:scale-95 ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                  : 'bg-[#1A1A1A] hover:bg-[#262626] text-[#E5E5E5] hover:text-[#FF9933] border-[#333333] hover:border-[#FF9933]/50'
              }`}
              title={isPaused ? 'விளையாட்டைத் தொடரவும் (Resume - [P])' : 'விளையாட்டை இடைநிறுத்தவும் (Pause - [P])'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="hidden sm:inline font-sans">தொடரவும்</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span className="hidden sm:inline font-sans">இடைநிறுத்து</span>
                </>
              )}
            </button>
          )}

          {/* Category Switcher Button */}
          <button
            id="header-category-picker-btn"
            onClick={onOpenCategoryPicker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] hover:border-[#FF9933]/50 text-[#E5E5E5] text-xs font-medium transition active:scale-95"
            title="பகுதியை மாற்றவும் (Change Category)"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="hidden sm:inline truncate max-w-[140px] font-serif">
              {selectedCategoryName}
            </span>
            <span className="sm:hidden font-serif">பகுதி</span>
          </button>

          {/* Voice Settings Button */}
          <button
            id="header-audio-status-btn"
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-semibold transition active:scale-95 ${
              audioSettings.enabled
                ? isSpeaking
                  ? 'bg-[#FF9933] text-black border-[#FF9933] shadow-md shadow-[#FF9933]/20'
                  : 'bg-[#1A1A1A] text-[#FF9933] border-[#333333] hover:border-[#FF9933]'
                : 'bg-[#1A1A1A] text-[#666666] border-[#333333] hover:text-[#AAAAAA]'
            }`}
            title="குரல் அமைப்புகள் (Voice Settings)"
          >
            {audioSettings.enabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">குரல்</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">முடக்கம்</span>
              </>
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-sm bg-[#1A1A1A] hover:bg-[#262626] text-[#888888] hover:text-[#FF9933] border border-[#333333] hover:border-[#FF9933]/50 transition active:scale-95"
            title="அமைப்புகள் (Settings)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
