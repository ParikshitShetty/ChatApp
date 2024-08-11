import React, { useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

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
            
        <Modal open={open} onClose={onCloseModal} center>
            <img alt={`Image Popup ${index}`}
            src={`data:image/png;base64,${message.image}`}  
            className='h-full w-full cursor-pointer'
            onClick={onOpenModal}
            />
        </Modal>
    </>
  )
}

export default FileRenderer