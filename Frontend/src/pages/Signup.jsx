import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")
    const [pass, setPass] = useState("")
    const [confPass, setConfPass] = useState("")

    const handleCreate = () => {
        if (username.length < 3) {
            toast.warn("Username must be atleast 3 characters")
        } else if (!email.includes("@gmail.com")) {
            toast.warn("Please enter correct email address")
        } else if (pass.length < 8) {
            toast.warn("Password must be atleast 8 characters")
        } else if (pass !== confPass) {
            toast.warn("Password do not match")
        } else {
            toast.success("Account created successfully")
        }

    }

    return (
        <>
            <div className='flex flex-col items-center'>
                <div className="inputs mt-10 w-11/12 sm:w-2/3 lg:w-1/3 flex justify-center rounded-xl shadow-2xl border border-black">

                    <div className='flex flex-col items-center relative'>
                        <div className='my-2 mt-5'>
                            <label htmlFor="username" className='font-semibold block'>Username</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='username' placeholder='username...' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="email" className='font-semibold block'>Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='email' placeholder='email...' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="avatar" className='font-semibold block'>Avatar <span className='text-myGrey' >(optional)</span></label>
                            <input onChange={(e) => setAvatar(e.target.value)} type="file" className='rounded-md p-2 w-[270px] border border-black' id='avatar' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="pass" className='font-semibold block'>Password</label>
                            <input onChange={(e) => setPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='pass' placeholder='password...' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="confpass" className='font-semibold block'>Confirm Password</label>
                            <input onChange={(e) => setConfPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='confpass' placeholder='confirm password...' />
                        </div>
                        <button onClick={handleCreate} className='bg-myGreen flex w-full justify-center text-lg m-5 p-2 pe-4 ps-6 rounded-3xl hover:text-white hover:scale-105 hover:ease-in-out'>Create account</button>
                        <div className='mb-5'>Already have an account ? <Link to="/signin" className='text-myGreen' >Signin</Link> </div>
                    </div>
                </div>
            </div>

            {/* This component need to be included so place it at the bottom */}
            <ToastContainer limit={3} />
        </>
    )
}

export default Signup