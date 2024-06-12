
import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {

    const [username, setUsername] = useState("")
    const [pass, setPass] = useState("")

    const handleLogin = () => {
        // manage the logic of right email and pass in if else block        
        toast.success("Logged in successfully")
    }

    return (
        <>
            <div className='flex flex-col items-center'>
                <div className="inputs mt-10 w-11/12 sm:w-2/3 lg:w-1/3 flex justify-center rounded-xl shadow-2xl border border-black">

                    <div className='flex flex-col items-center relative'>
                        <div className='my-2 mt-5'>
                            <label htmlFor="username" className='font-semibold block'>Username or Email</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='username' placeholder='username or email' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="pass" className='font-semibold block'>Password</label>
                            <input onChange={(e) => setPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='pass' placeholder='password...' />
                        </div>
                        <button onClick={handleLogin} className='bg-myGreen flex w-full justify-center text-lg m-5 p-2 rounded-3xl hover:text-white hover:scale-105 hover:ease-in-out'>Login</button>
                        <div className='mb-5'>Don't have an account ? <Link to="/signup" className='text-myGreen' >Signup</Link> </div>
                    </div>
                </div>
            </div>

            {/* This component need to be included so place it at the bottom */}
            <ToastContainer limit={3} />
        </>
    )
}

export default Signup