import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordValidator from '../utils/PasswordValidator';


const Login = () => {

    const [loginDetails,setLoginDetails] = useState({
        username : '',
        password : '',
    });

    const [isValid,setIsValid] = useState(false);

    const [remember,setRemember] = useState(false);

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const formSubmit = async(event) =>{
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/login/',{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(loginDetails),
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
        console.log(message);
        if (loginDetails.username.length > 0 && isValid) {
            navigate('/');
        }
    }

    const handleChange = (event) =>{
        const {name,value} = event.target;
        setLoginDetails((loginDetails)=>{
            return{...loginDetails,[name]:value}
        });
        console.log(loginDetails);
    }

    const validatePassword = (password) =>{
        return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
    }

    const handleCheck = (event) =>{
        setRemember(event.target.checked);
    }
    console.log(remember)

    useEffect(() => {
      setIsValid(validatePassword(loginDetails.password))
    }, [loginDetails.password])
    console.log(isValid)

  return (
    <>
    <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 dark:stroke-white mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={formSubmit}>
                  <div>
                      <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
                      <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="johnsmith" required="" onChange={handleChange}/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={handleChange}/>
                      <PasswordValidator isValid={isValid}/>
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required='' checked={remember} onChange={handleCheck}/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <span className="text-sm font-medium hover:underline dark:text-gray-50">Forgot password?</span>
                  </div>
                  <button type="submit" className="w-full text-white bg-cyan-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don't have an account yet? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={()=>navigate('/register')}>Sign up</span>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
    </>
  )
}

export default Login;