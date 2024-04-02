import { getRoom, login, sendMessageToRoom, subscribe, updateRoomName } from "./scripts/firebase";
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


function invite(){
    const btn=document.querySelector("#invite")
    const black=document.querySelector("#black")
    const input=document.querySelector("#invite_url")
    const currentUrl=window.location.href;
    btn.addEventListener("click",()=>{
        black.classList.add("open");
        input.value=currentUrl;
    })
}

function copyUrl(){
    const btn=document.querySelector("#invite_btn");
    const input=document.querySelector("#invite_url");
    btn.addEventListener("click",()=>{
        navigator.clipboard.writeText(input.value);
        btn.innerText="已複製";
        setTimeout(()=>{
            btn.innerText="複製邀請網址";
        },2000)
    })
}

function closeInvite(){
    const btn=document.querySelector("#invite_close");
    const black=document.querySelector("#black")
    btn.addEventListener("click",()=>{
        black.classList.remove("open");
    })
}

async function loadRoomName(roomId){
    const title=document.querySelector("#title");
    const data=await getRoom(roomId);
    title.innerText=data.name;
}

function createTitle(Value){
    const titleInput=document.createElement("input")
    titleInput.type="text";
    titleInput.value=Value;
    titleInput.className="edit_title"
    return titleInput;
}
async function RoomNameListeners(roomId){
    const btn=document.querySelector("#edit");
    btn.addEventListener("click",()=>{
        const title=document.querySelector("#title");
        const input=createTitle(title.textContent);
        title.parentNode.replaceChild(input,title)
        input.focus();
        btn.style.display="none";
        function saveTitle(){
            updateRoomName(input.value,roomId).then(()=>{
                title.textContent=input.value
            })
            .finally(()=>{
                input.parentNode.replaceChild(title,input);
                btn.style.display="block";
            })
        }
        input.addEventListener("blur",saveTitle);
        input.addEventListener("keydown",(e)=>{
           if(e.key==="Enter"){input.blur()}
       })
    })
}

function setEventListeners(roomId){
    sendMessageListeners(roomId);
    invite();
    copyUrl();
    closeInvite();
    RoomNameListeners(roomId);
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
    loadRoomName(roomId);
    setEventListeners(roomId);
    subscribe(messageUpdate,roomId)
})