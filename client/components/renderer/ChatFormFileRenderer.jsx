import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
// Icons
import { MdOutlineClear } from "react-icons/md";
// Global States
import { uploadFilesStore } from '@/store/store';

function ChatFormFileRenderer() {
  const [file, setFle] = useAtom(uploadFilesStore);

  const [divHeight, setDivHeight] = useState(0);

  const ref = useRef(null);

  const clearFiles = () => setFle([]);

  const clearOne = (index) => {
    let arr = [...file];
    arr.splice(index,1);
    setFle(arr);
  };

  useEffect(() => {
    if (ref.current) {
      setDivHeight(ref.current.offsetHeight);
    }
  }, [ref,file]);

  return (
    <>
      <div 
        ref={ref}
        className={`mr-[15%] -pt-2 h-auto max-h-40 z-10 flex justify-stretch items-center flex-wrap 
          bg-custom-pitch-dark overflow-y-scroll `}
        style={{
          position:'absolute',
          left: `8%`,
          top: Math.floor(divHeight / 46) === 0 ? 0 : -1 * Math.ceil(divHeight / 46) * 30 + `px`,
        }}
      >
        {file.length > 0 && (
          <>
            <button onClick={clearFiles} className='border rounded-lg p-1 hover:bg-[#353535] 
            focus:scale-90
            transition-all duration-300 ease-in-out'>
              <MdOutlineClear className='w-6 h-6 cursor-pointer'/>
            </button>
            
            {file?.map((fileName,index) => 
              <div key={index} className='p-1.5 m-1 rounded-lg border bg-[#2b2b2b] relative overflow-x-hidden'>
                <p className='break-all'>&nbsp;{fileName?.name}</p>
                <MdOutlineClear onClick={() => clearOne(index)}
                className='absolute -top-0.5 -right-0.5 bg-[#353535] cursor-pointer rounded-full' 
                />
                {fileName?.type.includes('image')}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ChatFormFileRenderer