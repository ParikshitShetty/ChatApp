import React, { useEffect, useState } from 'react'
import socket from '../utils/socket'

function ChatRenderer() {
    const [arr,setArr] = useState([]);

    useEffect(()=>{
        socket.on('receive_message',(data)=>{
            console.log("data",data)
            setArr((prev)=>{
                return [...prev,data]
            })
        })
      },[])

      console.log("arr",arr)
  return (
    <>
        <div className=' w-full h-[75vh] flex flex-col'>
           {arr?.map((elem)=>(
                <span>{elem.content}</span>
           ))}
        </div>
    </>
  )
}

export default ChatRenderer