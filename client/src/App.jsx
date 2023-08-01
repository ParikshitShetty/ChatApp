import { useState } from 'react'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
SignUp

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
