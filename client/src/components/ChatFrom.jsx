import React, { useEffect, useState } from 'react'
import { IoPaperPlane } from "react-icons/io5";
import { useAtomValue } from 'jotai';
// Utils
import socket from '../utils/socket'
// Global States 
import { 
  recieverStore,
  senderStore } from '../store/store';

function ChatForm() {
  const [message,setMessage] = useState('');

  const sender = useAtomValue(senderStore);

  const reciever = useAtomValue(recieverStore);

  const changeHandler = (event) => setMessage(event.target.value);

  const formSubmit = (event) =>{
    event.preventDefault();
    if (!message) return ;
    try {
      socket.emit('send_message',{ receiverChatID:reciever, senderChatID:sender , content:message});

      setMessage('');
    } catch (error) {
      console.error("Error while sending message",error);
    }
  }

  // useEffect(()=>{
  //   socket.on('receive_message',(data)=>console.log("data",data))
  // },[])

  console.log(message)
  return (
    <>
      <div className='w-2/3 h-[15vh] flex justify-end items-end '>
        <form className='w-full h-full flex justify-center items-end mb-4' onSubmit={formSubmit}>
          <input type="text" id="message" placeholder="hey" required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          value={message} onChange={changeHandler} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              formSubmit(e)
            }
          }}/>

          <button type="submit" className='w-10 h-10 mx-4'>
            <IoPaperPlane className='w-full h-full'/>
          </button>
        </form>
      </div>
    </>
  )
}

export default ChatForm