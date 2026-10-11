export interface QuizQuestion {
  id: number;
  cat: string;
  catId: number;
  q: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface QuizCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
  color: string;
}

export type VoiceMode = 'natural-ai' | 'browser-tamil';

export interface AudioSettings {
  enabled: boolean;
  voiceMode: VoiceMode;
  geminiVoice: 'ta-IN' | 'ta-LK' | 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon' | string;
  browserVoiceURI: string;
  speechRate: number; // 0.8 to 1.3
  autoRead: boolean;
  readOptions: boolean;
  readAnswer: boolean; // read the correct answer and feedback verdict in Tamil
  autoAdvance: boolean; // toggle automatic advancement to next question
  soundEffects: boolean;
  volume: number;
}
