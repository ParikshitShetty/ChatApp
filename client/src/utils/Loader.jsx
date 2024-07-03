import React from 'react'
import ReactLoading from 'react-loading';

function Loader({type}) {
  // const types = ['balls','bars','blank','bubbles','cubes','cylon','spin','spinningBubbles','spokes']
  return (
    <>
        <div className='w-full h-full flex flex-col justify-center items-center'>
            {/* <ReactLoading type="spokes" color='white' height={10} /> */}
            <ReactLoading type={type} color='white' height={10} />
        </div>
    </>
  )
}

export default Loader