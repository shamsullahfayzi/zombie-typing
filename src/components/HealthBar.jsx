import React, { memo } from "react"

const HealthBar = React.memo(({health}) => {
    return (
    <div className="health-bar " style={{
                        width:'550px',
                        height:'50px',
                        border:'2px solid green',
                        padding:'4px',
                        alignItems:'center',
                        position:'absolute',top:'4%',left:'40%'
                        
                    }} >
                        <div className="health-bar-container" style={{
                            transition:'width 1s',
                            width:health > 0 ? health+'%' : '0%',
                            height:'40px',
                            
                            backgroundColor:'red'
                        }}>
                        </div>
                    </div>
    )
})
export default HealthBar