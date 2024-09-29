import React, { useEffect } from 'react'

function Logout() {
    const logOutUser = async() => {
        try {
          window.location.assign("http://localhost:3000/auth/logout")
        // const resp = await fetch("http://localhost:3000/auth/logout");
        // const json = await resp.json();
        // {message:"User is not authenticated",redirect:true, url:'/auth/google'}
        } catch (error) {
          console.error("Error while checking profile:",error)
        }
      }
    useEffect(()=>{
        logOutUser()
    },[])
  return (
    <div>Logout</div>
  )
}

export default Logout