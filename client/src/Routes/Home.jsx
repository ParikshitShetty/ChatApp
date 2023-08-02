import React, { useEffect,useState,useRef } from 'react'
import useWebSocket from "react-use-websocket" 
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Chat from '../components/Chat'
import Message from '../utils/Message'
import { useDispatch, useSelector } from 'react-redux'

const Home = () => {

    const messageRedData = useSelector((state)=> state.MessageReducer);

    const socketRef = useRef(null);

    const [wsResp, setWsResp] = useState('');

    const [clientId, setClientId] = useState('');

    const [arr,setArr] = useState([]);

    const message = messageRedData.message

    let greeting = 'parikshit';

    useEffect(()=>{
        socketRef.current = new WebSocket('ws://127.0.0.1:4000') 

        socketRef.current.onOpen = () =>{
                console.log("WebSocket connection established.");
            }

        socketRef.current.onmessage = (event) => {
            console.log('Received from server:', event.data);
            setWsResp(event.data)
            if(event.data instanceof Blob){
              event.data.text().then((a)=>{
                setWsResp(JSON.parse(a))
              })
            }else{
              setWsResp(event.data)
            }
          };

        socketRef.current.onclose = () => {
                console.log("connection was closed");
            }
        return () => socketRef.current.close();
    },[])

    useEffect(() => {
      if (wsResp.message !== undefined) {
        let newar =[...arr,wsResp.message];
        setArr(newar)
      }
    }, [wsResp])
    
    console.log('array',arr);
    console.log('ws data recieved from server',wsResp);
    //console.log('=========================')
    
    const sendMessage = () => {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          const data = JSON.stringify({ clientId, message });
          socketRef.current.send(data);
        } else {
          console.log('WebSocket connection is not open.');
        }
        // Replace 'localhost:5000' with your actual backend server address
        // const socket = new WebSocket('ws://127.0.0.1:4000');
        // socket.onopen = () => {
        //   socket.send(message);
        // };
        //console.log('sent')
      };

  return (
    <>
    
        <div className='flex flex-col bg-gray-900 dark:text-white min-h-screen min-w-min'>
            <NavBar/> 
        
          <div className='flex flex-1'>
            <SideBar></SideBar>
            <Chat socketRef={socketRef} wsResp={wsResp} arr={arr}></Chat>
          </div>
        </div>
     {/* <span className='inline-flex w-2/6'>
      <input type="text" className='inline-flex text-black w-1/2 placeholder-slate-950' placeholder='Enter id' value={clientId} onChange={(e)=>setClientId(e.target.value)} />
      <input type="text" className='inline-flex text-black w-1/2 ml-4 placeholder-slate-950' placeholder='Enter message' value={message} onChange={(e)=>setMessage(e.target.value)} />
    </span>

     <button type="button" className='rounded-md bg-amber-700 flex p-3 justify-items-center w-1/4' onClick={sendMessage}>send message to server</button> */}
    </>
  )
}

export default Home




//USING USEWEBSOCKET HOOK OUTSIDE OF USEFFECT HOOK
// useWebSocket(WS_URL,{
//     onOpen:()=>{
//         console.log("WebSocket connection established.");
//     },

//     onclose:()=>{
//         console.log("connection was closed");
//     }
    
// })