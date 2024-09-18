import React from 'react'

function ChatFormFileRenderer({file}) {
  return (
    <>
        <div className='absolute top-1 left-[8%] flex '>
            {file.length > 0 && <>Files:</>}
            {file?.map((fileName,index) =>(
             <p key={index} className=''>&nbsp;{fileName?.name}</p>
            ))}
        </div>
    </>
  )
}

export default ChatFormFileRenderer