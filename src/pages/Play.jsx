import area from '../assets/area.png'
import '../App.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bullet from '../components/Bullet'
import Zombie from '../components/Zombie'
import easyZombie from '../assets/easy.gif'
import mediumZombie from '../assets/medium.gif'
import hardZombie from '../assets/hard.gif'
import { generate } from 'random-words'
import gameOverSound from '../assets/GameOverSound.wav'
import { useGame } from '../context/GameSettingsContext'
import { isRtl } from '../translations'
import ripImage from '../assets/rip.png'
import zombieDeathSound from '../assets/zombie_deathSound.wav'
import HealthBar from '../components/HealthBar'
import ZombieEscapeSound from '../assets/ZombieEscapeSound.m4a'
import inccorectSound from '../assets/inccorect.wav'
import * as audio from '../audio'
import { useGameStats } from '../hooks/useGameStats'
import { saveScore } from '../leaderboard'

const RipImage = React.memo(({ x, y }) => (
    <img src={ripImage} width={'75px'} style={{
        position: 'absolute',
        top: y + 20 + '%',
        right: x + 3 + '%',
        zIndex: 1
    }} />
))

const Play = () => {
    const navigate = useNavigate()
    const { character, difficulity, zombiesCount, backgroundMusic, toggleBackground, language, t } = useGame()

    const [bullets, setBullets] = useState([])
    const [targetSelected, setTargetSelected] = useState(false)
    const [zombies, setZombies] = useState({})
    const [currentZombieId, SetCurrentZombieId] = useState(null)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isWinner, setIsWinner] = useState(false)
    const [started, setStarted] = useState(false)
    const [rips, setRips] = useState([])
    const [health, setHealth] = useState(100)

    const nameRef = useRef(null)
    const bulletIdRef = useRef(0)
    const ripIdRef = useRef(0)
    const currentZombieIdRef = useRef(null)
    const savedRef = useRef(false)

    // clock only ticks while actively typing a selected zombie
    const stats = useGameStats(started && targetSelected && !isGameOver && !isWinner)

    const BASE_DAMAGE = 50 / (zombiesCount ** 0.6)
    const DIFFICULITY_MULTIPLIER = 1 + ((difficulity * 4) - 1) * 0.25

    useEffect(() => { currentZombieIdRef.current = currentZombieId }, [currentZombieId])

    // preload every sound effect this screen uses
    useEffect(() => {
        audio.preload([gameOverSound, zombieDeathSound, ZombieEscapeSound, inccorectSound, character.fireEffect])
    }, [character.fireEffect])

    const zombieImages = [easyZombie, mediumZombie, hardZombie]

    // spawn the horde once
    useEffect(() => {
        const words = generate({
        exactly:zombiesCount,
        minLength: (difficulity == 1 ? 3 : (difficulity == 2 ? 4 : 5)),
        maxLength:(difficulity == 1 ? 5 : 6),
        wordsPerString: difficulity == 3 ? 2 : 1,

        })
        const uniqueWords = [...new Set(words)]
        const temp = {}
        
        const velocity = 4 + difficulity * 3 // %/sec: easy 7, medium 10, hard 13
        words.forEach((word, idx) => {
            const i = idx + 1
            const laneY = 42 + Math.random() * 30 
            const startX = -i * 12
            const distance = 100 - startX // % to travel
            const randomZombie = Math.floor(Math.random() * 3) + 1
            temp[i] = {
                id: i,
                speed: (distance / velocity) * 1000, 
                text: word.toString(),
                startY: laneY,
                startX,
                targetX: 100,
                targetY: laneY,
                currentX: startX,
                image: zombieImages[randomZombie - 1],
                progress: 0,
            }
        })
        setZombies(temp)
    }, [])

    const gameOver = useCallback(() => {
        setIsGameOver(true)
        audio.play(gameOverSound, 0.3)
        setZombies({})
    }, [])

    useEffect(() => {
        if (isGameOver || isWinner || !started) return
        if (health <= 0) { gameOver(); return }
        if (Object.keys(zombies).length === 0) setIsWinner(true)
    }, [zombies, health, started, isGameOver, isWinner, gameOver])

    const reduceHealth = useCallback((escapedId) => {
        audio.play(ZombieEscapeSound, 0.3)
        setHealth(prev => Math.max(0, prev - Math.floor(BASE_DAMAGE * DIFFICULITY_MULTIPLIER)))
        if (escapedId != null && escapedId === currentZombieIdRef.current) {
            setTargetSelected(false)
            SetCurrentZombieId(null)
        }
        setZombies(prev => {
            const copy = { ...prev }
            delete copy[escapedId]
            return copy
        })
    }, [BASE_DAMAGE, DIFFICULITY_MULTIPLIER])

    const changeZombieCurrentX = useCallback((id, x) => {
        setZombies(prev => {
            if (!prev[id]) return prev
            return { ...prev, [id]: { ...prev[id], currentX: x } }
        })
    }, [])

    const checkKillZombie = (zid) => {
        const cz = zombies[zid]
        if (!cz) return
        if (cz.progress === cz.text.length - 1) {
            stats.addKill()
            setZombies(prev => {
                const copy = { ...prev }
                delete copy[zid]
                return copy
            })
            audio.play(zombieDeathSound, 0.1)
            const rid = ripIdRef.current++
            setRips(prev => [...prev, { id: rid, x: cz.currentX, y: cz.startY }])
            setTargetSelected(false)
            SetCurrentZombieId(null)
        }
    }

    const fireAt = (target) => {
        setBullets(prev => [...prev, {
            startX: character.muzzelX,
            startY: character.muzzelY,
            targetX: target.currentX,
            targetY: target.targetY + 20,
            id: bulletIdRef.current++,
            zombieId: target.id,
        }])
        audio.play(character.fireEffect, 0.25)
        setZombies(prev => {
            if (!prev[target.id]) return prev
            return { ...prev, [target.id]: { ...prev[target.id], progress: prev[target.id].progress + 1 } }
        })
    }

    const captureType = e => {
        if (isGameOver || isWinner) return
        const letter = e.key.toLowerCase()
        if (letter.length !== 1) return 
        if (!started) setStarted(true)

        const currentZombie = targetSelected ? zombies[currentZombieId] : null

        if (currentZombie) {
            if (letter !== currentZombie.text.at(currentZombie.progress).toLowerCase()) {
                audio.play(inccorectSound, 0.5)
                stats.addMistake()
                return
            }
            fireAt(currentZombie)
            stats.addCorrect()
            checkKillZombie(currentZombieId)
            return
        }

        if (targetSelected) { setTargetSelected(false); SetCurrentZombieId(null) }

        const matching = Object.values(zombies).filter(z =>
            z.text.toLowerCase().at(0) === letter && z.currentX > -5 && z.currentX < 100)
        if (matching.length === 0) { stats.addMistake(); return }

        const target = matching.sort((a, b) => b.currentX - a.currentX)[0]
        fireAt(target)
        SetCurrentZombieId(target.id)
        setTargetSelected(true)
        stats.addCorrect()
        checkKillZombie(target.id)
    }

    useEffect(() => {
        if (isGameOver || isWinner) return
        window.addEventListener('keydown', captureType)
        return () => window.removeEventListener('keydown', captureType)
    }, [zombies, isGameOver, isWinner])

    const removeBullet = useCallback((id) => {
        setBullets(prev => prev.filter(b => b.id !== id))
    }, [])

    const handleSaveScore = e => {
        e.preventDefault()
        const name = nameRef.current?.value.trim()
        if (!name || savedRef.current) return
        savedRef.current = true
        const entry = saveScore({
            name,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            kills: stats.kills,
            mistakes: stats.mistakes,
            difficulty: difficulity,
            result: isWinner ? 'won' : 'lost',
        })
        navigate('/leaderboard', { state: { latestId: entry.id } })
    }

    const difficultyLabel = difficulity === 1 ? t('easy') : (difficulity === 2 ? t('medium') : t('hard'))

    return (
        <div
            dir={isRtl(language) ? 'rtl' : 'ltr'}
            style={{
                backgroundImage: `url(${area})`,
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
            <button
                className='z-20 flex items-center gap-2 px-6 py-3 text-lg font-bold uppercase tracking-wider text-red-100 bg-zinc-800 border-2 border-red-900 rounded-lg shadow-[0_6px_0_0_#450a0a] hover:shadow-[0_3px_0_0_#450a0a] hover:translate-y-1 active:shadow-[0_0px_0_0_#450a0a] active:translate-y-1.5 transition-all duration-150 hover:bg-zinc-700 font-mono'
                style={{ position: 'absolute', top: '4%', left: '4%' }}
                onClick={toggleBackground}
            >{backgroundMusic ? '🔊' : '🔇'}</button>

            <HealthBar health={health} />

            <div className="font-mono" style={{
                position: 'absolute', top: '4%', right: '6%',
                width: '210px', padding: '10px 14px',
                border: '3px solid #7f1d1d', borderRadius: '10px',
                background: 'rgba(24,24,27,0.85)', color: 'whitesmoke', zIndex: 20,
            }}>
                <StatRow label={t('difficulty')} value={difficultyLabel} />
                <StatRow label={t('wpm')} value={stats.wpm} />
                <StatRow label={t('accuracy')} value={`${stats.accuracy}%`} />
                <StatRow label={t('kills')} value={stats.kills} />
                <StatRow label={t('mistakes')} value={stats.mistakes} />
                <StatRow label={t('time')} value={`${Math.floor(stats.elapsed)}s`} />
            </div>

            <div className='character-container'>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                        src={character.fireImage}
                        width={'200px'}
                        height={'150px'}
                        className={`character-placement ${bullets.length > 0 ? 'firing' : ''}`}
                    />
                </div>
                {bullets.map(bullet => (
                    <Bullet
                        key={bullet.id}
                        startX={bullet.startX}
                        startY={bullet.startY}
                        targetX={bullet.targetX + 5}
                        targetY={bullet.targetY + 10}
                        onComplete={removeBullet}
                        bulletId={bullet.id}
                        bulletClass={character.name === 'stewie' ? 'bullet-stewie' : 'bullet-peter'}
                    />
                ))}
            </div>

            {Object.values(zombies).map(zombie => (
                <Zombie
                    key={zombie.id}
                    id={zombie.id}
                    zombie={zombie}
                    OnZombieEscape={reduceHealth}
                    onChangeX={changeZombieCurrentX}
                    zindexClass={zombie.id === currentZombieId}
                />
            ))}

            {rips.map(rip => (
                <RipImage key={rip.id} x={rip.x} y={rip.y} />
            ))}

            {(isGameOver || isWinner) && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10000,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '1.5rem', backgroundColor: 'rgba(0,0,0,0.85)'
                }}>
                    <h1 className="text-6xl font-mono font-bold uppercase tracking-widest text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                        🩸 {isGameOver ? t('gameOver') : t('youWon')} 🩸
                    </h1>

                    <div className="font-mono text-red-100 text-xl flex gap-8 flex-wrap justify-center">
                        <span>{t('wpm')}: <b className="text-red-400">{stats.wpm}</b></span>
                        <span>{t('accuracy')}: <b className="text-red-400">{stats.accuracy}%</b></span>
                        <span>{t('kills')}: <b className="text-red-400">{stats.kills}</b></span>
                        <span>{t('mistakes')}: <b className="text-red-400">{stats.mistakes}</b></span>
                    </div>

                    <form onSubmit={handleSaveScore} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <input
                            className="px-4 py-3 text-lg font-mono text-red-100 bg-zinc-900 border-2 border-red-900 rounded-lg outline-none focus:border-red-500"
                            type="text"
                            ref={nameRef}
                            placeholder={t('namePlaceholder')}
                            maxLength={22}
                            autoComplete="off"
                            spellCheck="false"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 text-lg font-bold uppercase tracking-wider text-red-100 bg-zinc-800 border-2 border-red-900 rounded-lg hover:bg-zinc-700 transition-all duration-150 font-mono"
                        >
                            🏆 {t('leaderboard')}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/gameSettings')}
                        className="px-10 py-4 text-2xl font-bold uppercase tracking-widest text-red-100 bg-zinc-800 border-4 border-red-900 rounded-lg hover:bg-zinc-700 transition-all duration-150 font-mono"
                    >
                        🎮 {t('playAgain')} 🎮
                    </button>
                </div>
            )}
        </div>
    )
}

const StatRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '2px 0' }}>
        <span style={{ color: '#f87171', textTransform: 'uppercase', fontSize: '0.8rem' }}>{label}</span>
        <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
)

export default Play
