import React, { useState } from 'react';
// Components
import ImagePopup from '../ui/ImagePopup';

function FileRenderer({message, index}) {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <>
        <img alt={`Image ${index}`}
            src={`data:image/png;base64,${message.image}`}  
            className='h-auto w-full cursor-pointer'
            onClick={onOpenModal}
        />
        <ImagePopup
          image={`data:image/png;base64,${message.image}`}
          index={index}
          onCloseModal={onCloseModal}
          open={open}
        />
    </>
  )
}

export default FileRenderer