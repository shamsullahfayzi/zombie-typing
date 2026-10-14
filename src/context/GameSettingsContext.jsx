import { createContext, useContext, useEffect, useState } from "react";
import volt from '../assets/volt.webp'
import voltFireEffect from '../assets/volt_fire.mp3'
import voltFireImage from '../assets/volt_firing.webp'
import { translations } from '../translations'
import backgroundSound from '../assets/backgroundsound.mp3'
import * as audio from '../audio'
const GameSettingsContext = createContext();

export function GameSettingsProvider({children}) {
    const [character,setCharacter] = useState(
        { 
                    name: 'volt',
                        image: volt,
                        fireImage: voltFireImage,
                        fireEffect: voltFireEffect,
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