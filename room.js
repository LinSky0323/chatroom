import { login, sendMessageToRoom } from "./scripts/firebase";
import "./style.css";


function sendMessage(roomId){
    const textInput=document.querySelector("#input_text");
    const message=textInput.value;
    if(message==="")return;

    sendMessageToRoom(roomId,message)
    textInput.value="";
}

function sendMessageListeners(roomId){
    const btn=document.querySelector("#input_button")
    btn.addEventListener("click",()=>{
        sendMessage(roomId)
    })
    const textInput=document.querySelector("#input_text");
    textInput.addEventListener("keypress",event=>{
        if(event.key === "Enter"){
            btn.click();
        }
    })}

function setEventListeners(roomId){
    sendMessageListeners(roomId)
}



login().then((user)=>{
    const roomId=new URLSearchParams(window.location.search).get("roomId")
    setEventListeners(roomId);
})