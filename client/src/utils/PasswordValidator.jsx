import React from 'react'

const PasswordValidator = ({isValid}) => {
  return (
    <>
    <div className={isValid ? `text-green-400` : `text-red-500`}>
        {isValid ? <p>Password is valid</p> : <p>Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.</p>}
    </div>
    </>
  )
}

export default PasswordValidator