import React, { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { useAtomValue } from 'jotai';
// Global States
import { 
  initiateVedioCallState, 
  userNameStore, } from '@/store/store';
import { initializeSocket } from '@/utils/socket';

const videoConstraints = {
  width: { min: 480 },
  height: { min: 720 },
  aspectRatio: 0.6666666667,
  facingMode: "user"
};

function CustomWebCam() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [capturing,setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const userName = useAtomValue(userNameStore);

  const [imageSrc,setImageSrc] = useState('');

  const initiateVedioCall = useAtomValue(initiateVedioCallState);

  const takeScreenshot = () => {
    const image = webcamRef.current.getScreenshot({width: 1920, height: 1080});
    console.log("image",image);
    setImageSrc(image);
  }
  
  return (
    <>
      <div className="absolute top-[20%] left-[40%] z-20">
        <Webcam 
          height={600} 
          width={600} 
          ref={webcamRef}
          // audio
          mirrored={true}
          videoConstraints={videoConstraints}
          screenshotFormat='image/jpeg'
        />    
        <button onClick={takeScreenshot}>Take Screnshot</button>   
        {imageSrc &&
          <img src={imageSrc} alt="Screenshot" />
        } 
      </div>
    </>
  )
}

export default CustomWebCam