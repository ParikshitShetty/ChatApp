import React, { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
// Global States
import { 
    chatArrayStore,
    connectedUsersListStore, 
    GroupChatModeState, 
    GroupDataState, 
    GroupState, 
    recieverStore, 
    senderIdStore,
    userNameStore} from '../store/store';
// Socket Io Singleton
import { initializeSocket } from '../utils/socket';

function Sidebar() {
    const connectedUsersList = useAtomValue(connectedUsersListStore);
    const sender = useAtomValue(senderIdStore);

    const [reciever,setReciever] = useAtom(recieverStore);

    const userName = useAtomValue(userNameStore);

    const [chatArray,setChatArray] = useAtom(chatArrayStore);

    const [groupChatMode,setGroupChatMode] = useAtom(GroupChatModeState);

    const groupDataArray = useAtomValue(GroupDataState);

    const [group,setGroup] = useAtom(GroupState);
    
    // console.log("recieverId",reciever);

    // console.log("connectedUsersList",connectedUsersList);

    // console.log("sender",sender)

    const getOldMessages = async(users) =>{
        // console.log("users",users)
        setGroup({
            groupName: null, 
            no_of_people_active: null 
        })
        setReciever(users);
        setChatArray([]);
        // Turn off groupChat mode if you are texting personally
        if(groupChatMode) setGroupChatMode(false);
        
        const Obj = { "reciever":users.userName, "sender":userName }
        try {
            const url = import.meta.env.VITE_READ_MESSAGES;
            const options = {
                method: "POST", 
                mode: "cors", 
                cache: "no-cache", 
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

    const getOldGroupMessages = async(groupData) =>{
        if(!groupChatMode) setGroupChatMode(true);

        console.log("groupData",groupData);

        setReciever({});
        setGroup(groupData);

        // { chatID: "ml4p5LmK2OUJ-AzNAAAB", userName: "striker", status: "online" }

        // console.log("users",users)
        // setReciever(users);
        // setChatArray([]);

        const socket = initializeSocket(userName);
        // const name = ;
        // const room = ;

        const obj = {
            id : socket.id,
            room : 'Group',
            sender : userName,
            // content : message.content
        }

        socket.emit("group_message", obj, (error) => {
            if (error) alert(error);
        });
        return
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

        const socket = initializeSocket(userName);
        socket.on("receive_group_message", (message) => {
            console.log("receive_group_message",message);
        });
    },[connectedUsersList])
  return (
    <>
        <div className='h-[90vh] w-4/12 flex flex-col justify-start items-start '>
            <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-b-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 ">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">All Users</h5>
               </div>
               <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {
                    [...connectedUsersList].filter(user => user.chatID !== sender).
                    map((users,index)=>(            
                    <li key={index} onClick={() => getOldMessages(users)}
                    className={`py-3 sm:py-4 ${reciever.chatID === users.chatID ? `bg-gray-200` : `dark:text-white`} cursor-pointer text-gray-900 rounded-xl`}>
                            <div className="flex items-center">
                                <div className="flex-1 min-w-0 ms-4">
                                    <p className="text-sm font-medium truncate first-letter:uppercase">
                                        {users.userName}
                                    </p>
                                </div>
                            </div>
                        </li>
                        ))
                    }
                    </ul>
               </div>
               {/* Group wise renderers */}
               <div className="flex items-center justify-between my-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Groups</h5>
               </div>
               <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        {groupDataArray.map((groupData)=>(
                            <li onClick={() => getOldGroupMessages(groupData)}
                            className={`py-3 sm:py-4 ${groupData.groupName === group.groupName ? `bg-gray-200 text-black` : `text-white `} cursor-pointer rounded-xl`}>
                                <div className="flex items-center">
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-sm font-medium truncate first-letter:uppercase">
                                            { groupData.groupName }  
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
               </div>
            </div>
        </div>
    </>
  )
}

export default Sidebar