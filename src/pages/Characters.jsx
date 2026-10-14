import { useState } from 'react';
import CharacterSelect from '../assets/CharacterSelect.webp';
import volt from '../assets/volt.webp';
import voltFireImage from '../assets/volt_firing.webp';
import voltFireEffect from '../assets/volt_fire.mp3';
import scout from '../assets/scout.webp';
import scoutFireImage from '../assets/scout_firing.webp';
import scoutFireEffect from '../assets/scout_fire.mp3';
import { useGame } from '../context/GameSettingsContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Characters = () => {
    const navigate = useNavigate();
    const {character,setCharacter,t} = useGame()
    const [characters, setCharacters] = useState([
        {
            name: 'volt',
            image: volt,
            fireImage: voltFireImage,
            selected: true,
            fireEffect: voltFireEffect,
            muzzle: { x: 0.93, y: 0.53 }, // gun barrel, as a fraction of the aiming image,
            index: 0
        },
        {
            name: 'scout',
            image: scout,
            fireImage: scoutFireImage,
            selected: false,
            fireEffect: scoutFireEffect,
            muzzle: { x: 0.93, y: 0.53 }, // gun barrel, as a fraction of the aiming image,
            index: 1
        }
    ]);

    const changeCharacter = (char) => {
        setCharacters(prev => 
            prev.map((ch) => ({
                ...ch,
                selected: ch.index === char.index  
            }))
        );
        setCharacter(char)

    };
    const startGame = () => {
        navigate('/gameSettings')
    }

    return (
        <div
            style={{
                backgroundImage: `url(${CharacterSelect})`,
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
            <div className="flex items-center justify-center flex-1">
                <div className="flex p-8" style={{ gap: 'min(10rem, 6vw)' }}>
                    {characters.map((char) => (
                        <div
                            key={char.index}
                            onClick={() => changeCharacter(char)}
                            style={{ width: 'min(37rem, 40vw, 62vh)', height: 'min(37rem, 40vw, 62vh)' }}
                            className={`relative rounded-2xl cursor-pointer transition-all duration-300 ${
                                char.selected
                                    ? 'ring-4 ring-purple-500 ring-offset-4 ring-offset-gray-900 shadow-xl shadow-purple-500/50'
                                    : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
                            }`}
                        >
                            <img
                                src={char.image}
                                alt={char.name}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                            {char.selected && (
                                <div className="absolute -top-3 -right-3 bg-purple-500 rounded-full p-1 shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pb-12">
                <button onClick={() => startGame()} className="relative px-12 py-5 text-3xl font-bold uppercase tracking-widest text-red-100 bg-zinc-800 border-4 border-red-900 rounded-lg shadow-[0_10px_0_0_#450a0a,inset_0_-4px_0_0_#450a0a] hover:shadow-[0_5px_0_0_#450a0a,inset_0_-4px_0_0_#450a0a] hover:translate-y-1 transition-all duration-150 hover:bg-zinc-700 active:shadow-[0_0px_0_0_#450a0a,inset_0_-4px_0_0_#450a0a] active:translate-y-2 font-mono group">
                    <span className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20 rounded-lg"></span>
                    
                    <span className="absolute -top-1 left-1/4 w-1 h-3 bg-red-700 rounded-b-full animate-pulse"></span>
                    <span className="absolute -bottom-1 right-1/3 w-1.5 h-4 bg-red-800 rounded-b-full animate-pulse delay-150"></span>
                    <span className="absolute -top-2 right-1/4 w-0.5 h-5 bg-red-600 rounded-b-full animate-pulse delay-300"></span>
                    
                    <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
                        🧟 {t('next')}  🧟
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Characters;