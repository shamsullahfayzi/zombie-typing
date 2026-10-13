import { createContext, useContext, useEffect, useState } from "react";
import stewie from '../assets/angry_stewie.webp'
import stewieFireEffect from '../assets/stewie_fire_sound.mp3'
import stewieFireImage from '../assets/angry_stewie.webp'
import { translations } from '../translations'
import backgroundSound from '../assets/backgroundsound.mp3'
import * as audio from '../audio'
const GameSettingsContext = createContext();

export function GameSettingsProvider({children}) {
    const [character,setCharacter] = useState(
        { 
                    name: 'stewie',
                        image: stewie,
                        fireImage:stewieFireImage,
                        fireEffect:stewieFireEffect,
                        muzzelX:90,
                        muzzelY:78
        }
            )
    const [difficulity, setDifficulty] = useState(1)
    const [zombiesCount,setZombieCount] = useState(10)
    const [language,setLanguage] = useState('en')
    const [backgroundMusic,setBackgroundMusic] = useState(true)
    useEffect(() => {
        audio.initMusic(backgroundSound, 0.3)
        audio.installUnlockHandlers()
    }, [])
    useEffect(() => {
        audio.setMusicMuted(!backgroundMusic)
        if (backgroundMusic) audio.tryStartMusic()
    }, [backgroundMusic])
      const toggleBackground = () => { setBackgroundMusic(prev => !prev); };
    const t = (key) => (translations[language] ?? translations.en)[key] ?? translations.en[key];
    return (
        <GameSettingsContext.Provider value={{character,setCharacter,
            difficulity,setDifficulty,zombiesCount,setZombieCount
            ,language,setLanguage,backgroundMusic,toggleBackground,t
        }}
            >
                {children}
            </GameSettingsContext.Provider>
        
    )   
}
export function useGame() {return useContext(GameSettingsContext)}