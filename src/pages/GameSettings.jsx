import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameSettingsContext';
import { isRtl } from '../translations';
import gameSettingsBg from '../assets/GameSettingsBg.webp';

const DIFFICULTIES = [
    { labelKey: 'easy', value: 1, descKey: 'easyDesc', icon: '🧟' },
    { labelKey: 'medium', value: 2, descKey: 'mediumDesc', icon: '🧟‍♂️' },
    { labelKey: 'hard', value: 3, descKey: 'hardDesc', icon: '💀' }
];

const ZOMBIE_COUNTS = [5, 10, 15, 20];

const GameSettings = () => {
    const navigate = useNavigate();
    const { difficulity, setDifficulty, zombiesCount, setZombieCount, language, setLanguage, t } = useGame();

    const [selectedDifficulty, setSelectedDifficulty] = useState(difficulity || 1);
    const [selectedCount, setSelectedCount] = useState(zombiesCount || 10);

    const goBack = () => navigate('/');

    const playGame = () => {
        setDifficulty(selectedDifficulty);
        setZombieCount(selectedCount);
        navigate('/play');
    };

    return (
        <div
            dir={isRtl(language) ? 'rtl' : 'ltr'}
            style={{
                backgroundImage: `url(${gameSettingsBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div className="absolute inset-0 bg-black/50" />

            <button
                onClick={goBack}
                className="absolute top-8 left-8 z-20 flex items-center gap-2 px-6 py-3 text-lg font-bold uppercase tracking-wider text-red-100 bg-zinc-800 border-2 border-red-900 rounded-lg shadow-[0_6px_0_0_#450a0a] hover:shadow-[0_3px_0_0_#450a0a] hover:translate-y-1 active:shadow-[0_0px_0_0_#450a0a] active:translate-y-1.5 transition-all duration-150 hover:bg-zinc-700 font-mono"
            >
                ← {t('back')}
            </button>

            <h1 className="relative z-10 text-5xl font-mono font-bold uppercase tracking-widest text-red-600 mb-12 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                🩸 {t('title')} 🩸
            </h1>

            <div className="relative z-10 flex gap-10 flex-wrap justify-center max-w-8xl px-6">
                <div className="bg-zinc-900/80 border-4 border-red-900 rounded-2xl p-6 w-80 shadow-[0_0_20px_rgba(127,29,29,0.6)]">
                    <h2 className="text-2xl font-mono font-bold uppercase text-red-500 mb-4 text-center tracking-wide">
                        {t('language')}
                    </h2>
                    <div className="flex flex-col gap-3">
                    {
                        [{name:'English',name_sm:'en'},{name:'Persian',name_sm:'fs'},{name:'Pashto',name_sm:'ps'}].map((lang) => {
                            return (
                                
                                 <div
                                key={lang.name_sm}
                                onClick={() => setLanguage(lang.name_sm)}
                                className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 font-mono ${
                                    language === lang.name_sm
                                        ? 'border-purple-500 bg-purple-900/40 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                                        : 'border-zinc-700 bg-zinc-800/60 opacity-70 hover:opacity-100 hover:border-zinc-500'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xl text-red-100 font-bold">
                                         {lang.name}
                                    </span>
                                    </div>
                                </div>

                            )
                        })
                    }
                        
                    
                   
                    
                    </div>
                </div>
                <div className="bg-zinc-900/80 border-4 border-red-900 rounded-2xl p-6 w-80 shadow-[0_0_20px_rgba(127,29,29,0.6)]">
                    <h2 className="text-2xl font-mono font-bold uppercase text-red-500 mb-4 text-center tracking-wide">
                    {t('difficulty')}
                    </h2>

                    <div className="flex flex-col gap-3">
                        {DIFFICULTIES.map((d) => (
                            <div
                                key={d.value}
                                onClick={() => setSelectedDifficulty(d.value)}
                                className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 font-mono ${
                                    selectedDifficulty === d.value
                                        ? 'border-purple-500 bg-purple-900/40 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                                        : 'border-zinc-700 bg-zinc-800/60 opacity-70 hover:opacity-100 hover:border-zinc-500'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xl text-red-100 font-bold">
                                        {d.icon} {t(d.labelKey)}

                                    </span>
                                    {selectedDifficulty === d.value && (
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-sm text-zinc-400 mt-1">{t(d.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900/80 border-4 border-red-900 rounded-2xl p-6 w-80 shadow-[0_0_20px_rgba(127,29,29,0.6)]">
                    <h2 className="text-2xl font-mono font-bold uppercase text-red-500 mb-4 text-center tracking-wide">
                     {t('hordeSize')}

                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {ZOMBIE_COUNTS.map((count) => (
                            <div
                                key={count}
                                onClick={() => setSelectedCount(count)}
                                className={`cursor-pointer rounded-xl p-5 border-2 text-center transition-all duration-200 font-mono ${
                                    selectedCount === count
                                        ? 'border-purple-500 bg-purple-900/40 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                                        : 'border-zinc-700 bg-zinc-800/60 opacity-70 hover:opacity-100 hover:border-zinc-500'
                                }`}
                            >
                                <div className="text-3xl font-bold text-red-100">{count}</div>
                                <div className="text-xs text-zinc-400 uppercase tracking-wide mt-1">{t('zombies')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10 pt-14">
                <button
                    onClick={playGame}
                    className="relative px-12 py-5 text-3xl font-bold uppercase tracking-widest text-red-100 bg-zinc-800 border-4 border-red-900 rounded-lg shadow-[0_10px_0_0_#450a0a,inset_0_-4px_0_0_#450a0a] hover:shadow-[0_5px_0_0_#450a0a,inset_0_-4px_0_0_#450a0a] hover:translate-y-1 transition-all duration-150 hover:bg-zinc-700 active:shadow-[0_0px_0_0_#450a0a,inset_0_-4px_0_0_#450a0a] active:translate-y-2 font-mono group"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20 rounded-lg"></span>
                    <span className="absolute -top-1 left-1/4 w-1 h-3 bg-red-700 rounded-b-full animate-pulse"></span>
                    <span className="absolute -bottom-1 right-1/3 w-1.5 h-4 bg-red-800 rounded-b-full animate-pulse delay-150"></span>
                    <span className="absolute -top-2 right-1/4 w-0.5 h-5 bg-red-600 rounded-b-full animate-pulse delay-300"></span>
                    <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
                        🎮 {t('playGame')} 🎮
                    </span>
                </button>
            </div>
        </div>
    );
};

export default GameSettings;