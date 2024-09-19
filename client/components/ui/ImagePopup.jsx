import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function ImagePopup({open,onCloseModal,index,image}) {
  return (
    <>
        <Modal open={open} onClose={onCloseModal} center>
            <img alt={`Image Popup ${index}`}
                src={image}  
                className='h-full w-full cursor-pointer'
            />
        </Modal>
    </>
  )
}

export default ImagePopup