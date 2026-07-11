import { useEffect, useRef, useState } from "react";

const Zombie = ({image,difficulity = 1,zombie,OnZombieEscape,onChangeX,zindexClass}) => {
    let opacity = 1;
    // shows if zombie has reached the target or not
    const [prog,setProg] = useState(0);
    // if zombie died or is still alive
    const [dead,setDead] = useState(false)
    // brief explosion each time this zombie takes a correct letter
    const [hitKey,setHitKey] = useState(0);
    const prevProgress = useRef(zombie.progress);

    useEffect(() => {
        if (zombie.progress > prevProgress.current) {
            setHitKey(k => k + 1);
        }
        prevProgress.current = zombie.progress;
    }, [zombie.progress]);

    useEffect(()=> {
        let frameId;
        let cancelled = false;
        const duration  = zombie.speed
        const startTime = performance.now()
        const animate = now => {
            if (cancelled) return;
            const elapased = now - startTime;
            const t = Math.min(elapased/duration,1)

            setProg(t);
            const currentX = zombie.startX + (zombie.targetX - zombie.startX) * t;
            onChangeX(zombie.id, currentX);
            if (t < 1){
                frameId = requestAnimationFrame(animate)
            } else {
                OnZombieEscape(zombie.id)
            }

        };
        frameId = requestAnimationFrame(animate)
        return () => { cancelled = true; cancelAnimationFrame(frameId); }
    },[OnZombieEscape]);
    const currentX = zombie.startX + (zombie.targetX - zombie.startX) * prog;
    const currentY = zombie.startY + (zombie.targetY - zombie.startY) * prog;
    const angle = Math.atan2(zombie.targetY - zombie.startY, zombie.targetX - zombie.startX) * (180 / Math.PI);



    return (
        <>
        
                 <div className="zombie-wrapper" 
                    style={
                    {
                            position:'absolute',
                            right:`${currentX}%`,
                            top:`${currentY}%`,
                            transform:`rotate(${angle}deg)`,
                            zIndex:zindexClass ? '9999' : '',
                            opacity

                    }
                }
                 >
                   
            <div className="zombie-word ">
                <span style={{
                    color:'darkkhaki'
                }}>{zombie.text.slice(0,zombie.progress)}</span>
                {zombie.text.slice(zombie.progress,zombie.text.length)}
                </div>
            <div className="zombie-image-container" style={{ position: 'relative' }}>
                <img src={zombie.image} alt="zombie" className="zombie-image"
                />
                {hitKey > 0 && (
                    <div
                        key={hitKey}
                        className="muzzle-flash-overlay"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="flash"></div>
                        <div className="sparks">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="spark"
                                    style={{
                                        '--angle': `${(i / 12) * 360}deg`,
                                        '--delay': `${Math.random() * 0.1}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </div>
        
        </>
    )
}
export default Zombie;