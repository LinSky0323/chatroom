// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider,getAuth,signInWithPopup,onAuthStateChanged } from "firebase/auth";
import {getFirestore,collection,addDoc,onSnapshot,doc,getDoc,setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGIN_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider=new GoogleAuthProvider();
const COLLECTION={
    ROOM:"room",
    MESSAGE:"message"
}
export async function login(){
    return new Promise((resolve,reject)=>{
        const auth=getAuth();
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
        if(user){
            resolve(user);
            unsubscribe();
        }
        else{
            signInWithPopup(auth,provider);
        }
    })
    })
   
}

export async function createRoom(){
    const db=getFirestore();
    const room=await addDoc(collection(db,"room"),{
        name:"chat room",
        create:new Date()
    })
    return room.id;
}

export async function sendMessageToRoom(roomId,content){
    const db=getFirestore();
    const messageRef=collection(db,COLLECTION.ROOM,roomId,COLLECTION.MESSAGE)
    const auth=getAuth();
    const message=await addDoc(messageRef,{
        senderEmail:auth.currentUser.email,
        senderName:auth.currentUser.displayName,
        content,
        time:new Date()
    })
    return message;
}

export async function subscribe(fn,roomId){
    const auth=getAuth();
    const db=getFirestore();
    const messageRef=collection(db,COLLECTION.ROOM,roomId,COLLECTION.MESSAGE);
    const unsubscribe=onSnapshot(messageRef,(messages)=>{
        const newMessage=messages.docs.map((doc)=>{
            const data=doc.data();
            const id=doc.id;
            return{id,self:auth.currentUser.email===data.senderEmail,...data}
        })
        fn(newMessage);
    })
    return unsubscribe;
}
export function getRoom(roomId){
    const db=getFirestore();
    const roomRef=doc(db,COLLECTION.ROOM,roomId)
    return getDoc(roomRef).then((doc)=>doc.data())
}
export async function updateRoomName(name,roomId){
    const db=getFirestore();
    const roomRef=doc(db,COLLECTION.ROOM,roomId);
    await setDoc(roomRef,{name:name},{merge:true})
} 