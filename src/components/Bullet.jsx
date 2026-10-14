import { useEffect, useState } from "react"
// fromX/fromY/toX/toY are percentages of the play area (left/top).
const Bullet = ({fromX,fromY,toX,toY,onComplete,bulletClass,bulletId }) => {
    const [progress,setProgress] = useState(0);
    useEffect(() => {
        let frameId;
        const duration  = 400
        const startTime = performance.now()
        const animate = now => {
            const elapased = now - startTime;
            const t = Math.min(elapased/duration, 1)
            setProgress(t);
            if (t < 1){
                requestAnimationFrame(animate)
            } else {
                onComplete(bulletId)
            }

        };
        frameId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameId)

    }, [onComplete])
    const currentX = fromX + (toX - fromX) * progress;
    const currentY = fromY + (toY - fromY) * progress;
    // Angle in screen pixels, not percentages, so it stays true on any aspect ratio.
    const angle = Math.atan2((toY - fromY) * window.innerHeight, (toX - fromX) * window.innerWidth) * (180 / Math.PI);
    const opacity = progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1;

    return (
        <>
         <div
                className={bulletClass}
                style={
                        {
                            position:'absolute',
                            left:`${currentX}%`,
                            top:`${currentY}%`,
                            // Pin the bullet's head (its right end) to the point, then aim it.
                            transform:`translate(-100%, -50%) rotate(${angle}deg)`,
                            opacity
                        }
                        }
            />
        </>

    );
}
export default Bullet