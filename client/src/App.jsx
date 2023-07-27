import { useState } from 'react'
import Home from './components/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-gray-950 min-h-screen text-white'>
      <Home></Home>
      </div>
    </>
  )
}

export default App
