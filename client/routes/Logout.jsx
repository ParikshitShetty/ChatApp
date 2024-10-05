import React, { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
// Components
import Loader from '@/components/ui/Loader';
// Global States
import { userNameStore } from '@/store/store';

function Logout() {
  const renderRef = useRef(true);

  const setUserName = useSetAtom(userNameStore);

  useEffect(()=> {
    if (renderRef.current) {
      setUserName('')
      window.location.assign("http://localhost:3000/auth/logout");
      renderRef.current = false;
    }
  },[]);
  return (
    <>
      <div className='min-h-screen w-full grid place-items-center'>
        <span className='inline-flex items-center justify-center'>
          Logging you Out <Loader type={'spin'} /> 
        </span>
      </div>
    </>
  )
}

export default Logout