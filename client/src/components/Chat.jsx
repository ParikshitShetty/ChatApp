import React from 'react'
import Message from '../utils/Message'

const Chat = ({socketRef,wsResp,arr}) => {
  return (
    <>
      <div className='flex flex-col '>
        <div className='flex flex-1 md:w-200 bg-slate-500'>
          <div className='flex basis-1/2 justify-start'>
            left</div>
          <div className='flex flex-col basis-1/2 justify-end'>
            {arr.map((elem,index)=>(
              <div key={index} className='flex justify-end bg-neutral-700 mb-2 p-2  rounded'>{elem}</div>
            ))}</div>    
        </div>
        <div className='flex h-16'>
              <Message socketRef={socketRef}></Message>
        </div>   
    </div>
    </>
  )
}

export default Chat