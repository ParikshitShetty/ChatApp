import React from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
  return (
    <>
    <div className="absolute z-10 right-10 top-16 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
      <div className="px-4 py-3">
        <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
        <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={()=>navigate('/login')}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
        </span>
      </div>
    </div>
    </>
  )
}

export default Profile