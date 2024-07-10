import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai';
// Utils
import { initializeSocket } from '../../utils/socket';
import Loader from '../ui/Loader';
// Global States
import { 
    chatArrayStore, 
    chatLoaderState, 
    GroupChatModeState, 
    recieverStore,
    userNameStore} from '../../store/store';
// Common Functions
import { redisIdToDateTimeConverter } from '../../common/dateConverter';

function ChatRenderer() {
    const [chatArray,setChatArray] = useAtom(chatArrayStore);

    const reciever = useAtomValue(recieverStore);

    const userName = useAtomValue(userNameStore);

    const chatLoader = useAtomValue(chatLoaderState);

    const ref = useRef(true);

    const messagesEndRef = useRef(null);

    useEffect(()=>{
        const socket = initializeSocket(userName);

        if (ref.current) {
            const recieveMessage = import.meta.env.VITE_SOCKET_RECEIVE_MESSAGE;
            socket.on(recieveMessage,(data) => {
              // console.log("receive_message data",data);
              const obj = {
                id:Date.now(),
                message:data
              }
              setChatArray((prev)=>{
                  return [...prev,obj]
              });
            });
            ref.current = false;
        }
        return () =>{
          if (ref.current) {
            const recieveMessage = import.meta.env.VITE_SOCKET_RECEIVE_MESSAGE;
            socket.removeListener(recieveMessage);
          }
        }
      },[])

    useEffect(() =>{
      if (messagesEndRef.current && chatArray.length) {
        messagesEndRef.current.scrollTop =  messagesEndRef.current.scrollHeight;
      }
    },[chatArray])
    // console.log("reciever",reciever)
    console.log("chatArray",chatArray)
  return (
    <>
        <div className=' w-[90%] h-[80vh] max-h-[80vh] overflow-y-scroll flex flex-col justify-start items-start' ref={messagesEndRef}>
          {
            chatLoader 
            ?
              <>
                <Loader type={'spokes'} />
              </>
            :
              <>
                {chatArray?.map((message,index)=>(
                  <Fragment key={index}>
                    <div className={`w-full h-auto text-gray-950 first:mt-2 message-middle`}>
                      {redisIdToDateTimeConverter(message.id)}
                    </div>
                    <div className={`w-full h-auto text-gray-950 first:mt-2
                      ${reciever.userName ===  message.message.recieverUserName ? `message-orange` : `message-blue`}`}>
                        {message.message.content}
                        <p className={`mt-1 ${reciever.userName ===  message.message.recieverUserName ? `text-end` : `text-start`}`}>
                          {redisIdToDateTimeConverter(message.id,true)}
                        </p>
                    </div>
                    
                  </Fragment>
                ))}
              </>
          }
        </div>
    </>
  )
}

export default ChatRenderer