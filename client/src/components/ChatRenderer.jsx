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

    const groupChatMode = useAtomValue(GroupChatModeState);

    const ref = useRef(true);

    useEffect(()=>{
        if (ref.current) {
            const socket = initializeSocket(userName);

            socket.on('receive_message',(data)=>{
                // console.log("data",data)
                setChatArray((prev)=>{
                    return [...prev,data]
                })
            });
            ref.current = false;
        }
      },[])
    console.log("reciever",reciever)
    // console.log("chatArray",chatArray)
  return (
    <>
        <div className=' w-full h-[75vh] flex flex-col justify-start items-center'>
           {chatArray?.map((message)=>(
                <span className={`w-full h-auto text-gray-950 ${reciever.userName ===  message.recieverUserName ? `message-orange` : `message-blue`}`}>{message.content}</span>
           ))}
        </div>
    </>
  )
}

export default ChatRenderer