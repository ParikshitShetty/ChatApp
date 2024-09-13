import React, { useRef } from 'react'
import Webcam from 'react-webcam'

function CustomWebCam() {
    const webcamRef = useRef(null);
  return (
    <>
        <div className="absolute top-[20%] left-[40%] z-20">
            <Webcam height={600} width={600} ref={webcamRef} />
        </div>
    </>
  )
}

export default CustomWebCam