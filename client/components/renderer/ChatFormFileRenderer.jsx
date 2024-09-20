import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
// Icons
import { MdOutlineClear } from "react-icons/md";
// Global States
import { 
  fileSizeStore, 
  uploadFilesStore, } from '@/store/store';
// Components
import ImagePopup from '../ui/ImagePopup';
// Common Functions
import { formatFileSize } from '@/common/fileSizeCalculator';

function ChatFormFileRenderer() {
  const [file, setFle] = useAtom(uploadFilesStore);

  const [divHeight, setDivHeight] = useState(0);

  const [open, setOpen] = useState(false);

  const [imgSrc, setImgSrc] = useState('');

  const [fileSize, setFileSize] = useAtom(fileSizeStore);

  const ref = useRef(null);

  const clearFiles = () => setFle([]);

  const clearOne = (index) => {
    let arr = [...file];
    arr.splice(index,1);
    setFle(arr);
  };

  const onOpenModal = (url) => {
    url = URL.createObjectURL(url)
    setOpen(true);
    setImgSrc(url);
  }

  const onCloseModal = () => {
    setOpen(false);
    URL.revokeObjectURL(imgSrc);
    setImgSrc('');
  }

  useEffect(() => {
    if (ref.current) {
      setDivHeight(ref.current.offsetHeight);
    }
  }, [ref,file]);

  useEffect(() => {
    if(file.length === 0) return setFileSize(false);

    let bytes = 0;
    file.map((f) => bytes += f.fileBuf.size);
    const total = formatFileSize(bytes,2);
    if (total.length > 8 && total.includes('MB')) setFileSize(true);
    else setFileSize(false);
  }, [file]);

  return (
    <>
      <div 
        ref={ref}
        className={`mr-[15%] -pt-2 h-auto max-h-40 z-10 flex justify-stretch items-center flex-wrap 
          bg-custom-pitch-dark overflow-y-scroll rounded-md ${fileSize && `border-2 border-red-500`}`}
        style={{
          position:'absolute',
          left: `8%`,
          top: divHeight <= 46 
          ? ( Math.floor(divHeight / 46) === 0 ? 0 : -1 * Math.ceil(divHeight / 46) * 30 + `px` ) 
          : ( Math.floor(divHeight / 70) === 0 ? 0 : -1 * Math.ceil(divHeight / 70) * 45 + `px` )
        }}
      >
        {file.length > 0 && (
          <>
            <button onClick={clearFiles} className='border rounded-lg p-1 hover:bg-[#353535] 
            focus:scale-90 inline-flex justify-center items-center
            transition-all duration-300 ease-in-out'>
              Clear All
              <MdOutlineClear className='w-6 h-6 cursor-pointer'/>
            </button>

            {file?.map((fileName,index) => 
              <div key={index} className='p-1.5 m-1 rounded-lg border bg-[#2b2b2b] relative overflow-x-hidden flex justify-center items-center'>
                {fileName?.type.includes('image/') ? (
                  <img 
                    src={URL.createObjectURL(fileName.fileBuf)} 
                    alt={fileName?.name}
                    onClick={() => onOpenModal(fileName.fileBuf)}
                    className='w-12 h-12 cursor-pointer'
                  />
                ) : (
                  <p className='break-all'>&nbsp;{fileName?.name}</p>
                )}
                <MdOutlineClear onClick={() => clearOne(index)}
                className='absolute -top-0.5 -right-0.5 bg-[#353535] cursor-pointer rounded-full
                transition-all duration-300 ease-in-out focus:scale-90' 
                />
              </div>
            )}
            {/* To Check total size of files */}
            {fileSize && (
              <span className='text-red-500' autoFocus>
                Size has exceeded more than 100MB
              </span>
            )}
          </>
        )}
        <ImagePopup
          open={open}
          image={imgSrc}
          index={'Popup Image'}
          onCloseModal={onCloseModal}
        />
      </div>
    </>
  )
}

export default ChatFormFileRenderer