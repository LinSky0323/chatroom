import { login, sendMessageToRoom, subscribe } from "./scripts/firebase";
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

function appendMessage(message){
    const messageContainer=document.querySelector("#message_container");
    const messageElement=document.createElement("div");
    messageElement.classList.add("message");
    const user=document.createElement("div");
    user.innerText=message.senderName;
    const text=document.createElement("div");
    text.innerText=message.content;
    if(message.self){
        user.className="user";
        text.className="user_m"
    }
    else{
        user.className="user_you";
        text.className="user_you_m"
    }
    messageElement.appendChild(user);
    messageElement.appendChild(text);
    messageContainer.appendChild(messageElement);
}
const messageId=new Set();

function gotoBottom(){
    const message=document.querySelector("#message_container");
    message.scrollTop=message.scrollHeight-message.clientHeight
}

function messageUpdate(messages){
    messages.forEach((message) => {
        if(!messageId.has(message.id)){
            messageId.add(message.id);
            appendMessage(message); 
        }
    });
    gotoBottom();
}

login().then((user)=>{
    const roomId=new URLSearchParams(window.location.search).get("roomId")
    setEventListeners(roomId);
    subscribe(messageUpdate,roomId)
})