import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import { setUserData, setUserLog } from '../redux/userSlice';

const Signup = () => {

    const [username, setUsername] = useState("")
    const [pass, setPass] = useState("")
    const dispatch = useDispatch()

    const handleLogin = async () => {

        const newUsername = username.trim().toLowerCase()
        // don't trim or lowercase passwords

        if (newUsername.length < 3) {
            toast.warn("Please enter valid username or email")
        } else if (pass.length < 8) {
            toast.warn("Password must be atleast 8 characters")
        } else {

            // if no error then try to login
            try {

                const userData = { password: pass }
                if (username.includes("@gmail.com")) {
                    userData.email = newUsername
                } else {
                    userData.username = newUsername
                }

                const user = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`, userData).then((res) => res.data.data.user)

                dispatch(setUserLog(true))
                dispatch(setUserData(user))
                toast.success(`Welcome back ${user.username}`)
            } catch (error) {
                console.log("Axios error", error);       // remove this after
                toast.error(error.response?.data?.message || "An error occurred")
            }

            // set all fields blank after successfull
            setUsername("")
            setPass("")

        }// if block ends here

    }

    return (
        <>
            <div className='flex flex-col items-center'>
                <div className="inputs mt-10 w-11/12 sm:w-2/3 lg:w-1/3 flex justify-center rounded-xl shadow-2xl border border-black">

                    <div className='flex flex-col items-center relative'>
                        <div className='my-2 mt-5'>
                            <label htmlFor="username" className='font-semibold block'>Username or email</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='username' placeholder='username or email' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="pass" className='font-semibold block'>Password</label>
                            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='pass' placeholder='password...' />
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