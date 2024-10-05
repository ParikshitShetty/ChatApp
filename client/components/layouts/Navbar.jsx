import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useRef } from 'react'
import { LuLogOut } from "react-icons/lu";
import { HiMiniVideoCamera, HiMiniVideoCameraSlash } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
// Global States
import { 
  GroupChatModeState,
    GroupState,
    initiateVedioCallState,
    recieverStore,
    userNameStore} from '@/store/store';

function Navbar() {
    const [userName,setUserName] = useAtom(userNameStore);

    const reciever = useAtomValue(recieverStore);

    const groupChatMode = useAtomValue(GroupChatModeState);

    const group = useAtomValue(GroupState);

    const [initiateVedioCall,setInitiateVedioCall] = useAtom(initiateVedioCallState);

    const navigate = useNavigate();

    const startVedioCall = () => {
      if(!initiateVedioCall) setInitiateVedioCall(true);
    };

    const endVedioCall = () => {
      if(initiateVedioCall) setInitiateVedioCall(false);
    };

    useEffect(() => {
        endVedioCall();
    },[reciever])

    const logOut = () => {
      navigate('/logout');
    }

    // console.log("reciever",reciever)

  return (
    <>
        <nav className="bg-white dark:bg-transparent w-full h-[10vh] z-20 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
                {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  Chat
                </span> */}

                { groupChatMode?
                  <div className=' flex justify-center items-center'>  
                    <span className="text-white font-semibold rounded-lg text-xl px-4 py-1 text-center first-letter:uppercase">
                      {group.groupName}
                    </span>
                  </div>
                :
                  <div className=' flex justify-center items-center'>
                    { reciever.userName &&
                      <span className="text-white font-semibold rounded-lg text-xl px-4 py-1 text-center first-letter:uppercase">
                        {reciever.userName}
                      </span>
                    }

                    {reciever.status &&
                    <span className={`relative mt-1.5 rounded-full w-4 h-4 inline-block self-center ${reciever.status === 'online' ? `bg-green-500` : `bg-red-500`}`}>
                    </span>
                    }
                  </div>
                }

              <div className="flex justify-center items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                {/* <div className="text-white font-medium rounded-lg text-sm px-8 py-2 text-center">
                  {
                    reciever.userName && (
                      initiateVedioCall 
                      ?
                        <HiMiniVideoCameraSlash className='w-6 h-6 cursor-pointer fill-red-600'
                          onClick={endVedioCall}
                        />
                      :
                        <HiMiniVideoCamera className='w-6 h-6 cursor-pointer' 
                          onClick={startVedioCall}
                        />
                  )}
                </div> */}
                <div
                  className="text-white bg-blue-700 font-medium rounded-lg text-sm px-8 py-2 text-center dark:bg-blue-600 first-letter:uppercase"
                >
                  {userName}
                </div>
                <div className='pl-3'>
                  <LuLogOut className='w-7 h-7 cursor-pointer' onClick={logOut}/>
                </div>
              </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar