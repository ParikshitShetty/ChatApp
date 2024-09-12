import React, { useEffect, useRef, useState } from 'react'
import { IoPaperPlane } from "react-icons/io5";
import { useAtomValue, useSetAtom } from 'jotai';
import { FiPaperclip } from "react-icons/fi";
// Utils
import { initializeSocket } from '@/utils/socket'
import { base64Encoder } from '@/utils/fileEncoder';
// Global States 
import { 
  chatArrayStore,
  GroupChatModeState,
  GroupState,
  recieverStore,
  senderIdStore, 
  userNameStore} from '@/store/store';

function ChatForm() {
  const [message,setMessage] = useState('');

  const sender = useAtomValue(senderIdStore);

  const reciever = useAtomValue(recieverStore);

  const userName = useAtomValue(userNameStore);

  const setChatArray = useSetAtom(chatArrayStore);

  const groupChatMode = useAtomValue(GroupChatModeState);

  const group = useAtomValue(GroupState);

  const [file, setFile] = useState([]);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  // Input change handler
  const changeHandler = (event) => setMessage(event.target.value);

  const formSubmit = async(event) => {
    event.preventDefault();
    try {
      const socket = initializeSocket(userName);

      // console.log("sender",sender)

      const messageObj = { 
        receiverChatID:reciever.chatID, 
        senderChatID:sender, 
        content:message,
        recieverUserName:reciever.userName,
        senderUserName:userName
      }
      let image, path = ''
      // Send file
      if(file?.length > 0) {
        const fileObj = uploadFile(messageObj);
        
        for (let index = 0; index < fileObj.length; index++) {
          const element = fileObj[index];
          image = await base64Encoder(element);
          path = element.name;

          // delete messageObj.content
          // console.log("messageObj",messageObj)
          if(index !== 0 && messageObj.content) delete messageObj.content
          const obj = {
            timeStamp:new Date().toISOString(),
            image,
            path,
            ...messageObj
          }
          setChatArray((prev)=>{
            return [...prev,obj]
          });
        }
      } else {
        const sendMessage = import.meta.env.VITE_SOCKET_SEND_MESSAGE;
        socket.emit(sendMessage,messageObj);

        const obj = {
          timeStamp:new Date().toISOString(),
          ...messageObj
        }
        setChatArray((prev)=>{
          return [...prev,obj]
        });
      }

      if (message !== '') setMessage('');
    } catch (error) {
      console.error("Error while sending message",error);
    }
  }

  const groupFormSubmit = (event) =>{
    event.preventDefault();
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
      if(file?.length > 0) uploadFile(messageObj);
      else{
        const sendGroupMessage = import.meta.env.VITE_SOCKET_SEND_GROUP_MESSAGE;
        socket.emit(sendGroupMessage,messageObj)
      }

      setMessage('');
    } catch (error) {
      console.error("Error while sending message",error);
    }
  }

  const fileChangeHandle = (event) => {
    const InputFiles = Array.from(event.target.files);
    const fileArray = InputFiles.map( file => {
      return { fileBuf:file, name:file.name, type:file.type }
    })
    setFile(fileArray);
  }

  const handleClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.click();
  }

  const uploadFile = (messgeObj) => {
    if(file.length === 0) return console.log('file is empty');
    const socket = initializeSocket(userName);
    
    const object = { file, messgeObj };
    const sendFileEvent = groupChatMode ? import.meta.env.VITE_SOCKET_SEND_GROUP_FILE : import.meta.env.VITE_SOCKET_SEND_FILE;
    socket.emit(sendFileEvent, object);
    setFile([]);
    return object.file;
    // console.log("size",formatFileSize(file.size));
  }

  useEffect(()=>{
    if (inputRef) {
      inputRef.current.focus()
    }
  },[reciever])

  return (
    <>
      <div className='w-[70%] h-[13vh] flex justify-end items-end relative'>
        <form className='w-full h-full flex justify-center items-end mb-4' onSubmit={groupChatMode ? groupFormSubmit : formSubmit}>
          <div className='w-20'>
            <FiPaperclip className='w-7 h-7 ml-2 cursor-pointer' onClick={handleClick} />
              <input type='file' id='fileInput' onChange={fileChangeHandle}
               multiple
               className='hidden'/>
          </div>
          <div className='absolute top-1 left-[8%] flex '>
            {file.length > 0 && <>Files:</>}
            {file?.map((fileName,index) =>(
             <p key={index} className=''>&nbsp;{fileName?.name}</p>
            ))}
          </div>
          <input type="text" id="message" placeholder="hey"
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