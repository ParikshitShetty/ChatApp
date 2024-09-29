import React, { useEffect, useRef } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useLocation, useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';
// Components
import ChatForm from '@/components/forms/ChatFrom'
import Sidebar from '@/components/layouts/Sidebar';
import Navbar from '@/components/layouts/Navbar';
import ChatRenderer from '@/components/renderer/ChatRenderer';
import CustomWebCam from '@/components/webcam/CustomWebCam';
// Global states
import { 
  connectedUsersListStore,
  GroupChatModeState,
  initiateVedioCallState,
  recieverStore,
  senderIdStore,
  userNameStore
} from '@/store/store';
// Utils
import { initializeSocket } from '@/utils/socket'
import GroupChatRenderer from '@/components/renderer/GroupChatRenderer';
// Common functions
import { randomHexColorCode } from '@/common/colorGenerator';

const getCookie = () => {
  return Cookies.get('user');
};

function Chat() {
    const ref = useRef(true);

    const [userName, setUserName] = useAtom(userNameStore);

    const setConnectedUsersList = useSetAtom(connectedUsersListStore);
    const setSenderId = useSetAtom(senderIdStore);

    const reciever = useAtomValue(recieverStore);

    const groupChatMode = useAtomValue(GroupChatModeState);

    const initiateVedioCall = useAtomValue(initiateVedioCallState);
    
    const validateUser = async() => {
      try {
        const options = {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "include", //include is used to set cookies
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer", 
          body: JSON.stringify(Obj)
      };
        const resp = await fetch("http://localhost:3000/auth/profile",options);
        const json = await resp.json();
        console.log("respJson",json)
        if(json.redirect) {
          window.location.assign(`http://localhost:3000`);
        }
        // {message:"User is not authenticated",redirect:true, url:'/auth/google'}
      } catch (error) {
        console.error("Error while checking profile:",error)
      }
    }

    useEffect(()=>{
      const cookie = getCookie();
      if (cookie && cookie !== userName) {
        setUserName(cookie);
      }
      const socket = initializeSocket(cookie);

      // TO get all the users connected to the network
      const userList = import.meta.env.VITE_SOCKET_USER_LIST;
      socket.on(userList,(data)=>{
        const arr = [...data.usersList].map(item => {
          return {...item, color : randomHexColorCode() }
        });
        // console.log("users_list",arr);
        setConnectedUsersList(arr)
      })

      // To the user of a tab
      const currentUser = import.meta.env.VITE_SOCKET_CURRENT_USER;
      socket.on(currentUser,(data)=>{
        // console.log("data",data)
        setSenderId(data.chatID);
      })

      ref.current = false;
      return ()=>{
        const userList = import.meta.env.VITE_SOCKET_USER_LIST;
        const currentUser = import.meta.env.VITE_SOCKET_CURRENT_USER;
        
        socket.removeListener(userList);
        socket.removeListener(currentUser);
      }
    },[]);
    // console.log("userName",userName)
  return (
    <>
      <div className='h-full w-full flex justify-between items-center'>
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
                { initiateVedioCall && (
                  <CustomWebCam />
                )}
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