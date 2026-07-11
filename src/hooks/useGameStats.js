import { useCallback, useEffect, useRef, useState } from 'react'

// Live typing stats. The clock runs only while `active` is true and freezes
// (does not reset) when it goes false, so the final numbers stay on the
// game-over / win screen.
export function useGameStats(active) {
    const [elapsed, setElapsed] = useState(0) // seconds, live
    const [correctChars, setCorrectChars] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [kills, setKills] = useState(0)
    const lastTickRef = useRef(null)

    // Accumulate elapsed ONLY while active (a zombie is being typed). Idle time
    // between words is not counted, so WPM reflects real typing, not standing still.
    useEffect(() => {
        if (!active) { lastTickRef.current = null; return }
        lastTickRef.current = performance.now()
        const id = setInterval(() => {
            const now = performance.now()
            const delta = (now - lastTickRef.current) / 1000
            lastTickRef.current = now
            setElapsed(e => e + delta)
        }, 250)
        return () => clearInterval(id)
    }, [active])

    const addCorrect = useCallback(() => setCorrectChars(c => c + 1), [])
    const addMistake = useCallback(() => setMistakes(m => m + 1), [])
    const addKill = useCallback(() => setKills(k => k + 1), [])

    const minutes = elapsed / 60
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0
    const strokes = correctChars + mistakes
    const accuracy = strokes > 0 ? Math.round((correctChars / strokes) * 100) : 100

    return { elapsed, wpm, accuracy, correctChars, mistakes, kills, addCorrect, addMistake, addKill }
}
