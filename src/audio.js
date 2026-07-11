

const POOL_SIZE = 4
const pools = new Map() // url -> { els: HTMLAudioElement[], idx: number }
let unlocked = false

function getPool(url) {
    let pool = pools.get(url)
    if (!pool) {
        const els = Array.from({ length: POOL_SIZE }, () => {
            const el = new Audio(url)
            el.preload = 'auto'
            return el
        })
        pool = { els, idx: 0 }
        pools.set(url, pool)
    }
    return pool
}

export function preload(urls) {
    urls.forEach(url => { if (url) getPool(url) })
}

export function play(url, volume = 1) {
    if (!url) return
    const pool = getPool(url)
    const el = pool.els[pool.idx]
    pool.idx = (pool.idx + 1) % pool.els.length
    try {
        el.currentTime = 0
        el.volume = volume
        el.play().catch(() => {})
    } catch { /* ignore */ }
}

let music = null

export function initMusic(url, volume = 0.3) {
    if (!music) {
        music = new Audio(url)
        music.loop = true
        music.volume = volume
        music.preload = 'auto'
    }
}

export function setMusicMuted(muted) {
    if (music) music.muted = muted
}

export function tryStartMusic() {
    if (music && unlocked && !music.muted) music.play().catch(() => {})
}

export function unlock() {
    if (unlocked) return
    unlocked = true
    pools.forEach(pool => pool.els.forEach(el => {
        el.muted = true
        el.play().then(() => {
            el.pause()
            el.currentTime = 0
            el.muted = false
        }).catch(() => { el.muted = false })
    }))
    tryStartMusic()
}

export function installUnlockHandlers() {
    const handler = () => unlock()
    window.addEventListener('keydown', handler, { once: true })
    window.addEventListener('pointerdown', handler, { once: true })
}
