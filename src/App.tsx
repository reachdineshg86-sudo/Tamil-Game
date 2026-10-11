import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { QuizCard } from './components/QuizCard';
import { EndScreen } from './components/EndScreen';
import { StartScreen } from './components/StartScreen';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { CategoryPickerModal } from './components/CategoryPickerModal';
import { ALL_QUESTIONS, CATEGORIES } from './data/questions';
import { AudioSettings, QuizCategory, QuizQuestion } from './types';
import { ttsService } from './services/ttsService';
import { soundEffects } from './utils/soundEffects';

const QUESTION_TIMER_SECONDS = 15;
const AUTO_ADVANCE_DELAY_SECONDS = 4;

// Helper to randomly shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  // Audio configuration state
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: true,
    voiceMode: 'natural-ai',
    geminiVoice: 'ta-IN',
    browserVoiceURI: '',
    speechRate: 1.0,
    autoRead: true,
    readOptions: true,
    readAnswer: true,
    autoAdvance: true,
    soundEffects: true,
    volume: 1.0,
  });

  // Modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  // Game flow states (Start & Pause)
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Quiz state
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>(CATEGORIES[0]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>(ALL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Phase states
  const [isReadingQuestion, setIsReadingQuestion] = useState(false);
  const [autoAdvanceCount, setAutoAdvanceCount] = useState<number | null>(null);

  // Timer state (15s countdown)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time Audio Segment Highlight state
  const [activeSegment, setActiveSegment] = useState<
    'question' | 'option-0' | 'option-1' | 'option-2' | 'option-3' | null
  >(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Fresh state refs to prevent any stale closures in intervals/callbacks
  const currentQuestionRef = useRef<QuizQuestion>(currentQuestion);
  currentQuestionRef.current = currentQuestion;

  const audioSettingsRef = useRef<AudioSettings>(audioSettings);
  audioSettingsRef.current = audioSettings;

  const isAnsweredRef = useRef<boolean>(isAnswered);
  isAnsweredRef.current = isAnswered;

  const isReadingQuestionRef = useRef<boolean>(isReadingQuestion);
  isReadingQuestionRef.current = isReadingQuestion;

  const timeLeftRef = useRef<number>(timeLeft);
  timeLeftRef.current = timeLeft;

  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const isGameStartedRef = useRef<boolean>(isGameStarted);
  isGameStartedRef.current = isGameStarted;

  // Clear all active timers helper
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  // Sync mute state with sound synthesizer
  useEffect(() => {
    soundEffects.setMuted(!audioSettings.soundEffects);
  }, [audioSettings.soundEffects]);

  // Handle Question Timeout (15s elapsed)
  const handleTimeOut = useCallback(() => {
    if (isAnsweredRef.current || isPausedRef.current) return;

    clearAllTimers();
    ttsService.stop();
    setIsSpeaking(false);
    setActiveSegment(null);
    setIsReadingQuestion(false);
    setIsAnswered(true);
    setSelectedOption(null);
    setStreak(0);
    soundEffects.playTimeout();

    const q = currentQuestionRef.current;
    const settings = audioSettingsRef.current;

    if (settings.enabled && settings.readAnswer) {
      setIsSpeaking(true);
      ttsService.speakAnswerVerdict(
        false, // isCorrect
        true, // isTimeout
        q.answer,
        q.options[q.answer],
        q.explanation,
        settings,
        () => {
          setIsSpeaking(true);
        },
        () => {
          setIsSpeaking(false);
          triggerAutoAdvance();
        }
      );
    } else {
      triggerAutoAdvance();
    }
  }, [clearAllTimers]);

  const handleTimeOutRef = useRef<() => void>(handleTimeOut);
  handleTimeOutRef.current = handleTimeOut;

  // Start 15s Timer for Current Question (Called only after question audio completes)
  const startQuestionTimer = useCallback((overrideSeconds?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const initial = overrideSeconds !== undefined ? overrideSeconds : QUESTION_TIMER_SECONDS;
    setTimeLeft(initial);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Defer state update outside of render
          setTimeout(() => {
            handleTimeOutRef.current();
          }, 0);
          return 0;
        }
        // Play tick sound during active countdown
        soundEffects.playTick(next <= 4);
        return next;
      });
    }, 1000);
  }, []);

  // Trigger Auto-Advance to Next Question after answer is displayed (if enabled)
  const triggerAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);

    if (!audioSettingsRef.current.autoAdvance || isPausedRef.current) {
      setAutoAdvanceCount(null);
      return;
    }

    setAutoAdvanceCount(AUTO_ADVANCE_DELAY_SECONDS);

    let remaining = AUTO_ADVANCE_DELAY_SECONDS;
    autoAdvanceTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (autoAdvanceTimerRef.current) {
          clearInterval(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = null;
        }
        setAutoAdvanceCount(null);
        handleNextQuestion();
      } else {
        setAutoAdvanceCount(remaining);
      }
    }, 1000);
  }, []);

  // Update questions list when category changes
  const handleSelectCategory = (cat: QuizCategory) => {
    ttsService.stop();
    clearAllTimers();

    setSelectedCategory(cat);
    let questions = ALL_QUESTIONS;
    if (cat.id !== 0) {
      questions = ALL_QUESTIONS.filter((q) => q.catId === cat.id);
    }
    const shuffled = shuffleArray(questions);
    setFilteredQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsQuizComplete(false);
    setIsReadingQuestion(false);
    setAutoAdvanceCount(null);
    setTimeLeft(QUESTION_TIMER_SECONDS);
    setIsPaused(false);

    if (isGameStarted) {
      startAudioNarration(0, shuffled);
    }
  };

  // Speak the question and options, then trigger 15s timer upon finish
  const startAudioNarration = useCallback(
    (qIndex: number, questionsList: QuizQuestion[]) => {
      const q = questionsList[qIndex];
      if (!q || isPausedRef.current) return;

      const settings = audioSettingsRef.current;

      // If audio is disabled or auto-read is off, skip reading phase & start timer immediately
      if (!settings.enabled || !settings.autoRead) {
        setIsReadingQuestion(false);
        setIsSpeaking(false);
        setActiveSegment(null);
        startQuestionTimer();
        return;
      }

      setIsReadingQuestion(true);
      setIsSpeaking(true);

      ttsService.playQuestionSequence(
        q.id,
        q.q,
        q.options,
        settings,
        (seg) => {
          setActiveSegment(seg);
        },
        () => {
          // Narration complete! Now start 15s countdown timer
          setIsSpeaking(false);
          setActiveSegment(null);
          setIsReadingQuestion(false);
          if (!isPausedRef.current) {
            startQuestionTimer();
          }
        }
      );
    },
    [startQuestionTimer]
  );

  // Start the Game from Welcome Screen (shuffles questions)
  const handleStartGame = () => {
    soundEffects.playClick();
    setIsGameStarted(true);
    setIsPaused(false);
    clearAllTimers();

    let baseQuestions = ALL_QUESTIONS;
    if (selectedCategory.id !== 0) {
      baseQuestions = ALL_QUESTIONS.filter((q) => q.catId === selectedCategory.id);
    }
    const shuffled = shuffleArray(baseQuestions);
    setFilteredQuestions(shuffled);

    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setAutoAdvanceCount(null);
    setTimeLeft(QUESTION_TIMER_SECONDS);

    startAudioNarration(0, shuffled);
  };

  // Toggle Pause and Resume
  const handleTogglePause = () => {
    soundEffects.playClick();

    if (!isPaused) {
      // Pause action: freeze timers and stop any ongoing speech
      setIsPaused(true);
      isPausedRef.current = true;
      clearAllTimers();
      ttsService.stop();
      setIsSpeaking(false);
      setActiveSegment(null);
    } else {
      // Resume action: unfreeze and start reading the question
      setIsPaused(false);
      isPausedRef.current = false;

      if (!isAnswered) {
        clearAllTimers();
        setTimeLeft(QUESTION_TIMER_SECONDS);
        startAudioNarration(currentIndex, filteredQuestions);
      } else {
        // If already answered, resume auto-advance if enabled
        triggerAutoAdvance();
      }
    }
  };

  // Initialize Question Sequence when game is started & question changes
  useEffect(() => {
    if (!isGameStarted || isQuizComplete || filteredQuestions.length === 0 || isPaused) return;

    clearAllTimers();
    setSelectedOption(null);
    setIsAnswered(false);
    setAutoAdvanceCount(null);
    setTimeLeft(QUESTION_TIMER_SECONDS);

    startAudioNarration(currentIndex, filteredQuestions);

    return () => {
      clearAllTimers();
      ttsService.stop();
    };
  }, [isGameStarted, currentIndex, filteredQuestions, isQuizComplete, clearAllTimers, startAudioNarration]);

  // Handle Option Click (by user)
  const handleSelectOption = (idx: number) => {
    if (isAnswered || isPaused) return;

    clearAllTimers();
    ttsService.stop();
    setIsSpeaking(false);
    setActiveSegment(null);
    setIsReadingQuestion(false);

    setSelectedOption(idx);
    setIsAnswered(true);

    const q = currentQuestion;
    const isCorrect = idx === q.answer;

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      soundEffects.playCorrect();
    } else {
      setStreak(0);
      soundEffects.playIncorrect();
    }

    // Read the correct answer in authentic Tamil (without explanation reading)
    if (audioSettings.enabled && audioSettings.readAnswer) {
      setIsSpeaking(true);
      ttsService.speakAnswerVerdict(
        isCorrect,
        false, // not timeout
        q.answer,
        q.options[q.answer],
        q.explanation,
        audioSettings,
        () => {
          setIsSpeaking(true);
        },
        () => {
          setIsSpeaking(false);
          triggerAutoAdvance();
        }
      );
    } else {
      triggerAutoAdvance();
    }
  };

  // Move to Next Question immediately (manual or automatic)
  const handleNextQuestion = useCallback(() => {
    clearAllTimers();
    ttsService.stop();
    setIsSpeaking(false);
    setActiveSegment(null);
    setIsReadingQuestion(false);
    setAutoAdvanceCount(null);
    soundEffects.playClick();

    setCurrentIndex((prev) => {
      if (prev + 1 < filteredQuestions.length) {
        return prev + 1;
      } else {
        setIsQuizComplete(true);
        soundEffects.playCorrect();
        return prev;
      }
    });
  }, [clearAllTimers, filteredQuestions.length]);

  // Replay Answer in Tamil on demand
  const handleReplayAnswer = () => {
    if (!isAnswered || isPaused) return;
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
    setAutoAdvanceCount(null);
    soundEffects.playClick();

    const q = currentQuestion;
    const isCorrect = selectedOption === q.answer;
    const isTimeout = selectedOption === null;

    setIsSpeaking(true);
    ttsService.speakAnswerVerdict(
      isCorrect,
      isTimeout,
      q.answer,
      q.options[q.answer],
      q.explanation,
      audioSettings,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        triggerAutoAdvance();
      }
    );
  };

  // Replay Audio for current question (Pauses timer and re-reads question)
  const handleReplayAudio = () => {
    if (isAnswered || isPaused) return;
    clearAllTimers();
    soundEffects.playClick();
    setTimeLeft(QUESTION_TIMER_SECONDS);
    startAudioNarration(currentIndex, filteredQuestions);
  };

  // Speak single option
  const handleSpeakSingleOption = (optText: string, optIndex: number) => {
    if (isPaused) return;
    soundEffects.playClick();
    setIsSpeaking(true);
    setActiveSegment(`option-${optIndex}` as 'option-0' | 'option-1' | 'option-2' | 'option-3');
    ttsService.speakText(
      optText,
      audioSettings,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        setActiveSegment(null);
      }
    );
  };

  // Toggle Mute Audio
  const handleToggleMute = () => {
    setAudioSettings((prev) => {
      const updated = { ...prev, enabled: !prev.enabled };
      if (!updated.enabled) {
        ttsService.stop();
        setIsSpeaking(false);
        setActiveSegment(null);
        if (isReadingQuestion && !isPaused) {
          setIsReadingQuestion(false);
          startQuestionTimer();
        }
      }
      return updated;
    });
  };

  // Restart Quiz with freshly shuffled questions
  const handleRestartQuiz = () => {
    clearAllTimers();
    soundEffects.playClick();
    ttsService.stop();

    let baseQuestions = ALL_QUESTIONS;
    if (selectedCategory.id !== 0) {
      baseQuestions = ALL_QUESTIONS.filter((q) => q.catId === selectedCategory.id);
    }
    const shuffled = shuffleArray(baseQuestions);
    setFilteredQuestions(shuffled);

    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsQuizComplete(false);
    setIsReadingQuestion(false);
    setAutoAdvanceCount(null);
    setTimeLeft(QUESTION_TIMER_SECONDS);
    setIsPaused(false);
    setIsGameStarted(true);

    startAudioNarration(0, shuffled);
  };

  // Keyboard shortcut listener (P for Pause, Space for replay, 1-4 for options, N/Enter for next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modals are open or input focused
      if (isSettingsOpen || isCategoryPickerOpen) return;
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (!isGameStarted) {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      if (e.code === 'KeyP') {
        e.preventDefault();
        handleTogglePause();
      } else if (e.code === 'KeyR' && !isPaused) {
        e.preventDefault();
        handleRestartQuiz();
      } else if (e.code === 'Space' && !isPaused) {
        e.preventDefault();
        handleReplayAudio();
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code) && !isPaused) {
        const optionIdx = parseInt(e.key, 10) - 1;
        if (optionIdx >= 0 && optionIdx < 4 && !isAnswered && !isQuizComplete) {
          handleSelectOption(optionIdx);
        }
      } else if ((e.code === 'KeyN' || e.code === 'ArrowRight') && !isPaused) {
        e.preventDefault();
        if (!isQuizComplete) {
          handleNextQuestion();
        }
      } else if (e.code === 'Enter' && isAnswered && !isQuizComplete && !isPaused) {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isGameStarted,
    isPaused,
    isSettingsOpen,
    isCategoryPickerOpen,
    isAnswered,
    isQuizComplete,
    currentIndex,
    filteredQuestions,
    audioSettings,
    isReadingQuestion,
    handleNextQuestion,
  ]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E5E5E5] flex flex-col font-sans relative overflow-x-hidden">
      {/* Top Accent Line */}
      <div className="w-full h-1 bg-[#1A1A1A] z-40">
        <div
          className="h-full bg-[#FF9933] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
        />
      </div>

      {/* Background Architectural Subtle Grid & Artistic Watermark */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#FF9933 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -bottom-10 -right-6 opacity-[0.035] pointer-events-none">
          <h3 className="text-[160px] sm:text-[260px] leading-none font-black italic tracking-tighter text-[#E5E5E5] select-none">
            TAMIL
          </h3>
        </div>
      </div>

      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCategoryPicker={() => setIsCategoryPickerOpen(true)}
        audioSettings={audioSettings}
        isSpeaking={isSpeaking}
        selectedCategoryName={selectedCategory.name}
        isGameStarted={isGameStarted}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
      />

      {/* Main Quiz Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 z-10">
        {!isGameStarted ? (
          <StartScreen
            selectedCategory={selectedCategory}
            onStartGame={handleStartGame}
            onOpenCategoryPicker={() => setIsCategoryPickerOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : !isQuizComplete ? (
          <QuizCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={filteredQuestions.length}
            score={score}
            streak={streak}
            timeLeft={timeLeft}
            totalTimerDuration={QUESTION_TIMER_SECONDS}
            selectedOption={selectedOption}
            isAnswered={isAnswered}
            isReadingQuestion={isReadingQuestion}
            autoAdvanceCount={autoAdvanceCount}
            activeSegment={activeSegment}
            isSpeaking={isSpeaking}
            audioSettings={audioSettings}
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onRestartQuiz={handleRestartQuiz}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleNextQuestion}
            onReplayAudio={handleReplayAudio}
            onReplayAnswer={handleReplayAnswer}
            onSpeakSingleOption={handleSpeakSingleOption}
            onToggleMute={handleToggleMute}
          />
        ) : (
          <EndScreen
            score={score}
            totalQuestions={filteredQuestions.length}
            categoryName={selectedCategory.name}
            onRestart={handleRestartQuiz}
            onChangeCategory={() => setIsCategoryPickerOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={audioSettings}
        onUpdateSettings={(newSettings) =>
          setAudioSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />

      <CategoryPickerModal
        isOpen={isCategoryPickerOpen}
        onClose={() => setIsCategoryPickerOpen(false)}
        selectedCategoryId={selectedCategory.id}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
