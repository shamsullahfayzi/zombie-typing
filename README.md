# Zombie Typing

**A typing game where every zombie carries a word — type it before it reaches you.**
Pick a character and a difficulty, hold off the horde, and climb the WPM leaderboard. Plays in English, Dari or Pashto, with a full right-to-left layout.

![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)

<!-- Add a gameplay GIF here -->
<!-- **▶ Play:** https://your-site.netlify.app -->

---

## Gameplay

- Zombies walk in across random lanes, each labelled with a word. Type it to fire and take it down
- Zombies that get through cost health; reach zero and it's game over. Clear the horde to win
- **Three difficulties** change zombie speed (7 / 10 / 13 % of the screen per second) and word length — hard mode sends two-word phrases
- Two playable characters, each with its own firing animation and sound
- Live stats: **WPM**, accuracy, kills, mistakes
- Save your score to a **leaderboard** (top 50, sorted by WPM)

## Engineering highlights

- **Audio pool:** each sound effect gets a pool of 4 `Audio` elements, so rapid-fire shots overlap instead of cutting each other off. Playback unlocks on the first user gesture to satisfy browser autoplay rules, and background music can be muted
- **Fair stats:** WPM uses the standard 5-characters-per-word measure over correct characters only; accuracy is correct characters ÷ keystrokes (`useGameStats` hook)
- **Localization:** English, Dari and Pashto UI strings with automatic RTL for Dari and Pashto
- **Defensive persistence:** the leaderboard survives malformed or blocked `localStorage` without crashing
- **Optimized assets:** images in WebP; audio files compressed
- **Deploy-ready:** `public/_redirects` gives client-side routing a SPA fallback on Netlify

## Project structure

```
src/
  pages/        GameSettings · Characters · Play · Leaderboard
  components/   Zombie · Bullet · HealthBar · CharacterCard · SaveScore
  context/      GameSettingsContext (difficulty, language, character)
  hooks/        useGameStats (WPM, accuracy, kills)
  audio.js      pooled sound effects + music
  leaderboard.js
  translations.js
```

## Run it

```bash
git clone https://github.com/shamsullahfayzi/zombie-typing.git
cd zombie-typing
npm install
npm run dev
```

Words are generated with [`random-words`](https://www.npmjs.com/package/random-words).

## Author

**Shamsullah Fayzi** · [GitHub](https://github.com/shamsullahfayzi)
