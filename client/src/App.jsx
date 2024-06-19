import { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
// Routes
import Chat from './routes/Chat';

function App() {
  const [count, setCount] = useState(0);


  return (
    <>
      <div className='min-h-screen w-screen bg-gray-900 text-white text-center'>
        <Routes>
          <Route path='/' element={<>yo /</>}/>
          <Route path='/chat' element={<Chat />}/>
        </Routes>
      </div>
    </>
  )
}

export default App
