import React from 'react';
import { motion } from 'framer-motion';

const ResultScreen = ({ score, total, wrongAnswers = [], onRestart }) => {
    const percentage = total > 0 ? (score / total) * 100 : 0;

    let title, message, colorClass;
    if (percentage === 100) {
        title = "ГЕРОЙ ХОУКИНСА";
        message = "Ты справился! Ты готов сразиться с Векной.";
        colorClass = "text-yellow-500 from-yellow-300 to-yellow-600";
    } else if (percentage >= 70) {
        title = "НЯНЬКА СТИВА";
        message = "Неплохо! Ты можешь защитить детей.";
        colorClass = "text-blue-400 from-blue-300 to-blue-600";
    } else {
        title = "ПУСТОЗВОН";
        message = "Друзья не лгут... тебе нужно пересмотреть сериал.";
        colorClass = "text-gray-500 from-gray-300 to-gray-600";
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center z-10 relative px-4 py-12">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="mb-8"
            >
                <span className="font-body text-st-red tracking-widest text-lg mb-2 block">ФИНАЛЬНЫЙ СЧЕТ</span>
                <h1 className="font-title text-8xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    {score}<span className="text-4xl text-gray-400">/{total}</span>
                </h1>
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className={`font-title text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-b ${colorClass}`}>
                    {title}
                </h2>
                <p className="font-serif text-slate-300 text-xl max-w-md mx-auto mb-10">
                    {message}
                </p>
            </motion.div>

            {/* Mistake Review Section */}
            {wrongAnswers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="w-full max-w-3xl bg-zinc-900/90 border border-zinc-800 rounded-lg p-6 mb-10 text-left overflow-hidden"
                >
                    <h3 className="text-st-red font-bold uppercase tracking-widest mb-6 text-center border-b border-zinc-800 pb-2">Работа над ошибками</h3>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {wrongAnswers.map((item, idx) => (
                            <div key={idx} className="bg-black/40 p-4 rounded border border-zinc-800">
                                <p className="text-white font-serif text-lg mb-3">{item.question}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                                    <div className="text-red-400">
                                        <span className="font-bold block text-xs uppercase text-zinc-500 mb-1">Ваш ответ:</span>
                                        ❌ {item.yourAnswer}
                                    </div>
                                    <div className="text-green-400">
                                        <span className="font-bold block text-xs uppercase text-zinc-500 mb-1">Правильный ответ:</span>
                                        ✅ {item.answer}
                                    </div>
                                </div>
                                <p className="text-zinc-400 text-sm italic border-t border-zinc-800 pt-2 mt-2">
                                    <span className="text-st-red not-italic font-bold mr-1">Факт:</span> {item.fact}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                className="px-8 py-3 bg-st-red text-white font-bold font-body text-xl tracking-widest hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            >
                ПОПРОБОВАТЬ СНОВА
            </motion.button>
        </div>
    );
};

export default ResultScreen;
