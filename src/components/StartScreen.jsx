import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playHover, playClick } from '../utils/sfx';

const StartScreen = ({ onStart }) => {
    const [season, setSeason] = useState('all');
    const [suddenDeath, setSuddenDeath] = useState(false);
    const [inputMode, setInputMode] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center z-10 relative px-4">
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-title text-7xl md:text-9xl text-st-red mb-2 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] tracking-normal"
            >
                STRANGER<br />QUIZ
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-white/70 text-lg md:text-xl mb-12 tracking-widest uppercase"
            >
                Проверь свои знания Хоукинса
            </motion.p>

            {/* Settings Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="w-full max-w-md bg-zinc-900/80 p-6 rounded-lg border border-zinc-800 mb-8 backdrop-blur-sm"
            >
                {/* Season Selector */}
                <div className="mb-6">
                    <label className="block text-zinc-400 font-bold mb-3 uppercase tracking-widest text-sm">Выберите Сезон</label>
                    <div className="flex justify-between gap-2">
                        {['all', 1, 2, 3, 4].map((s) => (
                            <button
                                key={s}
                                onClick={() => { playClick(); setSeason(s); }}
                                onMouseEnter={playHover}
                                className={`flex-1 py-2 font-body font-bold rounded transition-all ${season === s
                                    ? 'bg-st-red text-white shadow-[0_0_10px_rgba(255,0,0,0.5)]'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                    }`}
                            >
                                {s === 'all' ? 'ВСЕ' : s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Game Mode */}
                <div className="space-y-3">
                    <label className="block text-zinc-400 font-bold mb-3 uppercase tracking-widest text-sm">Настройки Сложности</label>

                    {/* Input Mode Toggle */}
                    <button
                        onClick={() => { playClick(); setInputMode(!inputMode); }}
                        onMouseEnter={playHover}
                        className={`w-full py-3 font-body font-bold rounded border transition-all ${inputMode
                            ? 'bg-blue-900/50 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(0,100,255,0.3)]'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                            }`}
                    >
                        {inputMode ? "⌨️ РЕЖИМ ВВОДА (ХАРДКОР)" : "🔘 ВЫБОР ВАРИАНТОВ"}
                    </button>

                    {/* Sudden Death Toggle */}
                    <button
                        onClick={() => { playClick(); setSuddenDeath(!suddenDeath); }}
                        onMouseEnter={playHover}
                        className={`w-full py-3 font-body font-bold rounded border transition-all ${suddenDeath
                            ? 'bg-red-900/50 border-st-red text-st-red shadow-[0_0_15px_rgba(255,0,0,0.3)] animate-pulse'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                            }`}
                    >
                        {suddenDeath ? "☠️ СУРОВАЯ СМЕРТЬ (ВКЛ)" : "СУРОВАЯ СМЕРТЬ (ВЫКЛ)"}
                    </button>

                    <p className="text-xs text-zinc-500 mt-2 font-mono">
                        {inputMode && "Вам придется вводить ответы вручную. "}
                        {suddenDeath && "Одна ошибка — и конец. "}
                    </p>
                </div>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHover}
                onClick={() => { playClick(); onStart({ season, suddenDeath, inputMode }); }}
                className="px-12 py-4 bg-transparent border-2 border-st-red text-st-red font-bold font-body text-2xl tracking-widest hover:bg-st-red hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            >
                НАЧАТЬ
            </motion.button>
        </div>
    );
};

export default StartScreen;
