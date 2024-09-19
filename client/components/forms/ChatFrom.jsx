import React from 'react'
import { IoPaperPlane } from "react-icons/io5";
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
// Utils
import { initializeSocket } from '@/utils/socket'
import { base64Encoder } from '@/utils/fileEncoder';
// Global States 
import { 
  attachMentToggleState,
  chatArrayStore,
  fileSizeStore,
  GroupChatModeState,
  GroupState,
  messageState,
  recieverStore,
  senderIdStore, 
  uploadFilesStore, 
  userNameStore} from '@/store/store';
// Components 
import PaperclipPopup from '../ui/PaperclipPopup';
import ChatFormInput from '../reusable/ChatFormInput';
import PaperClip from '../reusable/PaperClip';
import ChatFormFileRenderer from '../renderer/ChatFormFileRenderer';

function ChatForm() {
  const [message,setMessage] = useAtom(messageState);

  const sender = useAtomValue(senderIdStore);

  const reciever = useAtomValue(recieverStore);

  const userName = useAtomValue(userNameStore);

  const setChatArray = useSetAtom(chatArrayStore);

  const groupChatMode = useAtomValue(GroupChatModeState);

  const fileSize = useAtomValue(fileSizeStore);

  const group = useAtomValue(GroupState);

  const [file, setFile] = useAtom(uploadFilesStore);

  const attachmentToggle = useAtomValue(attachMentToggleState);

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

  return (
    <>
      <div className='w-[70%] h-[13vh] flex justify-end items-end relative'>
        <form className='w-full h-full flex justify-center items-end mb-4 relative' 
          onSubmit={groupChatMode ? groupFormSubmit : formSubmit}
        >
          <ChatFormFileRenderer/>
          <ChatFormInput formSubmit={formSubmit} groupFormSubmit={groupFormSubmit} />
          <PaperClip/>

          <button type="submit" className='w-10 h-10 mx-4' disabled={fileSize}>
            <IoPaperPlane className={`w-full h-full transition-all duration-300 ease-in-out ${fileSize && `opacity-70`}`}/>
          </button>
        </form>
        { attachmentToggle && (
          <PaperclipPopup />
        )}
      </div>
    </>
  )
}

export default ChatForm