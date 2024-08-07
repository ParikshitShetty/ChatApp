import React, { useEffect, useRef, useState, Fragment } from 'react'
import { useAtom, useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
// Utils
import { initializeSocket } from '../../utils/socket'
// Components
import Download from '../ui/Download';
import Loader from '../ui/Loader';
// Global States
import { 
    groupchatArrayStore, 
    groupChatLoaderState, 
    GroupChatModeState, 
    GroupState, 
    recieverStore,
    userNameStore} from '../../store/store';
// Common functions
import { uniqueDate, dateFormatter } from '../../common/uniqueDate';

function GroupChatRenderer() {
    const [chatArray,setChatArray] = useAtom(groupchatArrayStore);

    const [dateArr,setDateArr] = useState([]);

    const reciever = useAtomValue(recieverStore);

    const userName = useAtomValue(userNameStore);

    const groupChatMode = useAtomValue(GroupChatModeState);

    const group = useAtomValue(GroupState);

    const groupChatLoader = useAtomValue(groupChatLoaderState);

    const ref = useRef(true);

    const messagesEndRef = useRef(null);

    useEffect(()=>{
      const socket = initializeSocket(userName);

      if (ref.current) {
        const receieveWelcomeMessage = import.meta.env.VITE_SOCKET_RECEIVE_WELCOME_MESSAGE;
        socket.on(receieveWelcomeMessage,(message) => {
          // console.log("receive_welcome_message",message);
          if (userName === message.sender) {
            toast.success(message.message_self)
            return
          }
          toast.success(message.message_others)
        });

        const receieveGroupMessage = import.meta.env.VITE_SOCKET_RECEIVE_GROUP_MESSAGE;
        socket.on(receieveGroupMessage,(message) => {
          const newObj = {
            timeStamp:new Date().toISOString(),
            ...message
          };
          setChatArray( (prev) => {
            return [ ...prev, newObj ]
          });
        });
        ref.current = false;
      }
      return () => {
        if (ref.current) {
          const receieveWelcomeMessage = import.meta.env.VITE_SOCKET_RECEIVE_WELCOME_MESSAGE;
          const receieveGroupMessage = import.meta.env.VITE_SOCKET_RECEIVE_GROUP_MESSAGE;

          socket.removeListener(receieveWelcomeMessage);
          socket.removeListener(receieveGroupMessage);
        }
      }
    },[]);

    useEffect(() =>{
      if (messagesEndRef.current && chatArray.length) {
        messagesEndRef.current.scrollTop =  messagesEndRef.current.scrollHeight;
      }
      const array = uniqueDate(chatArray);
      setDateArr(array);
    },[chatArray])
    console.log("chatArray",chatArray);
  return (
    <>
        <div className='w-[90%] max-h-[77vh] h-[80vh] overflow-y-scroll flex flex-col justify-start items-start' ref={messagesEndRef}>
        {
          groupChatLoader 
          ?
            <>
              <Loader type={'spokes'} />
            </>
          :
            <>
              {chatArray?.map((message,index)=>(
                <Fragment key={index}>
                  { dateArr.length > 0 && dateArr[index] && dateArr[index] !== "" && (
                      <div className={`w-full h-auto text-gray-950 first:mt-2 message-middle`}>
                        {dateArr[index]}
                      </div>
                    )}
                  <span key={index} className={`text-gray-950 ${userName ===  message.sender ? `message-orange` : `message-blue`} ${index === 0 ? `mt-2` : `` }`}>
                    <p className={`font-semibold mb-2 first-letter:uppercase`}>
                      {userName === message.sender ? `You` : message.sender}
                    </p>
                    {message.content}
                    {message?.path && (
                      <Download message={message} />
                    )}
                    <p className={`mt-1 ${reciever.userName ===  message.recieverUserName ? `text-end` : `text-start`}`}>
                        {dateFormatter(message.timeStamp)}
                      </p>
                  </span>
                </Fragment>
              ))}    
            </>
        }
        </div>
    </>
  )
}

export default GroupChatRenderer