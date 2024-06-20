import React, { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
// Global States
import { 
    chatArrayStore,
    connectedUsersListStore, 
    recieverStore, 
    senderIdStore,
    userNameStore} from '../store/store';

function Sidebar() {
    const connectedUsersList = useAtomValue(connectedUsersListStore);
    const sender = useAtomValue(senderIdStore);

    const [reciever,setReciever] = useAtom(recieverStore);

    const userName = useAtomValue(userNameStore);

    const [chatArray,setChatArray] = useAtom(chatArrayStore);
    // console.log("recieverId",reciever);

    // console.log("connectedUsersList",connectedUsersList);

    // console.log("sender",sender)

    const getOldMessages = async(users) =>{
        setReciever(users);
        setChatArray([]);
        
        const Obj = { "reciever":users.userName, "sender":userName }
        try {
            const url = import.meta.env.VITE_READ_MESSAGES;
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
                body: JSON.stringify(Obj)
            };
            const response = await fetch(url,options);
            const responseJson = await response.json();

            console.log("responseJson",responseJson);
            setChatArray(responseJson.filteredMessages);
        } catch (error) {
            console.error("Error while getting older messages : ",error)
        }
    }

    useEffect(()=>{
        if (connectedUsersList.length && reciever?.userName) {
            const user = connectedUsersList.find(users => users.userName === reciever?.userName);
            setReciever(user)
        }
    },[connectedUsersList])
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
                    <li key={index} onClick={() => getOldMessages(users)}
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