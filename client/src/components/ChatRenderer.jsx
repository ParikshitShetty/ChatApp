import React, { useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai';
// Utils
import { initializeSocket } from '../utils/socket'
// Global States
import { 
    chatArrayStore, 
    GroupChatModeState, 
    recieverStore,
    userNameStore} from '../store/store';

function ChatRenderer() {
    const [chatArray,setChatArray] = useAtom(chatArrayStore);

    const reciever = useAtomValue(recieverStore);

    const userName = useAtomValue(userNameStore);

    const ref = useRef(true);

    const messagesEndRef = useRef(null);

    useEffect(()=>{
        const socket = initializeSocket(userName);

        if (ref.current) {

            socket.on('receive_message',(data)=>{
                // console.log("data",data)
                setChatArray((prev)=>{
                    return [...prev,data]
                });
            });
            ref.current = false;
        }
        return () =>{
          if (ref.current) {
            socket.removeListener('receive_message');
          }
        }
      },[])

    useEffect(() =>{
      if (messagesEndRef.current && chatArray.length) {
        messagesEndRef.current.scrollTop =  messagesEndRef.current.scrollHeight;
      }
    },[chatArray])
    console.log("reciever",reciever)
    // console.log("chatArray",chatArray)
  return (
    <>
        <div className=' w-[90%] h-[80vh] max-h-[80vh] overflow-y-scroll flex flex-col justify-start items-start' ref={messagesEndRef}>
           {chatArray?.map((message,index)=>(
                <span key={index} className={`w-full h-auto text-gray-950 ${reciever.userName ===  message.recieverUserName ? `message-orange` : `message-blue`} ${index === 0 ? `mt-2` : `` }`}>{message.content}</span>
           ))}
        </div>
    </>
  )
}

export default ChatRenderer