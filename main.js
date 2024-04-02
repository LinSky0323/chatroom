import { createRoom, login } from "./scripts/firebase"
import "./style.css"

function setEventListeners(){
    const btn=document.querySelector("#create_room")
    btn.addEventListener("click",async()=>{
        const roomId=await createRoom()
        window.location.href=`room.html?roomId=${roomId}`
    })
}

login().then(setEventListeners)
