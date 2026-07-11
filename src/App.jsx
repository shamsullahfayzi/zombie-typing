import { BrowserRouter, Routes, Route } from "react-router-dom"
import Characters from "./pages/Characters"
import Play from "./pages/Play"
import GameSettings from "./pages/GameSettings"
import Leaderboard from "./pages/Leaderboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Characters />} />
        <Route path="/gameSettings" element={<GameSettings />} />
        <Route path='/play' element={<Play />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
