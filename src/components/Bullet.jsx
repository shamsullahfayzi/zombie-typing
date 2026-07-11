import { useEffect, useState } from "react"
const Bullet = ({startX,startY,targetX,targetY,onComplete,bulletClass,bulletId }) => {
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
    const currentX = (100 - startX) + (startX - targetX) * progress;
    const currentY = startY + (targetY - startY) * progress;
    const angle = Math.atan2(targetY - startY, targetX - startX) * (180 / Math.PI);
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
                            transform:`rotate(${angle}deg)`,
                            opacity
                        }
                        }
            />
        </>

    );
}
export default Bullet