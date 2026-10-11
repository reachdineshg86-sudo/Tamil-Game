import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Check, Play, Globe } from 'lucide-react';
import { AudioSettings, VoiceMode } from '../types';
import { ttsService } from '../services/ttsService';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      const voices = ttsService.getBrowserTamilVoices();
      setBrowserVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = async () => {
    setIsTesting(true);
    await ttsService.speakText(
      'வணக்கம்! தமிழ் வினாடி வினா ஆரம்பிக்கலாம்.',
      settings,
      undefined,
      () => setIsTesting(false)
    );
  };

  return (
    <div
      id="audio-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="audio-settings-modal"
        className="w-full max-w-md bg-[#1A1A1A] border border-[#333333] p-6 sm:p-7 shadow-2xl text-[#E5E5E5] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0F0F0F] text-[#FF9933] border border-[#333333]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#E5E5E5] font-serif">குரல் & ஒலி அமைப்புகள்</h2>
              <p className="text-[11px] text-[#888888] font-mono">Authentic Tamil Voice & Audio Engine</p>
            </div>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 hover:bg-[#262626] transition"
          >
            ✕
          </button>
        </div>

        {/* Master Audio Enable Toggle */}
        <div className="flex items-center justify-between p-4 bg-[#0F0F0F] border border-[#262626]">
          <div className="flex items-center gap-3">
            {settings.enabled ? (
              <Volume2 className="w-5 h-5 text-[#FF9933]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#666666]" />
            )}
            <div>
              <div className="text-xs font-bold text-[#E5E5E5] uppercase tracking-wide">Voice Narration</div>
              <div className="text-[11px] text-[#888888]">கேள்வி மற்றும் விடைகளை தானாக வாசித்தல்</div>
            </div>
          </div>
          <button
            id="toggle-audio-enabled"
            onClick={() => onUpdateSettings({ enabled: !settings.enabled })}
            className={`w-12 h-6 flex items-center p-1 transition-colors duration-300 ${
              settings.enabled ? 'bg-[#FF9933]' : 'bg-[#333333]'
            }`}
          >
            <div
              className={`bg-black w-4 h-4 shadow-md transform transition-transform duration-300 ${
                settings.enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Voice Engine Mode Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF9933] font-mono">
            Voice Technology • குரல் தொழில்நுட்பம்
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="voice-mode-ai"
              onClick={() => onUpdateSettings({ voiceMode: 'natural-ai' as VoiceMode })}
              className={`p-3 border text-left transition flex flex-col justify-between ${
                settings.voiceMode === 'natural-ai'
                  ? 'border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933]'
                  : 'border-[#262626] bg-[#0F0F0F] text-[#888888] hover:border-[#333333]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" /> தூய தமிழ் குரல்
                </span>
                {settings.voiceMode === 'natural-ai' && <Check className="w-3.5 h-3.5 text-[#FF9933]" />}
              </div>
              <span className="text-[10px] text-[#888888] leading-tight font-serif">
                Authentic Native Tamil Voice (இயற்கையான உச்சரிப்பு)
              </span>
            </button>

            <button
              id="voice-mode-browser"
              onClick={() => onUpdateSettings({ voiceMode: 'browser-tamil' as VoiceMode })}
              className={`p-3 border text-left transition flex flex-col justify-between ${
                settings.voiceMode === 'browser-tamil'
                  ? 'border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933]'
                  : 'border-[#262626] bg-[#0F0F0F] text-[#888888] hover:border-[#333333]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold font-mono flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> சாதன குரல்
                </span>
                {settings.voiceMode === 'browser-tamil' && <Check className="w-3.5 h-3.5 text-[#FF9933]" />}
              </div>
              <span className="text-[10px] text-[#888888] leading-tight font-serif">
                Device Tamil Voice (உலாவி உள்ளமைக்கப்பட்ட குரல்)
              </span>
            </button>
          </div>
        </div>

        {/* AI Voice Selection */}
        {settings.voiceMode === 'natural-ai' ? (
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF9933] font-mono">
              Tamil Voice Dialect • தமிழ் குரல் தேர்வு
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ta-IN', name: 'தமிழ்நாடு குரல் (Tamil Nadu - Native)' },
                { id: 'ta-LK', name: 'இலங்கை தமிழ் (Sri Lanka Tamil)' },
                { id: 'Kore', name: 'தெளிவான குரல் (Clear Pronunciation)' },
                { id: 'Zephyr', name: 'மென்மையான குரல் (Gentle Tone)' },
              ].map((v) => (
                <button
                  key={v.id}
                  id={`voice-preset-${v.id}`}
                  onClick={() => onUpdateSettings({ geminiVoice: v.id as AudioSettings['geminiVoice'] })}
                  className={`p-2.5 border text-left text-xs transition ${
                    settings.geminiVoice === v.id
                      ? 'border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933] font-semibold'
                      : 'border-[#262626] bg-[#0F0F0F] text-[#AAAAAA] hover:border-[#333333]'
                  }`}
                >
                  <div className="truncate font-serif">{v.name}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF9933] font-mono">
              Installed Tamil Voices • சாதன குரல்கள்
            </label>
            {browserVoices.length > 0 ? (
              <select
                id="browser-voice-select"
                value={settings.browserVoiceURI}
                onChange={(e) => onUpdateSettings({ browserVoiceURI: e.target.value })}
                className="w-full bg-[#0F0F0F] border border-[#333333] p-2.5 text-xs text-[#E5E5E5] focus:outline-none focus:border-[#FF9933]"
              >
                <option value="">தானியங்கி தேர்வு (Auto Tamil Voice)</option>
                {browserVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2.5 bg-[#0F0F0F] border border-[#262626] text-[11px] text-[#888888] font-serif">
                சாதனத்தின் இயல்புநிலை தமிழ் குரல் (ta-IN) பயன்படுத்தப்படும்.
              </div>
            )}
          </div>
        )}

        {/* Speed & Options Reading */}
        <div className="space-y-4 pt-1">
          {/* Speech Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#CCCCCC] font-mono">
              <span>வாசிக்கும் வேகம் (Speech Speed)</span>
              <span className="font-bold text-[#FF9933]">{settings.speechRate}x</span>
            </div>
            <input
              id="speech-rate-slider"
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={settings.speechRate}
              onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-[#FF9933] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#666666] font-mono">
              <span>0.75x</span>
              <span>1.0x</span>
              <span>1.25x</span>
            </div>
          </div>

          {/* Read Options Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-[#262626]">
            <span className="text-xs text-[#CCCCCC]">விடைகளையும் வரிசையாக வாசி (Read Options A-D)</span>
            <input
              id="toggle-read-options"
              type="checkbox"
              checked={settings.readOptions}
              onChange={(e) => onUpdateSettings({ readOptions: e.target.checked })}
              className="w-4 h-4 accent-[#FF9933] cursor-pointer"
            />
          </div>

          {/* Read Answer Verdict Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-[#262626]">
            <div className="flex flex-col">
              <span className="text-xs text-[#CCCCCC]">சரியான விடையை குரலில் கூறு (Read Answer in Tamil)</span>
              <span className="text-[10px] text-[#777777]">விடை அளித்தபின் சரியான விடையை தமிழில் அறிவித்தல்</span>
            </div>
            <input
              id="toggle-read-answer"
              type="checkbox"
              checked={settings.readAnswer}
              onChange={(e) => onUpdateSettings({ readAnswer: e.target.checked })}
              className="w-4 h-4 accent-[#FF9933] cursor-pointer"
            />
          </div>

          {/* Auto Advance Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-[#262626]">
            <div className="flex flex-col">
              <span className="text-xs text-[#CCCCCC]">தானியங்கி அடுத்த கேள்வி (Auto-Advance 3s)</span>
              <span className="text-[10px] text-[#777777]">விடை அளித்தபின் தானாக அடுத்த கேள்விக்கு நகர்தல்</span>
            </div>
            <input
              id="toggle-auto-advance"
              type="checkbox"
              checked={settings.autoAdvance}
              onChange={(e) => onUpdateSettings({ autoAdvance: e.target.checked })}
              className="w-4 h-4 accent-[#FF9933] cursor-pointer"
            />
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-[#262626]">
            <span className="text-xs text-[#CCCCCC]">ஒலி விளைவுகள் (Sound Effects / Chimes)</span>
            <input
              id="toggle-sound-effects"
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
              className="w-4 h-4 accent-[#FF9933] cursor-pointer"
            />
          </div>
        </div>

        {/* Test Speech Button & Done */}
        <div className="flex items-center gap-3 pt-2">
          <button
            id="test-speech-btn"
            onClick={handleTestVoice}
            disabled={isTesting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0F0F0F] hover:bg-[#262626] text-[#E5E5E5] text-xs font-mono font-semibold border border-[#333333] transition active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-[#FF9933]" />
            {isTesting ? 'வாசிக்கிறது...' : 'TEST VOICE'}
          </button>

          <button
            id="save-settings-btn"
            onClick={onClose}
            className="py-2.5 px-6 bg-[#FF9933] hover:bg-[#FFAA4D] text-black text-xs font-bold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-[#FF9933]/20"
          >
            முடிந்தது (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
