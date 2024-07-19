import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { IoPaperPlane } from "react-icons/io5";
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
// Utils
import { initializeSocket } from '../../utils/socket'
// Global States 
import { 
  chatArrayStore,
  GroupChatModeState,
  GroupState,
  recieverStore,
  senderIdStore, 
  userNameStore} from '../../store/store';
// Common functions
import { dateToRedisId } from '../../common/dateConverter';
import { FiPaperclip } from "react-icons/fi";

function ChatForm() {
  const [message,setMessage] = useState('');

  const sender = useAtomValue(senderIdStore);

  const reciever = useAtomValue(recieverStore);

  const userName = useAtomValue(userNameStore);

  const setChatArray = useSetAtom(chatArrayStore);

  const groupChatMode = useAtomValue(GroupChatModeState);

  const group = useAtomValue(GroupState);

  const [file, setFile] = useState('');

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  // Input change handler
  const changeHandler = (event) => setMessage(event.target.value);

  const formSubmit = (event) =>{
    event.preventDefault();
    if (!message) return ;
    try {
      const socket = initializeSocket(userName);

      // console.log("sender",sender)

      const messgeObj = { 
        receiverChatID:reciever.chatID, 
        senderChatID:sender, 
        content:message,
        recieverUserName:reciever.userName
      }
      const sendMessage = import.meta.env.VITE_SOCKET_SEND_MESSAGE;
      socket.emit(sendMessage,messgeObj);

      const obj = {
        id:Date.now(),
        message:messgeObj
      }
      setChatArray((prev)=>{
        return [...prev,obj]
      });

      setMessage('');
    } catch (error) {
      console.error("Error while sending message",error);
    }
  }

  const groupFormSubmit = (event) =>{
    event.preventDefault();
    if (!message) return ;
    try {
      const socket = initializeSocket(userName);

      const messageObj = {
        room : group.groupName,
        sender : userName,
        content : message
      }
      // const obj = {
      //   id:Date.now(),
      //   message:messageObj
      // }
      // socket.emit("join_group", messageObj);
      const sendGroupMessage = import.meta.env.VITE_SOCKET_SEND_GROUP_MESSAGE;
      socket.emit(sendGroupMessage,messageObj)

      setMessage('');
    } catch (error) {
      console.error("Error while sending message",error);
    }
  }

  const handleChange = (event) => {
    console.log(event.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContents = e.target.result;
        console.log(fileContents);
      };
      reader.readAsText(file); 
    }
  }

  const handleClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  useEffect(()=>{
    if (inputRef) {
      inputRef.current.focus()
    }
  },[reciever])

  // console.log("Date.now()",Date.now());
  return (
    <>
      <div className='w-[70%] h-[10vh] flex justify-end items-end '>
        <form className='w-full h-full flex justify-center items-end mb-4' onSubmit={groupChatMode ? groupFormSubmit : formSubmit}>
          {/* <div className='w-20'>
            <FiPaperclip className='w-7 h-7 ml-2 cursor-pointer' onClick={handleClick}>
              <input type='file' ref={fileInputRef} value={file} onChange={handleChange}
               className=''/>
            </FiPaperclip> 
          </div> */}
          <input type="text" id="message" placeholder="hey" required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-pitch-dark  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-black" 
          ref={inputRef}
          value={message} onChange={changeHandler} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if(groupChatMode) {
                groupFormSubmit(e);
                return
              }
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