import React, { useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai';
// Utils
import { initializeSocket } from '../utils/socket'
// Global States
import { 
    chatArrayStore, 
    GroupChatModeState, 
    GroupState, 
    recieverStore,
    userNameStore} from '../store/store';

function GroupChatRenderer() {
    const [chatArray,setChatArray] = useState([]);

    const reciever = useAtomValue(recieverStore);

    const userName = useAtomValue(userNameStore);

    const groupChatMode = useAtomValue(GroupChatModeState);

    const group = useAtomValue(GroupState);

    const ref = useRef(true);

    useEffect(()=>{
      if (ref.current) {
        const socket = initializeSocket(userName);
        
        socket.on('receive_group_message',(message)=>{
            console.log("receive_group_message",message)
            setChatArray((prev)=>{
                return [...prev,message]
            })
        });
        ref.current = false;
      }
    },[]);

    console.log("group",group);
    console.log("chatArray",chatArray);
  return (
    <>
        <div className=' w-full h-[75vh] flex flex-col justify-start items-center'>
           {chatArray?.map((message)=>(
                <span className={`w-full h-auto text-gray-950 ${userName ===  message.user ? `message-orange` : `message-blue`}`}>{message.content}</span>
           ))}
           GroupChatRenderer
        </div>
    </>
  )
}

export default GroupChatRenderer