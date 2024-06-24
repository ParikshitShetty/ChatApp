import React, { useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
// Utils
import { initializeSocket } from '../utils/socket'
// Global States
import { 
    groupchatArrayStore, 
    GroupChatModeState, 
    GroupState, 
    recieverStore,
    userNameStore} from '../store/store';

function GroupChatRenderer() {
    const [chatArray,setChatArray] = useAtom(groupchatArrayStore);

    const reciever = useAtomValue(recieverStore);

    const userName = useAtomValue(userNameStore);

    const groupChatMode = useAtomValue(GroupChatModeState);

    const group = useAtomValue(GroupState);

    const ref = useRef(true);

    const messagesEndRef = useRef(null);

    useEffect(()=>{
      const socket = initializeSocket(userName);

      if (ref.current) {
        socket.on('receive_welcome_message',(message)=>{
          console.log("receive_welcome_message",message);
          if (userName === message.sender) {
            toast.success(message.message_self)
            return
          }
          toast.success(message.message_others)
        });
        
        socket.on('receive_group_message',(message)=>{
          const newObj = {
            message:message
          };
          setChatArray( (prev) => {
            return [ ...prev, newObj ]
          });
        });
        ref.current = false;
      }
      return () => {
        if (ref.current) {
          socket.removeListener("receive_welcome_message");
          socket.removeListener("receive_group_message");
        }
      }
    },[]);

    useEffect(() =>{
      if (messagesEndRef.current && chatArray.length) {
        messagesEndRef.current.scrollTop =  messagesEndRef.current.scrollHeight;
      }
    },[chatArray])
    console.log("chatArray",chatArray);
  return (
    <>
        <div className='w-[90%] max-h-[80vh] h-[80vh] overflow-y-scroll flex flex-col justify-start items-start' ref={messagesEndRef}>
           {chatArray?.map((message,index)=>(
              <>
                <span key={index} className={`text-gray-950 ${userName ===  message.message.sender ? `message-orange` : `message-blue`} ${index === 0 ? `mt-2` : `` }`}>
                  <p className={`font-semibold mb-2 first-letter:uppercase`}>{userName === message.message.sender ? `You` : message.message.sender}</p>{message.message.content}</span>
              </>
           ))}
        </div>
    </>
  )
}

export default GroupChatRenderer