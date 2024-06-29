import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
// Global States
import { 
    chatArrayStore,
    connectedUsersListStore, 
    groupchatArrayStore, 
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

    const setGroupChatArray =  useSetAtom(groupchatArrayStore);

    const [toogle,setToggle] = useState(false);
    
    // console.log("recieverId",reciever);

    // console.log("connectedUsersList",connectedUsersList);

    // console.log("sender",sender)

    const groupViewChange = () =>{
        if (toogle) return
        setToggle(true);
    }

    const individualViewChange = () =>{
        if (!toogle) return
        setToggle(false);
    }

    const getOldMessages = async(users) =>{
        // console.log("users",users)
        // Return if you are clicking on the same user twice
        if (reciever?.userName === users.userName) return;

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

        // console.log("groupData",groupData);

        if (group?.groupName === groupData.groupName) return;

        setReciever({});
        setGroup(groupData);

        setGroupChatArray([]);
        
        const Obj = {  }
        try {
            const url = import.meta.env.VITE_READ_GROUP_MESSAGES;
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

            console.log("responseJson",responseJson.messages);
            setGroupChatArray(responseJson.messages);
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

    useEffect(() => {
        const socket = initializeSocket(userName);
        if (groupChatMode) {
            const messageObj = {
                room : group.groupName,
                sender : userName,
            }
            socket.emit('join_group', messageObj);
        }
    }, [groupChatMode])
    
  return (
    <>
        <div className='h-[100vh] w-[27%] flex flex-col justify-start items-start border-r border-gray-700 '>
            <div className="w-full max-w-md h-full max-h-full p-4 bg-white rounded-r-lg shadow shadow- sm:p-8 dark:bg-custom-pitch-dark dark:border-gray-200 ">

                <div className='w-full h-20 flex justify-evenly items-center'>
                    <div onClick={individualViewChange}
                    className={`w-1/3 ${toogle ? `bg-black text-white` :`bg-gray-300 text-black`} font-semibold h-2/3 inline-flex items-center justify-center mx-2 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out`}>
                        Users
                    </div>
                    <div onClick={groupViewChange}
                    className={`w-1/3 ${toogle ? `bg-gray-300 text-black` :`bg-black text-white`} font-semibold h-2/3 inline-flex items-center justify-center mx-2 rounded-2xl cursor-pointer transition-all duration-500 ease-in-out`}>
                        Groups
                    </div>
                </div>
                {
                    !toogle 
                    ?
                        <>
                           <div className="flow-root">
                                {/* <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700"> */}
                                <ul role="list" className="">
                                {
                                [...connectedUsersList].filter(user => user.chatID !== sender).
                                map((users,index)=>(            
                                    <li key={index} onClick={() => getOldMessages(users)}
                                    className={`h-12 my-2 cursor-pointer text-gray-900 rounded-xl`}>
                                        <div className="flex items-center justify-start h-full">
                                            <div className="w-12 h-full rounded-3xl bg-gray-200 ml-2 py-1">
                                                <span className='h-full w-full my-1'>
                                                </span>
                                                {/* <img src="" alt="" /> */}
                                            </div>
                                            <div className={`flex-1 min-w-0 h-full ms-4 rounded-xl inline-flex justify-center items-center transition-all duration-500 ease-in-out ${reciever.chatID === users.chatID ? `bg-gray-200 ` : `dark:text-white `}`}>
                                                <p className="text-md font-medium truncate first-letter:uppercase ">
                                                    {users.userName}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    ))
                                }
                                </ul>
                           </div>
                        </>
                    :
                        <>
                           {/* Group wise renderers */}
                           <div className="flow-root">
                                <ul role="list" className="">
                                    {groupDataArray.map((groupData,index)=>(
                                        <li key={index} onClick={() => getOldGroupMessages(groupData)}
                                        className={`h-12 my-2 cursor-pointer text-gray-900 rounded-xl`}>
                                            <div className="flex items-center justify-start h-full">
                                                <div className="w-12 h-full rounded-3xl bg-gray-200 ml-2 py-1">
                                                    <span className='h-full w-full my-1'>
                                                    </span>
                                                    {/* <img src="" alt="" /> */}
                                                </div>
                                                <div className={`flex-1 min-w-0 h-full ms-4 rounded-xl inline-flex justify-center items-center transition-all duration-500 ease-in-out ${groupData.groupName === group.groupName ? `bg-gray-200 text-black` : `dark:text-white `}`}>
                                                    <p className="text-sm font-medium truncate first-letter:uppercase">
                                                        Join { groupData.groupName } Group 
                                                        {/* Join Group Chat */}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                           </div>
                        </>
                }
            </div>
        </div>
    </>
  )
}

export default Sidebar