import React from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
// Global States
import { 
    userNameStore } from '@/store/store';

function LoginForm() {
  const [userName,setUserName] = useAtom(userNameStore);

  console.log("userName",userName)

  const Login = () => {
    const url = 'http://localhost:3000/auth/google';
    window.location.assign(url);
    // if(userName !== '') loginState(true);
  }

  return (
    <>
      <div className='w-screen min-h-screen absolute z-[1000] backdrop-blur grid place-items-center'>
        <div className='w-full h-1/2 '>
            <div className='w-full h-full flex flex-col justify-center items-center '>
                <span className='font-semibold text-2xl'>Enter Details to Chat</span>
                  <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  onClick={Login}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Login With Google
                    </span>
                  </button>
              </div>
        </div>
      </div>
    </>
  )
}

export default LoginForm