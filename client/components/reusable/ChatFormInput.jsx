import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useRef } from 'react';
// Global States
import { 
  fileSizeStore,
  GroupChatModeState, 
  messageState, 
  recieverStore, } from '@/store/store';

function ChatFormInput({formSubmit, groupFormSubmit}) {
    const inputRef = useRef(null);

    const reciever = useAtomValue(recieverStore);
    const [message,setMessage] = useAtom(messageState);
    const groupChatMode = useAtomValue(GroupChatModeState);

    const fileSize = useAtomValue(fileSizeStore);

    const changeHandler = (event) => setMessage(event.target.value);

    useEffect(()=>{
      if (inputRef) {
        inputRef.current.focus();
        setMessage('');
      }
    },[reciever]);

  return (
    <>
        <input type="text" id="message" placeholder="Message"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 dark:bg-custom-pitch-dark  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-black
          pr-10" 
          ref={inputRef}
          value={message} onChange={changeHandler} onKeyDown={(e) => {
            if (fileSize) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              if(groupChatMode) {
                groupFormSubmit(e);
                return
              }
              formSubmit(e)
            }
        }}/>
    </>
  )
}

export default ChatFormInput