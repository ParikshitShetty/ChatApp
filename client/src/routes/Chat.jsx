import React, { useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai';
// Components
import ChatForm from '../components/ChatFrom'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ChatRenderer from '../components/ChatRenderer';
// Global states
import { 
  connectedUsersListStore,
  GroupChatModeState,
  recieverStore,
  senderIdStore,
  userNameStore
} from '../store/store';
// Utils
import { initializeSocket } from '../utils/socket'
import GroupChatRenderer from '../components/GroupChatRenderer';
// Common functions
import { randomHexColorCode } from '../common/colorGenerator';

function Chat() {
    const ref = useRef(true);

    const userName = useAtomValue(userNameStore);

    const setConnectedUsersList = useSetAtom(connectedUsersListStore);
    const setSenderId = useSetAtom(senderIdStore);

    const reciever = useAtomValue(recieverStore);

    const groupChatMode = useAtomValue(GroupChatModeState);
    
    useEffect(()=>{
      const socket = initializeSocket(userName);

      // TO get all the users connected to the network
      socket.on('users_list',(data)=>{
        const arr = [...data.usersList].map(item => {
          return {...item, color : randomHexColorCode() }
        });
        console.log("users_list",arr);
        setConnectedUsersList(arr)
      })

      // To the user of a tab
      socket.on('current_user',(data)=>{
        // console.log("data",data)
        setSenderId(data.chatID);
      })

      ref.current = false;
      return ()=>{
        socket.removeListener('users_list');
        socket.removeListener('current_user');
      }
    },[]);
    // console.log("userName",userName)
  return (
    <>
      <div className='h-full w-full flex justify-between items-center '>
        <Sidebar />
        <div className='h-full w-[73%] flex flex-col justify-center items-center'>
          <Navbar />
          <main className='h-full w-full flex flex-col justify-end items-end'>
            {groupChatMode ?
              <>
                <GroupChatRenderer />
                <ChatForm />
              </>
              :
              reciever.chatID ?
              <>
                <ChatRenderer />
                <ChatForm />
              </>
              :
              <>
                <div className='h-[90vh] w-full flex flex-col justify-center items-center font-semibold'>
                  Select Users to Chat
                </div>
              </>
            }
          </main>
        </div>
      </div>
    </>
  )
}

export default Chat