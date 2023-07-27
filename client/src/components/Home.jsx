import React, { useEffect,useState } from 'react'
import ChatRoom from './ChatRoom'
import useWebSocket from "react-use-websocket"

const WS_URL = 'ws://127.0.0.1:4000'


const Home = () => {

    const [message, setMessage] = useState('')

    let greeting = 'parikshit';

    useEffect(()=>{
        const socket = new WebSocket(WS_URL)

        socket.onOpen = () =>{
                console.log("WebSocket connection established.");
            }

        socket.onmessage = (event) => {
            console.log('Received from server:', event.data);
          };

    
        socket.onclose = () => {
                console.log("connection was closed");
            }
        return () => socket.close();
    },[])

    console.log(message);
    
    const sendMessage = () => {
        // Replace 'localhost:5000' with your actual backend server address
        const socket = new WebSocket(WS_URL);
        socket.onopen = () => {
          socket.send(message);
        };
        console.log('sent')
      };
  return (
        <div className='flex flex-col w-2/6 '>
        {/* <ChatRoom/> */}
        <input type="text" className='flex text-black' value={message} onChange={(e)=>setMessage(e.target.value)} />
        <button type="button" className='rounded-md bg-amber-700 flex p-3 justify-items-center' onClick={sendMessage}>send message to server</button>
    </div>
  )
}

export default Home




//USING USEWEBSOCKET HOOK OUTSIDE OF USEEFECT HOOK
// useWebSocket(WS_URL,{
//     onOpen:()=>{
//         console.log("WebSocket connection established.");
//     },

//     onclose:()=>{
//         console.log("connection was closed");
//     }
    
// })