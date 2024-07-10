import React from 'react';
import { useAtomValue } from 'jotai';
// Global State
import { recieverStore } from '../../store/store';

function UserListItem({ users, getOldMessages }) {
  const reciever = useAtomValue(recieverStore);
  return (
    <>
      <li onClick={() => getOldMessages(users)}
        className={`h-12 my-2 cursor-pointer text-gray-900 rounded-xl`}>
          <div className="flex items-center justify-start h-full">
            <div className={`w-12 h-full rounded-3xl ml-2 py-1`}
            style={{ backgroundColor : users.color }}
            >
              <span className='h-full w-full flex justify-center items-center text-xl font-semibold'>
                {users.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={`flex-1 min-w-0 h-full ms-4 rounded-xl inline-flex justify-center items-center transition-all duration-500 ease-in-out ${reciever.chatID === users.chatID ? `bg-gray-200 ` : `dark:text-white `}`}>
              <p className="text-base font-medium truncate first-letter:uppercase ">
                {users.userName}
              </p>
            </div>
          </div>
      </li>
    </>
  )
}

export default UserListItem