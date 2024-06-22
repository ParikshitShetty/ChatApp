import { useAtomValue } from 'jotai';
import React from 'react'
// Global States
import { 
    recieverStore,
    userNameStore} from '../store/store';

function Navbar() {
    const userName = useAtomValue(userNameStore);

    const reciever = useAtomValue(recieverStore);

    // console.log("reciever",reciever)

  return (
    <>
        <nav className="bg-white dark:bg-gray-900 w-full h-[20%] z-20 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  Chat
                </span>

                
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
                
              <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <div
                  className="text-white bg-blue-700 font-medium rounded-lg text-sm px-8 py-2 text-center dark:bg-blue-600 first-letter:uppercase"
                >
                  {userName}
                </div>
              </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar