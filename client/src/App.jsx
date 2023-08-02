import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Routes/Home'
import Login from './Routes/Login'
import SignUp from './Routes/SignUp'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home></Home>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<SignUp/>}/>
      </Routes>
    </>
  )
}

export default App
