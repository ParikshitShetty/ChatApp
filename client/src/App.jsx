import { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { io } from 'socket.io-client'

function App() {
  const [count, setCount] = useState(0);
  const ref = useRef(true);

  useEffect(()=>{
    if (ref.current) {
      const socket = io('localhost:3000');
      ref.current = false;
    }
  },[])

  return (
    <>
      <div className='min-h-screen w-screen bg-gray-900 text-white'>
        <Routes>
          <Route path='/' element={<>yo /</>}/>
          <Route path='/login' element={<>yo /login</>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
