// Local leaderboard persistence. Global board, sorted by WPM desc, capped.
const KEY = 'zombie-typing-scores'
const MAX = 50

export function getScores() {
    try {
        const raw = localStorage.getItem(KEY)
        const arr = raw ? JSON.parse(raw) : []
        return Array.isArray(arr) ? arr : []
    } catch {
        return []
    }
}

// record: { name, wpm, accuracy, kills, mistakes, difficulty, result }
export function saveScore(record) {
    const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: new Date().toISOString(),
        ...record,
    }
    const scores = getScores()
    scores.push(entry)
    scores.sort((a, b) => b.wpm - a.wpm)
    const trimmed = scores.slice(0, MAX)
    try {
        localStorage.setItem(KEY, JSON.stringify(trimmed))
    } catch { /* storage full / blocked */ }
    return entry
}

export function clearScores() {
    try {
        localStorage.removeItem(KEY)
    } catch { /* ignore */ }
}
