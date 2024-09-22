import React, { useState } from 'react';
import { useSetAtom } from 'jotai';
// Icons
import { MdOutlineDownload } from "react-icons/md";
// Components
import ImagePopup from '../ui/ImagePopup';
// Global States
import { 
  autoScrollStore, 
  chatArrayStore, } from '@/store/store';
// Api Services
import { postApiService } from '@/services/postApiService';

function FileRenderer({message, index}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const setChatArray = useSetAtom(chatArrayStore);

  const setAutoScroll = useSetAtom(autoScrollStore);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const updateState = (image) => {
    setAutoScroll(false);
    setChatArray(prev => {
      return [...prev].map((chat, i) => {
        if (i === index) {
          // Update the specific message's image
          return { ...chat, image };
        }
        return chat;
      })
    })
  }

  const getImage = async() => {
    try {
      setLoaded(false);
      const url = 'http://localhost:3000/api/get_image'
      const body = { file: message.path }
      const response = await postApiService(url,body);
      // console.log("response",response)
      updateState(response.image)
      setLoaded(true);
    } catch (error) {
      setLoaded(false);
      console.error("Error while getting Image");
    }
  }
 
  return (
    <>
      <div className='w-full h-auto relative'>
        <img alt={`Image ${index}`}
            src={`data:image/png;base64,${message.image}`}  
            className='h-auto w-full cursor-pointer'
            onClick={onOpenModal}
        />
        {
          !loaded && !message?.load && (
          <>
            <div className={`w-full h-full absolute top-0 left-0 grid place-content-center 
            bg-transparent backdrop-blur-md`}>
              <MdOutlineDownload className='size-9 cursor-pointer fill-white'
              onClick={getImage}
              />
            </div>
          </>
        )}
        
        <ImagePopup
          image={`data:image/png;base64,${message.image}`}
          index={index}
          onCloseModal={onCloseModal}
          open={open}
        />
      </div>
    </>
  )
}

export default FileRenderer