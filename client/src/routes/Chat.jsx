import React, { useEffect, useRef } from 'react'
import { useSetAtom } from 'jotai';
// Components
import ChatForm from '../components/ChatFrom'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ChatRenderer from '../components/ChatRenderer';
// Utils
import socket from '../utils/socket'
// Global states
import { 
  connectedUsersListStore,
  senderStore
} from '../store/store';

function Chat() {
    const ref = useRef(true);

    const setConnectedUsersList = useSetAtom(connectedUsersListStore);
    const setSender = useSetAtom(senderStore);
    
    useEffect(()=>{
      if (socket && ref.current) {
        socket.emit('message',{ username:"y7o", room:"1" });

        socket.on('users_list',(data)=>{
          setSender(data.currentUser)
          setConnectedUsersList(data.usersList)
        })

        ref.current = false;
      }
    },[]);

  return (
    <>
      <div className='h-full w-full flex flex-col justify-between items-center'>
        <Navbar />
        <div className='h-full w-full flex justify-between items-center'>
          <Sidebar />
          <div className='h-full w-full flex flex-col justify-end items-end'>
            <ChatRenderer />
            <ChatForm/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat