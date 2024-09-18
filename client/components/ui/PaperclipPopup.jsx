import React from 'react';
import { useAtom } from 'jotai';
// Icons
import { IoDocumentOutline } from 'react-icons/io5';
import { MdOutlineCameraAlt } from 'react-icons/md';
// Global States
import { initiateVedioCallState } from '@/store/store';

function PaperclipPopup() {
  const [initiateVedioCall,setInitiateVedioCall] = useAtom(initiateVedioCallState);

    const toggleWebCam = () => {
      if(!initiateVedioCall) setInitiateVedioCall(true);
    }

    const handleClick = () => {
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.click();
    }

  return (
    <>
        <div className='w-auto h-[85%] bg-[#2b2b2b] z-20 p-3 rounded-xl flex flex-col justify-between items-center  
            absolute right-32 bottom-16'>
            <span className='cursor-pointer inline-flex justify-between items-center w-full'
            onClick={toggleWebCam}
            >
              <MdOutlineCameraAlt className='w-6 h-6' /> &nbsp; Camera
            </span>
            <button className='cursor-pointer inline-flex justify-between items-center w-full'
            onClick={handleClick}
            >
              <IoDocumentOutline className='w-6 h-6' /> &nbsp; Document
            </button>
        </div>
    </>
  )
}

export default PaperclipPopup