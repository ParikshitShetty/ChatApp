import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai';
import { MdDownloadForOffline } from "react-icons/md";
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
import { uniqueDate } from '../../common/uniqueDate';

function ChatRenderer() {
    const [chatArray,setChatArray] = useAtom(chatArrayStore);

    const [dateArr,setDateArr] = useState([]);

    const reciever = useAtomValue(recieverStore);

    const userName = useAtomValue(userNameStore);

    const chatLoader = useAtomValue(chatLoaderState);

    const ref = useRef(true);

    const messagesEndRef = useRef(null);

    const fileNameSplitter = (filename) => {
      const array = String(filename).split('/');
      const finalName = array[(array.length - 1)];
      return finalName;
    }

    const downloadFile = async(file) => {
      try {
        const url = import.meta.env.VITE_DOWNLOAD_FILE;
        const options = {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", //include is used to set cookies
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer", 
          body: JSON.stringify({file})
        };
        const response = await fetch(url,options);
        const responseBlob = await response.blob();

        const downloadUrl = window.URL.createObjectURL(responseBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = file.split('/').pop(); // Extract the file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Error while downloading file: ",error)
      }
    }

    useEffect(()=>{
        const socket = initializeSocket(userName);

        if (ref.current) {
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
                        {/* {dateArr[index].split('-')[2] + ' ' + dateArr[index].split('-')[1] + ' ' + dateArr[index].split('-')[0] } */}
                      </div>
                    )}
                    <div className={`w-full h-auto text-gray-950 first:mt-2
                      ${reciever.userName ===  message.recieverUserName ? `message-orange` : `message-blue`}`}>
                        <p className={`font-semibold mb-1 first-letter:uppercase`}>
                          {userName === message.senderUserName ? `You` : message.senderUserName}
                        </p>
                        {message.content}
                        {message?.path && (
                          <>
                            <div className='flex justify-between items-center py-1 '>
                              <p className='first-letter:uppercase'>{fileNameSplitter(message?.path)}</p>
                              <MdDownloadForOffline onClick={() => downloadFile(message?.path)}
                              className='w-6 h-6 cursor-pointer' />
                            </div>
                          </>
                        )}
                        <p className={`mt-1 text-end`}>
                          {/* {redisIdToDateTimeConverter(message.timeStamp,true)} */}
                          {message.timeStamp}
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