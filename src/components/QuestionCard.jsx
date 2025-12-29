import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick, playHover } from '../utils/sfx';
import { Check, X } from 'lucide-react';
import { isFuzzyMatch } from '../utils/textUtils';

const QuestionCard = ({ questionData, onAnswer, onNext, inputMode }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Use prop inputMode or fall back to question type
    const shouldUseInputMode = inputMode || questionData.type === 'input';

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (isRevealed || !inputValue.trim()) return;

        const isCorrect = isFuzzyMatch(inputValue, questionData.answer);

        setIsRevealed(true);
        // Pass the actual typed value for result review if needed, or just the correct answer text
        onAnswer(isCorrect, inputValue);
    };

    const handleSelect = (option) => {
        if (isRevealed) return;
        setSelectedOption(option);
        setIsRevealed(true);
        onAnswer(option === questionData.answer, option);
    };

    // Reset input when question changes
    useEffect(() => {
        setInputValue("");
        setIsRevealed(false);
        setSelectedOption(null);
    }, [questionData]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 z-20 relative flex flex-col justify-center min-h-[60vh]">
            <div className="bg-zinc-900/90 border-t-2 border-b-2 border-st-red rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-sm overflow-hidden">

                {/* Season Poster Banner */}
                <div className="relative h-40 md:h-52 overflow-hidden">
                    <img
                        src={`${import.meta.env.BASE_URL}images/season${questionData.season}.jpg`}
                        alt={`Сезон ${questionData.season}`}
                        className="w-full h-full object-cover object-center opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-zinc-900"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
                    {/* Season indicator */}
                    <div className="absolute top-3 right-4 bg-black/60 px-3 py-1 rounded text-st-red text-sm font-bold uppercase tracking-widest border border-st-red/30">
                        Сезон {questionData.season}
                    </div>
                </div>

                <div className="p-8 md:p-12 pt-4">
                    {/* Text Only Layout - Centered & Impactful */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.h2
                            key={questionData.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-bold text-white leading-tight font-serif tracking-wide drop-shadow-md"
                        >
                            {questionData.question}
                        </motion.h2>
                        <div className="h-1 w-24 bg-st-red mt-6"></div>
                    </div>

                    {/* INPUT MODE VS STANDARD MODE */}
                    {shouldUseInputMode ? (
                        <div className="w-full flex flex-col items-center">
                            {!isRevealed ? (
                                <form onSubmit={handleInputSubmit} className="w-full max-w-xl flex flex-col gap-4">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Введите ваш ответ..."
                                        className="w-full bg-black/50 border-2 border-zinc-700 text-white text-2xl p-4 text-center focus:border-st-red outline-none transition-all placeholder:text-zinc-700 font-serif"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 hover:bg-st-red hover:text-white transition-colors"
                                        disabled={!inputValue.trim()}
                                    >
                                        Принять Ответ
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center">
                                    {/* Validation Result */}
                                    {isFuzzyMatch(inputValue, questionData.answer) ? (
                                        <div className="mb-6">
                                            <div className="text-green-500 font-bold text-3xl mb-2 flex items-center justify-center gap-2">
                                                <Check size={40} /> ВЕРНО!
                                            </div>
                                            <div className="text-zinc-400 mb-1">Вы ответили: {inputValue}</div>
                                            <div className="text-white text-lg">Полный ответ: <span className="text-green-400">{questionData.answer}</span></div>
                                        </div>
                                    ) : (
                                        <div className="mb-6">
                                            <div className="text-red-500 font-bold text-3xl mb-2 flex items-center justify-center gap-2">
                                                <X size={40} /> ОШИБКА
                                            </div>
                                            <div className="text-zinc-500 line-through mb-1">{inputValue}</div>
                                            <div className="text-white text-2xl">Правильный ответ: <span className="text-st-red">{questionData.answer}</span></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {questionData.options.map((option, idx) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = option === questionData.answer;
                                const showResult = isRevealed;

                                let buttonStyle = "bg-black/40 border-zinc-700 text-zinc-300 hover:bg-st-red/20 hover:border-st-red hover:text-white";

                                if (showResult) {
                                    if (isCorrect) buttonStyle = "bg-green-900/80 border-green-500 text-white opacity-100";
                                    else if (isSelected && !isCorrect) buttonStyle = "bg-red-900/80 border-red-500 text-white opacity-100";
                                    else buttonStyle = "bg-black/60 border-zinc-800 text-zinc-600 opacity-50";
                                }

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleSelect(option)}
                                        disabled={isRevealed}
                                        className={`
                                        relative w-full text-left p-6 border transition-all duration-200
                                        text-xl font-medium tracking-wide group overflow-hidden
                                        ${buttonStyle}
                                    `}
                                        onMouseEnter={!isRevealed ? playHover : null}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="flex items-center">
                                                <span className={`
                                                flex items-center justify-center w-8 h-8 mr-4 text-sm font-bold border
                                                ${showResult && isCorrect ? 'border-green-400 text-green-400' :
                                                        showResult && isSelected ? 'border-red-400 text-red-400' :
                                                            'border-zinc-500 text-zinc-500 group-hover:border-st-red group-hover:text-st-red'
                                                    }
                                                rounded-full
                                            `}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                {option}
                                            </span>
                                            {showResult && isCorrect && <Check className="text-green-400" />}
                                            {showResult && isSelected && !isCorrect && <X className="text-red-400" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Result Section (Common) */}
                    <AnimatePresence>
                        {isRevealed && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 border-t border-zinc-800 pt-6 overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-left flex-1">
                                        <h4 className="text-st-red font-bold uppercase tracking-widest text-sm mb-2">Знаете ли вы?</h4>
                                        <p className="text-zinc-300 leading-relaxed font-serif text-lg">
                                            {questionData.fact}
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setInputValue(""); // Clear input on next
                                            setIsRevealed(false);
                                            setSelectedOption(null);
                                            onNext();
                                        }}
                                        onMouseEnter={playHover} // Added onMouseEnter here
                                        className="shrink-0 px-8 py-3 bg-white text-black font-bold text-xl uppercase tracking-widest hover:bg-st-red hover:text-white transition-colors border-2 border-transparent hover:border-st-red"
                                    >
                                        ДАЛЕЕ
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
