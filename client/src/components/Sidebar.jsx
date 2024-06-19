import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
// Global States
import { 
    connectedUsersListStore, 
    recieverStore, 
    senderIdStore} from '../store/store';

function Sidebar() {
    const connectedUsersList = useAtomValue(connectedUsersListStore);
    const sender = useAtomValue(senderIdStore);

    const [reciever,setReciever] = useAtom(recieverStore);
    console.log("recieverId",reciever);

    console.log("connectedUsersList",connectedUsersList);
  return (
    <>
        <div className='h-[80vh] w-2/5 flex flex-col justify-start items-start'>
            <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">All Users</h5>
                    {/* <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                        View all
                    </a> */}
               </div>
               <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {
                    [...connectedUsersList].filter(user => user.chatID !== sender).
                    map((users,index)=>(            
                    <li key={index} onClick={() => setReciever(users)}
                    className={`py-3 sm:py-4 ${reciever.chatID === users.chatID ? `bg-gray-200` : `dark:text-white`} cursor-pointer text-gray-900 rounded-xl`}>
                            <div className="flex items-center">
                                {/* <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
                                </div> */}
                                <div className="flex-1 min-w-0 ms-4">
                                    <p className="text-sm font-mediu truncate ">
                                        {users.userName}
                                    </p>
                                    {/* <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        email@windster.com
                                    </p> */}
                                </div>
                                {/* <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    $320
                                </div> */}
                            </div>
                        </li>
                        ))
                    }
                    </ul>
               </div>
            </div>
        </div>
    </>
  )
}

export default Sidebar