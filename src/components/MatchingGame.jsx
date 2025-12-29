import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick, playHover } from '../utils/sfx';
import { Check, X, Shuffle } from 'lucide-react';
import { characterActors } from '../data/actors';

// Shuffle array helper
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Generate avatar URL for characters (red themed initials)
const getCharacterAvatar = (name) => {
    const encoded = encodeURIComponent(name.split('/')[0].trim());
    return `https://ui-avatars.com/api/?name=${encoded}&background=7f1d1d&color=fca5a5&size=48&bold=true&format=svg`;
};

// Generate avatar URL for actors (dark themed initials - no fake faces)
const getActorAvatar = (name) => {
    const encoded = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encoded}&background=27272a&color=a1a1aa&size=48&bold=true&format=svg`;
};

const MatchingGame = ({ onExit }) => {
    const [pairs, setPairs] = useState([]);
    const [shuffledActors, setShuffledActors] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [matches, setMatches] = useState({});
    const [wrongMatch, setWrongMatch] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const selectedPairs = shuffleArray(characterActors).slice(0, 8);
        setPairs(selectedPairs);
        setShuffledActors(shuffleArray(selectedPairs.map(p => p.actor)));
        setSelectedCharacter(null);
        setMatches({});
        setWrongMatch(null);
        setIsComplete(false);
        setScore(0);
        setAttempts(0);
    };

    const handleCharacterClick = (character) => {
        if (matches[character]) return;
        playClick();
        setSelectedCharacter(character);
        setWrongMatch(null);
    };

    const handleActorClick = (actor) => {
        if (!selectedCharacter) return;
        if (Object.values(matches).includes(actor)) return;

        playClick();
        setAttempts(prev => prev + 1);

        const correctPair = pairs.find(p => p.character === selectedCharacter);

        if (correctPair && correctPair.actor === actor) {
            // Correct match
            const newMatches = { ...matches, [selectedCharacter]: actor };
            setMatches(newMatches);
            setScore(prev => prev + 1);
            setSelectedCharacter(null);

            // Check if complete
            if (Object.keys(newMatches).length === pairs.length) {
                setIsComplete(true);
            }
        } else {
            // Wrong match
            setWrongMatch({ character: selectedCharacter, actor });
            setTimeout(() => {
                setWrongMatch(null);
                setSelectedCharacter(null);
            }, 800);
        }
    };

    const getCharacterStyle = (character) => {
        if (matches[character]) {
            return "bg-green-900/60 border-green-500 text-green-400 cursor-default";
        }
        if (wrongMatch?.character === character) {
            return "bg-red-900/60 border-red-500 text-red-400";
        }
        if (selectedCharacter === character) {
            return "bg-st-red/30 border-st-red text-white ring-2 ring-st-red";
        }
        return "bg-zinc-800/80 border-zinc-700 text-white hover:border-st-red hover:bg-zinc-700 cursor-pointer";
    };

    const getActorStyle = (actor) => {
        if (Object.values(matches).includes(actor)) {
            return "bg-green-900/60 border-green-500 text-green-400 cursor-default";
        }
        if (wrongMatch?.actor === actor) {
            return "bg-red-900/60 border-red-500 text-red-400";
        }
        if (!selectedCharacter) {
            return "bg-zinc-800/80 border-zinc-700 text-zinc-500 cursor-not-allowed";
        }
        return "bg-zinc-800/80 border-zinc-700 text-white hover:border-blue-500 hover:bg-zinc-700 cursor-pointer";
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 z-20 relative min-h-screen flex flex-col justify-center">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-st-red font-title mb-2">
                    АКТЁРЫ И РОЛИ
                </h1>
                <p className="text-zinc-400 text-lg">
                    Сопоставь персонажей с актёрами
                </p>
                <div className="flex justify-center gap-8 mt-4 text-sm">
                    <span className="text-green-400">✓ Совпадений: {score}/{pairs.length}</span>
                    <span className="text-zinc-400">Попыток: {attempts}</span>
                </div>
            </div>

            {!isComplete ? (
                <div className="grid grid-cols-2 gap-8">
                    {/* Characters Column */}
                    <div className="space-y-3">
                        <h3 className="text-center text-zinc-500 uppercase tracking-widest text-sm mb-4">
                            Персонажи
                        </h3>
                        {pairs.map((pair) => (
                            <motion.button
                                key={pair.character}
                                whileHover={!matches[pair.character] ? { scale: 1.02 } : {}}
                                whileTap={!matches[pair.character] ? { scale: 0.98 } : {}}
                                onClick={() => handleCharacterClick(pair.character)}
                                onMouseEnter={!matches[pair.character] ? playHover : undefined}
                                className={`
                                    w-full p-3 rounded border-2 text-left font-medium
                                    transition-all duration-200 flex items-center gap-3
                                    ${getCharacterStyle(pair.character)}
                                `}
                            >
                                <img
                                    src={getCharacterAvatar(pair.character)}
                                    alt=""
                                    className="w-10 h-10 rounded-full border-2 border-current"
                                />
                                <span className="flex-1">{pair.character}</span>
                                {matches[pair.character] && <Check className="text-green-400" size={20} />}
                            </motion.button>
                        ))}
                    </div>

                    {/* Actors Column */}
                    <div className="space-y-3">
                        <h3 className="text-center text-zinc-500 uppercase tracking-widest text-sm mb-4">
                            Актёры
                        </h3>
                        {shuffledActors.map((actor) => (
                            <motion.button
                                key={actor}
                                whileHover={selectedCharacter && !Object.values(matches).includes(actor) ? { scale: 1.02 } : {}}
                                whileTap={selectedCharacter && !Object.values(matches).includes(actor) ? { scale: 0.98 } : {}}
                                onClick={() => handleActorClick(actor)}
                                onMouseEnter={selectedCharacter && !Object.values(matches).includes(actor) ? playHover : undefined}
                                className={`
                                    w-full p-3 rounded border-2 text-left font-medium
                                    transition-all duration-200 flex items-center gap-3
                                    ${getActorStyle(actor)}
                                `}
                            >
                                <img
                                    src={getActorAvatar(actor)}
                                    alt=""
                                    className="w-10 h-10 rounded-full border-2 border-current object-cover"
                                />
                                <span className="flex-1">{actor}</span>
                                {Object.values(matches).includes(actor) && <Check className="text-green-400" size={20} />}
                            </motion.button>
                        ))}
                    </div>
                </div>
            ) : (
                /* Completion Screen */
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-6xl mb-6">🎉</div>
                    <h2 className="text-4xl font-bold text-green-400 mb-4">ОТЛИЧНО!</h2>
                    <p className="text-2xl text-white mb-2">
                        Все пары найдены!
                    </p>
                    <p className="text-zinc-400 mb-8">
                        Попыток: {attempts} | Точность: {Math.round((score / attempts) * 100)}%
                    </p>
                    <div className="flex justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startNewGame}
                            onMouseEnter={playHover}
                            className="px-8 py-3 bg-st-red text-white font-bold uppercase tracking-widest rounded hover:bg-red-700 transition-colors"
                        >
                            <Shuffle className="inline mr-2" size={18} />
                            Ещё раз
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onExit}
                            onMouseEnter={playHover}
                            className="px-8 py-3 bg-zinc-800 text-white font-bold uppercase tracking-widest rounded hover:bg-zinc-700 transition-colors border border-zinc-600"
                        >
                            В меню
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Exit Button */}
            {!isComplete && (
                <div className="text-center mt-8">
                    <button
                        onClick={onExit}
                        onMouseEnter={playHover}
                        className="text-zinc-500 hover:text-white transition-colors uppercase tracking-widest text-sm"
                    >
                        ← Вернуться в меню
                    </button>
                </div>
            )}

            {/* Instructions */}
            {!isComplete && !selectedCharacter && Object.keys(matches).length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-6 text-zinc-500 text-sm"
                >
                    💡 Выберите персонажа слева, затем актёра справа
                </motion.div>
            )}
        </div>
    );
};

export default MatchingGame;
