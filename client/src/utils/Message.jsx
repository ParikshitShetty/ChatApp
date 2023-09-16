import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { messageAdder,messageDeleter } from '../redux/actions/MessageAction';


const Message = ({socketRef}) => {

    const messageRedData = useSelector((state)=> state.MessageReducer);

    const message = messageRedData.message;

    const [clientId, setClientId] = useState(0);

    const dispatch = useDispatch();

    const handleMessageChange = (event) =>{
        dispatch(messageAdder(event.target.value));
    }
    console.log(parseInt(Math.random()));

    const sendMessage = () =>{
        console.log(messageRedData)
        // clientId = Math.random()
        if (socketRef.current.readyState === WebSocket.OPEN) {
            const data = JSON.stringify({ clientId, message });
            if (message.length > 0) {
            socketRef.current.send(data);
            dispatch(messageDeleter(''));
            }
          } else {
            console.log('WebSocket connection is not open.');
          }
    }

    const handleKeyPress = (event) =>{
        if (event.key === 'Enter') {
          sendMessage();
        }
    }
    console.log(messageRedData)
  return (
    <>
        <div className='flex w-full'>
            <span className='basis-11/12 '>
                <input type="text" className='h-12 lg:w-[65.5rem] xl:w-300 ml-2 mt-2 font-semibold rounded text-black placeholder-slate-950' placeholder='Type a message....' value={messageRedData.message} onChange={handleMessageChange} onKeyDown={handleKeyPress}/>
            </span>
            <span className='basis-1/12 my-auto flex justify-end'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 flex justify-end" onClick={sendMessage}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </span>
        </div>
    </>

  )
}

export default Message