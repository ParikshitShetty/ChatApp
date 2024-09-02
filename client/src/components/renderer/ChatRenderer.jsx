import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai';
// Utils
import { initializeSocket } from '../../utils/socket';
// Compoentns
import Loader from '../ui/Loader';
import Download from '../ui/Download';
import FileRenderer from './FileRenderer';
// Global States
import { 
    chatArrayStore, 
    chatLoaderState, 
    recieverStore,
    userNameStore} from '../../store/store';
// Common Functions
import { uniqueDate, dateFormatter } from '../../common/uniqueDate';

function ChatRenderer() {
    const [chatArray,setChatArray] = useAtom(chatArrayStore);

    const [dateArr,setDateArr] = useState([]);

    const reciever = useAtomValue(recieverStore);

    const userName = useAtomValue(userNameStore);

    const chatLoader = useAtomValue(chatLoaderState);

    const [vedioDownloaded,setVedioDownloaded] = useState(false);

    const renderRef = useRef(true);

    const messagesEndRef = useRef(null);

    useEffect(()=>{
        const socket = initializeSocket(userName);

        if (renderRef.current) {
            const recieveMessage = import.meta.env.VITE_SOCKET_RECEIVE_MESSAGE;
            socket.on(recieveMessage,(data) => {
              // console.log("receive_message data",data);
              const obj = {
                timeStamp:new Date().toISOString(),
                ...data
              }
              setChatArray((prev)=>{
                  return [...prev,obj]
              });
            });
            renderRef.current = false;
        }
        return () =>{
          if (renderRef.current) {
            const recieveMessage = import.meta.env.VITE_SOCKET_RECEIVE_MESSAGE;
            socket.removeListener(recieveMessage);
          }
        }
      },[])

    useEffect(() =>{
      if (messagesEndRef.current && chatArray.length) {
        messagesEndRef.current.scrollTop =  messagesEndRef.current.scrollHeight;
      }
      const array = uniqueDate(chatArray);
      setDateArr(array);
    },[chatArray])
    // console.log("reciever",reciever)
    console.log("chatArray",chatArray)
  return (
    <>
        <div className=' w-[90%] h-[77vh] max-h-[80vh] overflow-y-scroll flex flex-col justify-start items-start' ref={messagesEndRef}>
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
                    {dateArr.length === chatArray.length && dateArr[index] !== "" && (
                      <div className={`w-full h-auto text-gray-950 first:mt-2 message-middle`}>
                        {dateArr[index]}
                      </div>
                    )}
                    <div className={`w-full h-auto text-gray-950 first:mt-2
                      ${reciever.userName ===  message.recieverUserName ? `message-orange` : `message-blue`}`}>
                        <p className={`font-semibold mb-1 first-letter:uppercase`}>
                          {userName === message.senderUserName ? `You` : message.senderUserName}
                        </p>
                        {message.content}
                        { message?.path && (
                          <>
                            <Download message={message} />
                          </>
                        )}
                        { message.image && (
                          <FileRenderer message={message} index={index} />
                        )}
                        {/* { message?.path && String(message?.path).includes('mp4') && (
                          <video width="320" height="240" controls>
                            <source src="/mov_bbb.mp4" type="video/mp4"/>
                            Your browser does not support the video tag.
                          </video> 
                        )} */}
                        <p className={`mt-1 text-end`}>
                          {dateFormatter(message.timeStamp)}
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