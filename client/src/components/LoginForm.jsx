import React, { useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
// Global States
import { 
    loginStateStore,
    userNameStore } from '../store/store';

function LoginForm() {
  const [userName,setUserName] = useAtom(userNameStore);

  const loginState = useSetAtom(loginStateStore);

  const inputRef = useRef(null);

  const InputHandler = (event) =>{
    const { value } = event.target;
    setUserName(value);
  };

  const LoginFormSubmit = async(event) =>{
      event.preventDefault();
      try {
        if(userName !== '') loginState(true);
      } catch (error) {
        console.error("Error while making api request:",error);
        loginState(false);
      }
  };

  useEffect(()=>{
    if (inputRef) {
      inputRef.current.focus()
    }
  },[])

  console.log("userName",userName)

  return (
    <>
      <div className='w-screen min-h-screen absolute z-[1000] backdrop-blur grid place-items-center'>
        <div className='w-full h-1/2 '>
            <div className='w-full h-full flex flex-col justify-center items-center '>
                <span className='font-semibold text-2xl'>Enter Details to Chat</span>
                <form className="w-2/3 sm:w-1/3 md:w-1/3 lg:w-1/4 h-full mx-auto" onSubmit={LoginFormSubmit}>
                  <div className="my-5 ">
                    <label htmlFor="email" className="block mb-2 text-md font-medium">Username</label>


                    <input type="user_name" id="user_name" name='user_name'
                        className="bg-transparent border-2 border-gray-300 text-gray-50 text-sm rounded-lg block w-full p-2.5 " 
                        placeholder="user name" required 
                        ref={inputRef} 
                        value={userName} onChange={InputHandler}/>
                  </div>
                  <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Enter
                    </span>
                  </button>
                </form>
              </div>
        </div>
      </div>
    </>
  )
}

export default LoginForm