import React from 'react'

const PasswordMatcher = ({passwordMatch,length}) => {
  return (
    <>
    
      <div className={passwordMatch ? `text-green-500` : 'text-red-500'}>
          {passwordMatch ? (
          <p>Passwords Match</p>)
        :
        (
          <p>Passwords do not match</p>)}
      </div>
    </>
  )
}

export default PasswordMatcher;