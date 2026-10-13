import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameSettingsContext'
import { isRtl } from '../translations'
import { getScores, clearScores } from '../leaderboard'
import gameSettingsBg from '../assets/GameSettingsBg.webp'

const MEDALS = ['🥇', '🥈', '🥉']

const DIFFICULTY_BADGE = {
    1: { key: 'easy', cls: 'bg-green-900/60 border-green-500 text-green-200' },
    2: { key: 'medium', cls: 'bg-yellow-900/60 border-yellow-500 text-yellow-200' },
    3: { key: 'hard', cls: 'bg-red-900/60 border-red-500 text-red-200' },
}

const Leaderboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { language, t } = useGame()
    const latestId = location.state?.latestId
    const [scores, setScores] = useState(() => getScores())

    const handleClear = () => {
        clearScores()
        setScores([])
    }

    return (
        <div
            dir={isRtl(language) ? 'rtl' : 'ltr'}
            style={{
                backgroundImage: `url(${gameSettingsBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '3rem 1rem',
            }}
        >
            <div className="absolute inset-0 bg-black/70" />

            <h1 className="relative z-10 text-5xl font-mono font-bold uppercase tracking-widest text-red-600 mb-8 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                🏆 {t('leaderboard')} 🏆
            </h1>

            <div className="relative z-10 w-full max-w-4xl bg-zinc-900/85 border-4 border-red-900 rounded-2xl p-4 shadow-[0_0_20px_rgba(127,29,29,0.6)]">
                {scores.length === 0 ? (
                    <p className="text-center text-zinc-300 font-mono text-xl py-16">{t('noScores')}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full font-mono text-red-100 border-collapse">
                            <thead>
                                <tr className="text-red-400 uppercase text-sm tracking-wider border-b-2 border-red-900">
                                    <th className="py-3 px-2 text-center">{t('rank')}</th>
                                    <th className="py-3 px-2 text-start">{t('name')}</th>
                                    <th className="py-3 px-2 text-center">{t('wpm')}</th>
                                    <th className="py-3 px-2 text-center">{t('accuracy')}</th>
                                    <th className="py-3 px-2 text-center">{t('kills')}</th>
                                    <th className="py-3 px-2 text-center">{t('mistakes')}</th>
                                    <th className="py-3 px-2 text-center">{t('difficulty')}</th>
                                    <th className="py-3 px-2 text-center">{t('result')}</th>
                                    <th className="py-3 px-2 text-center">{t('date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((s, i) => {
                                    const badge = DIFFICULTY_BADGE[s.difficulty] ?? DIFFICULTY_BADGE[1]
                                    const isLatest = s.id === latestId
                                    return (
                                        <tr
                                            key={s.id}
                                            className={`border-b border-zinc-800 transition-colors ${
                                                isLatest ? 'bg-purple-900/40 ring-2 ring-purple-500' : 'hover:bg-zinc-800/50'
                                            }`}
                                        >
                                            <td className="py-3 px-2 text-center text-xl font-bold">
                                                {MEDALS[i] ?? i + 1}
                                            </td>
                                            <td className="py-3 px-2 text-start font-bold truncate max-w-[10rem]">{s.name}</td>
                                            <td className="py-3 px-2 text-center text-2xl font-bold text-red-400">{s.wpm}</td>
                                            <td className="py-3 px-2 text-center">{s.accuracy}%</td>
                                            <td className="py-3 px-2 text-center">{s.kills}</td>
                                            <td className="py-3 px-2 text-center">{s.mistakes}</td>
                                            <td className="py-3 px-2 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded border text-xs uppercase ${badge.cls}`}>
                                                    {t(badge.key)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className={s.result === 'won' ? 'text-green-400' : 'text-red-400'}>
                                                    {s.result === 'won' ? t('won') : t('lost')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-center text-xs text-zinc-400">
                                                {new Date(s.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="relative z-10 flex gap-4 flex-wrap justify-center pt-8">
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 text-xl font-bold uppercase tracking-widest text-red-100 bg-zinc-800 border-4 border-red-900 rounded-lg hover:bg-zinc-700 transition-all duration-150 font-mono"
                >
                    🏠 {t('home')}
                </button>
                <button
                    onClick={() => navigate('/gameSettings')}
                    className="px-8 py-4 text-xl font-bold uppercase tracking-widest text-red-100 bg-zinc-800 border-4 border-red-900 rounded-lg hover:bg-zinc-700 transition-all duration-150 font-mono"
                >
                    🎮 {t('playAgain')}
                </button>
                {scores.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="px-8 py-4 text-xl font-bold uppercase tracking-widest text-red-100 bg-zinc-800 border-4 border-zinc-600 rounded-lg hover:bg-zinc-700 transition-all duration-150 font-mono"
                    >
                        🗑️ {t('clear')}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Leaderboard
