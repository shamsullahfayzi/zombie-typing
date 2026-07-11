import { useRef } from "react"

const SaveScore = ({data}) => {
    const {NameRef}= useRef();
    const date = new Date()
    const saveScore = () => {
        const score = {
            name:NameRef,
            totalKills:data.totalKills,
            wpm:data.wpm,
            totalMistakes:data.mistakes,
            life:data.life,
            date:date
        }
    }

    return (
        <>  
        
          <input
          ref={inputRef}
          className="gameover-input"
          type="text"
          ref={NameRef}
          placeholder="survivor"
          maxLength={22}
          autoComplete="off"
          spellCheck="false"
          
        />
        <button onClick={saveScore}>Done</button>
        </>
       
    )
}
export default SaveScore