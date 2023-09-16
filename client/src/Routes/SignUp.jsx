import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import PasswordValidator from '../utils/PasswordValidator';
import PasswordMatcher from '../utils/PasswordMatcher';

const SignUp = () => {

    const [userDetails,setUserDetails] = useState({
        username : '',
        password : '',
        confirm_password : '',
    });

    const [termsCheck,setTermsCheck] = useState(false);

    const [isValid,setIsValid] = useState(false);

    const [passwordMatch,setPasswordMatch] = useState(false);

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const formSubmit = async(event) =>{
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/signup/',{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(userDetails),
            });
            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.message)
            }else{
                setMessage('Error submitting data.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        }
        console.log(message)
        if (userDetails.username.length > 0 && termsCheck && passwordMatch && isValid) {
           navigate('/login') ;
        }
    }

    const handleChange = (event) =>{
        const {name,value} = event.target;
        setUserDetails((userDetails)=>{
            return{
                ...userDetails,[name]:value}
        })
        
    }
    console.log(userDetails);
    console.log(termsCheck);

    const validatePassword = (password) =>{
        return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
    }

    const handleCheck = (e) =>{
        setTermsCheck(e.target.checked)
    }

    useEffect(()=>{
        setIsValid(validatePassword(userDetails.password));
    },[userDetails.password])

    useEffect(()=>{
        if(userDetails.confirm_password.length > 0){
            setPasswordMatch(userDetails.password === userDetails.confirm_password)
        }
    },[userDetails.confirm_password])
    

  return (
    <>
    <section className="bg-gray-50 dark:bg-gray-900 dark:text-white">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2 dark:stroke-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>

      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={formSubmit}>
                  <div>
                      <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
                      <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required onChange={handleChange}/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleChange}/>
                      <PasswordValidator isValid={isValid}/>
                  </div>
                  <div>
                      <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input type="confirm_password" name="confirm_password" id="confirm_assword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleChange}/>
                      {userDetails.confirm_password.length > 0 && <PasswordMatcher passwordMatch={passwordMatch}/>}
                  </div>
                  <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" checked={termsCheck} required onChange={handleCheck}/>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the Terms and Conditions</label>
                      </div>
                  </div>
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={()=>navigate('/login')}>Login here</span>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
    </>
  )
}

export default SignUp;