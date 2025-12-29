import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import BackgroundAudio from './components/BackgroundAudio';
import { quizData } from './data/questions';

import { playClick, playCorrect, playWrong, playStart } from './utils/sfx';

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, result
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  // New States for Training Suite
  const [settings, setSettings] = useState({ season: 'all', suddenDeath: false, inputMode: false });
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startQuiz = (newSettings) => {
    playStart();
    const { season, suddenDeath } = newSettings;
    setSettings(newSettings);

    // Filter by season logic
    let pool = quizData;
    if (season !== 'all') {
      pool = quizData.filter(q => q.season === season);
    }

    // Shuffle and Select
    const shuffled = shuffleArray(pool);
    // Increased limit to 50 questions
    const selected = shuffled.slice(0, 50);
    setCurrentQuestions(selected);

    setGameState('playing');
    setCurrentQuestionIdx(0);
    setScore(0);
    setWrongAnswers([]);
  };

  const handleAnswer = (isCorrect, yourAnswer) => {
    if (isCorrect) {
      playCorrect();
      setScore(prev => prev + 1);
    } else {
      playWrong();
      // Track mistake
      const currentQ = currentQuestions[currentQuestionIdx];
      setWrongAnswers(prev => [...prev, {
        ...currentQ,
        yourAnswer: yourAnswer
      }]);

      // Sudden Death Check
      if (settings.suddenDeath) {
        setGameState('result');
        return;
      }
    }
  };

  const handleNextQuestion = () => {
    playClick();
    if (settings.suddenDeath && wrongAnswers.length > 0) {
      setGameState('result');
      return;
    }

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < currentQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
    } else {
      setGameState('result');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative selection:bg-st-red selection:text-white">
      {/* Background Ambience */}
      <BackgroundAudio />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80"></div>
        {/* Subtle dust particles could go here */}
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10"
          >
            <StartScreen onStart={startQuiz} />
          </motion.div>
        )}

        {gameState === 'playing' && currentQuestions.length > 0 && (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"
          >
            {/* Header Stats */}
            <div className="absolute top-6 left-0 right-0 flex justify-center gap-10 px-8 text-st-red/60 font-body text-sm uppercase tracking-[0.2em] pointer-events-none">
              <span className="drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">Вопрос {currentQuestionIdx + 1} / {currentQuestions.length}</span>
              <span className="drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">Счет: {score}</span>
            </div>

            <QuestionCard
              questionData={currentQuestions[currentQuestionIdx]}
              onAnswer={handleAnswer}
              onNext={handleNextQuestion}
              currentNum={currentQuestionIdx + 1}
              totalNum={currentQuestions.length}
              inputMode={settings.inputMode}
            />
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <ResultScreen
              score={score}
              total={currentQuestions.length}
              wrongAnswers={wrongAnswers}
              onRestart={() => setGameState('start')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
