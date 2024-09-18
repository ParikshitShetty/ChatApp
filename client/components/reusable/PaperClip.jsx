import React from 'react';
import { useAtom } from 'jotai';
import { FiPaperclip } from 'react-icons/fi';
// Global States
import { attachMentToggleState } from '@/store/store';

function PaperClip({ fileChangeHandle }) {
    const [attachmentToggle, setAttachmentToggle] = useAtom(attachMentToggleState);
    
    const toogleHandler = () => {
        setAttachmentToggle(prev => !prev);
    };
  return (
    <>
      <div className='w-12 absolute right-28 top-16 shadow-lg'>
          <FiPaperclip className={`w-7 h-7 ml-3 cursor-pointer bg-black 
            ${attachmentToggle ? `stroke-[#8774e1]` :  `stroke-white` }`} 
            onClick={toogleHandler} 
          />
          <input type='file' id='fileInput' onChange={fileChangeHandle}
          multiple
          className='hidden'/>
      </div>
    </>
  )
}

export default PaperClip