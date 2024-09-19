import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { FiPaperclip } from 'react-icons/fi';
// Global States
import { 
  attachMentToggleState, 
  uploadFilesStore, } from '@/store/store';

function PaperClip() {
    const [attachmentToggle, setAttachmentToggle] = useAtom(attachMentToggleState);

    const setFile = useSetAtom(uploadFilesStore);

    const toogleHandler = () => {
      setAttachmentToggle(prev => !prev);
    };

    const fileChangeHandle = (event) => {
      const InputFiles = Array.from(event.target.files);
      const fileArray = InputFiles.map( file => {
        return { fileBuf:file, name:file.name, type:file.type }
      })
      setFile(fileArray);
      setAttachmentToggle(false);
    }
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