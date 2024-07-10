import React from 'react';
import { useAtomValue } from 'jotai';
// Global States
import { GroupState } from '../../store/store';

function GroupListItem({ groupData, getOldGroupMessages }) {
    const group = useAtomValue(GroupState);
  return (
    <>
        <li onClick={() => getOldGroupMessages(groupData)}
            className={`h-12 my-2 cursor-pointer text-gray-900 rounded-xl`}>
            <div className="flex items-center justify-start h-full">
                <div className="w-12 h-full rounded-3xl ml-2 py-1"
                style={{ backgroundColor : groupData.color }}>
                    <span className='h-full w-full flex justify-center items-center text-xl font-semibold'>
                        {groupData.groupName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className={`flex-1 min-w-0 h-full ms-4 rounded-xl inline-flex justify-center items-center transition-all duration-500 ease-in-out ${groupData.groupName === group.groupName ? `bg-gray-200 text-black` : `dark:text-white `}`}>
                    <p className="text-sm font-medium truncate first-letter:uppercase">
                        { groupData.groupName } 
                    </p>
                </div>
            </div>
        </li>
    </>
  )
}

export default GroupListItem