import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { useSetAtom } from 'jotai';
// Global States
import { 
  initiateVedioCallState, 
  uploadFilesStore,} from '@/store/store';
// Icons
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineCameraAlt } from "react-icons/md";

const videoConstraints = {
  width: { min: 480 },
  height: { min: 720 },
  aspectRatio: 0.6666666667,
  facingMode: "user"
};

function CustomWebCam() {
  const webcamRef = useRef(null);

  const [webCamLoaded,setWebCamLoaded] = useState(false);

  const [imageSrc,setImageSrc] = useState('');

  const setInitiateVedioCall = useSetAtom(initiateVedioCallState);

  const setFile = useSetAtom(uploadFilesStore);

  const turnOffCamera = () => setInitiateVedioCall(false);

  const takeScreenshot = () => {
    const image = webcamRef.current.getScreenshot({width: 1920, height: 1080});
    console.log("image",image);
    setImageSrc(image);
  }

  const clearScreenshot = () => setImageSrc('');

  const base64ToFile = (base64Data, fileName, fileType) => {
    const byteString = atob(base64Data.split(',')[1]); // Decoding Base64 part
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([ab], { type: fileType });
    return new File([blob], fileName, { type: fileType });
  };

  const sendScreenShot = () => {
    const fileBuf = base64ToFile(imageSrc,'Screenshot.jpg','image/jpeg');
    setFile((prev) => [...prev, {fileBuf, name:'Screenshot.jpg', type:'image/jpeg'} ]);
    setImageSrc('');
  };

  useEffect(()=>{
    if(webcamRef.current.video){
      console.log("webcamRef",webcamRef.current);
      setWebCamLoaded(true);
    } else if (webCamLoaded) {
      setWebCamLoaded(false);
    }
  },[webcamRef])
  
  return (
    <>
      <div className="absolute top-[20%] left-[40%] z-20 p-2 rounded-lg bg-custom-pitch-dark">
        {webCamLoaded && (
          <div className='w-full h-full relative grid place-content-end'>
            <button className='bg-green-600 p-2 m-2 w-fit rounded-lg focus:scale-90
            transition-all duration-500 ease-in-out'
              onClick={turnOffCamera}
            >
              Close
            </button>
          </div>
        )}
        {imageSrc ? 
            <img className='w-[650px] h-auto'
              src={imageSrc} 
              alt="Screenshot"
            />
          : (
          <Webcam
            height={600} 
            width={600} 
            ref={webcamRef}
            // audio
            mirrored={true}
            videoConstraints={videoConstraints}
            screenshotFormat='image/jpeg'
          />
        )}
        {webCamLoaded && (
          <>
            <button className='absolute bottom-10 right-5 rounded-full p-3
            transition-all duration-500 ease-in-out focus:scale-90'
              onClick={takeScreenshot}
            >
              <MdOutlineCameraAlt className='w-10 h-8 mt-1' />  
            </button> 
          </>
        )} 
        {imageSrc && (
          <>
            <button 
            onClick={clearScreenshot}
            className='absolute bottom-32 right-5 rounded-full p-3 bg-white/80 backdrop-blur-3xl 
            shadow-lg transition-all duration-500 ease-in-out focus:scale-90'>
              <RxCross2 className='text-red-500 size-8' />
            </button>
            
            <button 
            onClick={sendScreenShot}
            className='absolute bottom-10 right-5 rounded-full p-3 bg-white/80 
            backdrop-blur-3xl shadow-lg transition-all duration-500 ease-in-out focus:scale-90'>
              <FaCheck className='fill-green-500 size-8' />
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default CustomWebCam