import { AudioSettings } from '../types';

export interface SpokenSegment {
  id: 'question' | 'option-0' | 'option-1' | 'option-2' | 'option-3';
  text: string;
  tamilSpokenLabel: string;
}

export const TAMIL_OPTION_LABELS = ['அ', 'ஆ', 'இ', 'ஈ'];

// Convert numbers into pure Tamil words for authentic speech
export function tamilNumberToWords(num: number): string {
  const ones = ["", "ஒன்று", "இரண்டு", "மூன்று", "நான்கு", "ஐந்து", "ஆறு", "ஏழு", "எட்டு", "ஒன்பது"];
  const teens = ["பத்து", "பதினொன்று", "பன்னிரண்டு", "பதின்மூன்று", "பதினான்கு", "பதினைந்து", "பதினாறு", "பதினேழு", "பதினெட்டு", "பத்தொன்பது"];
  const tens = ["", "பத்து", "இருபது", "முப்பது", "நாற்பது", "ஐம்பது", "அறுபது", "எழுபது", "எண்பது", "தொண்ணூறு"];
  const tensComp = ["", "பத்து", "இருபத்து ", "முப்பத்து ", "நாற்பத்து ", "ஐம்பத்து ", "அறுபத்து ", "எழுபத்து ", "எண்பத்து ", "தொண்ணூற்று "];
  const hundreds = ["", "நூறு", "இருநூறு", "முந்நூறு", "நாநூறு", "ஐந்நூறு", "அறுநூறு", "எழுநூறு", "எண்ணூறு", "தொள்ளாயிரம்"];
  const hundredsComp = ["", "நூற்று ", "இருநூற்று ", "முந்நூற்று ", "நாநூற்று ", "ஐந்நூற்று ", "அறுநூற்று ", "எழுநூற்று ", "எண்ணூற்று ", "தொள்ளாயிரத்து "];

  if (num === 0) return "பூஜ்ஜியம்";
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const rem = num % 10;
    const t = Math.floor(num / 10);
    return rem === 0 ? tens[t] : tensComp[t] + ones[rem];
  }
  if (num < 1000) {
    const rem = num % 100;
    const h = Math.floor(num / 100);
    return rem === 0 ? hundreds[h] : hundredsComp[h] + tamilNumberToWords(rem);
  }
  if (num === 1000) return "ஆயிரம்";
  if (num < 2000) {
    const rem = num % 1000;
    return rem === 0 ? "ஆயிரம்" : "ஆயிரத்து " + tamilNumberToWords(rem);
  }
  return String(num);
}

export function replaceDigitsWithTamilWords(text: string): string {
  return text.replace(/\b\d+\b/g, (match) => {
    const n = parseInt(match, 10);
    if (!isNaN(n) && n <= 2000) {
      return tamilNumberToWords(n);
    }
    return match;
  });
}

// Clean and normalize Tamil text for authentic, flawless pronunciation
export function normalizeTamilForSpeech(text: string): string {
  const normalized = text
    // Replace slash / or \ with natural Tamil 'அல்லது' (or) so speech never says English "slash"
    .replace(/\s*[\/\\]\s*/g, ' அல்லது ')
    // Replace & with Tamil 'மற்றும்' (and)
    .replace(/\s*&\s*/g, ' மற்றும் ')
    // Replace Avvai / Avvaiyar with phonetic spelling for clean pronunciation (prevents 'ulavaiyaar' mispronunciation)
    .replace(/ஒளவையார்|ஔவையார்/g, 'அவ்வையார்')
    .replace(/ஒளவை|ஔவை/g, 'அவ்வை')
    .replace(/ஒளடதம்|ஔடதம்/g, 'அவுடதம்')
    // Normalize decomposed Unicode characters (ஒ + ள -> ஔ)
    .replace(/\u0B92\u0BB3/g, 'ஔ');

  return replaceDigitsWithTamilWords(normalized);
}

class TTSService {
  private currentAudioElement: HTMLAudioElement | null = null;
  private audioCache = new Map<string, string>();
  private activeSequenceId = 0;
  private isCancelled = false;

  // Get available browser voices for Tamil
  public getBrowserTamilVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }
    const voices = window.speechSynthesis.getVoices();
    return voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('ta') ||
        v.name.toLowerCase().includes('tamil') ||
        v.name.includes('தமிழ்')
    );
  }

  // Pre-load audio from backend TTS or return cached data URL
  public async fetchServerTTS(text: string, voiceName = 'ta-IN'): Promise<string | null> {
    const cleanText = normalizeTamilForSpeech(text.trim());
    if (!cleanText) return null;

    const cacheKey = `${voiceName}:${cleanText}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: voiceName }),
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      if (data.audioUrl) {
        this.audioCache.set(cacheKey, data.audioUrl);
        return data.audioUrl;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Stop all active audio / speech immediately
  public stop() {
    this.isCancelled = true;
    this.activeSequenceId++;

    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Play audio via HTML5 Audio element
  private playAudioElement(audioUrl: string, rate: number, volume: number): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;
      audio.playbackRate = Math.max(0.75, Math.min(1.5, rate));
      audio.volume = Math.max(0, Math.min(1, volume));

      audio.onended = () => {
        if (this.currentAudioElement === audio) {
          this.currentAudioElement = null;
        }
        resolve();
      };

      audio.onerror = () => {
        if (this.currentAudioElement === audio) {
          this.currentAudioElement = null;
        }
        resolve();
      };

      audio.play().catch(() => {
        resolve();
      });
    });
  }

  // Play audio via Web Speech Synthesis Utterance
  private speakViaWebSpeech(
    text: string,
    rate: number,
    volume: number,
    voiceURI?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = normalizeTamilForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ta-IN';
      utterance.rate = Math.max(0.8, Math.min(1.3, rate));
      utterance.pitch = 1.0;
      utterance.volume = Math.max(0, Math.min(1, volume));

      // Try selecting designated voice or any Tamil voice
      const voices = window.speechSynthesis.getVoices();
      if (voiceURI) {
        const matchingVoice = voices.find((v) => v.voiceURI === voiceURI);
        if (matchingVoice) utterance.voice = matchingVoice;
      }
      if (!utterance.voice) {
        const tamilVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('ta') ||
            v.name.toLowerCase().includes('tamil') ||
            v.name.includes('தமிழ்')
        );
        if (tamilVoice) utterance.voice = tamilVoice;
      }

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // Speak a single text segment
  public async speakText(
    text: string,
    settings: AudioSettings,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    if (!settings.enabled) return;
    this.stop();
    this.isCancelled = false;

    if (onStart) onStart();

    // Prefer Authentic Native Tamil Voice
    if (settings.voiceMode === 'natural-ai') {
      const audioUrl = await this.fetchServerTTS(text, settings.geminiVoice);
      if (audioUrl && !this.isCancelled) {
        await this.playAudioElement(audioUrl, settings.speechRate, settings.volume);
        if (onEnd) onEnd();
        return;
      }
    }

    // Fallback to Web Speech API with Tamil voice
    if (!this.isCancelled) {
      await this.speakViaWebSpeech(
        text,
        settings.speechRate,
        settings.volume,
        settings.browserVoiceURI
      );
    }
    if (onEnd) onEnd();
  }

  // Speak the answer verdict and explanation in rich, authentic natural Tamil
  public async speakAnswerVerdict(
    isCorrect: boolean,
    isTimeout: boolean,
    optionIndex: number,
    optionText: string,
    explanation: string | undefined,
    settings: AudioSettings,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    if (!settings.enabled || !settings.readAnswer) {
      if (onEnd) onEnd();
      return;
    }

    const optionLetter = TAMIL_OPTION_LABELS[optionIndex] || '';
    const spokenAnswer = replaceDigitsWithTamilWords(optionText);
    const spokenExplanation = explanation ? replaceDigitsWithTamilWords(explanation) : '';

    let verdictText = '';
    if (isTimeout) {
      verdictText = `நேரம் முடிந்தது! சரியான விடை: ${spokenAnswer}.`;
    } else if (isCorrect) {
      verdictText = `மிகச் சரி! சரியான விடை: ${spokenAnswer}.`;
    } else {
      verdictText = `தவறான விடை. சரியான விடை: ${spokenAnswer}.`;
    }

    await this.speakText(verdictText, settings, onStart, onEnd);
  }

  // Play full question and options sequence with real-time highlighting
  public async playQuestionSequence(
    questionNumber: number,
    questionText: string,
    options: string[],
    settings: AudioSettings,
    onSegmentChange: (segmentId: 'question' | 'option-0' | 'option-1' | 'option-2' | 'option-3' | null) => void,
    onComplete?: () => void
  ) {
    if (!settings.enabled) {
      if (onComplete) onComplete();
      return;
    }

    this.stop();
    this.isCancelled = false;
    const sequenceId = ++this.activeSequenceId;

    const segments: SpokenSegment[] = [
      {
        id: 'question',
        text: normalizeTamilForSpeech(questionText),
        tamilSpokenLabel: questionText,
      },
    ];

    if (settings.readOptions) {
      options.forEach((opt, idx) => {
        const spokenOption = replaceDigitsWithTamilWords(opt);
        segments.push({
          id: `option-${idx}` as 'option-0' | 'option-1' | 'option-2' | 'option-3',
          text: spokenOption,
          tamilSpokenLabel: opt,
        });
      });
    }

    // Preload audio for all segments in parallel for zero latency
    if (settings.voiceMode === 'natural-ai') {
      Promise.all(segments.map((seg) => this.fetchServerTTS(seg.text, settings.geminiVoice))).catch(() => {});
    }

    // Sequentially speak each segment
    for (const seg of segments) {
      if (this.isCancelled || this.activeSequenceId !== sequenceId) break;

      onSegmentChange(seg.id);

      let playedViaAI = false;
      if (settings.voiceMode === 'natural-ai') {
        const audioUrl = await this.fetchServerTTS(seg.text, settings.geminiVoice);
        if (audioUrl && !this.isCancelled && this.activeSequenceId === sequenceId) {
          await this.playAudioElement(audioUrl, settings.speechRate, settings.volume);
          playedViaAI = true;
        }
      }

      if (!playedViaAI && !this.isCancelled && this.activeSequenceId === sequenceId) {
        await this.speakViaWebSpeech(
          seg.text,
          settings.speechRate,
          settings.volume,
          settings.browserVoiceURI
        );
      }

      // Small natural pause between question & options
      if (!this.isCancelled && this.activeSequenceId === sequenceId) {
        await new Promise((r) => setTimeout(r, 220));
      }
    }

    if (this.activeSequenceId === sequenceId) {
      onSegmentChange(null);
      if (onComplete) onComplete();
    }
  }
}

export const ttsService = new TTSService();
