import React, { useRef, useState } from 'react'
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"

const Signup = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState((""))
    const [pass, setPass] = useState("")
    const [confPass, setConfPass] = useState("")
    const avatarRef = useRef(null)


    const handleCreate = async () => {

        const newUsername = username.trim().toLowerCase()
        const newEmail = email.trim().toLowerCase()
        // don't trim or lowercase passwords

        if (newUsername.length < 3) {
            toast.warn("Username must be atleast 3 characters")
        } else if (!newEmail.includes("@gmail.com") || newEmail.includes(" ")) {
            toast.warn("Please enter correct email address")
        } else if (pass.length < 8) {
            toast.warn("Password must be atleast 8 characters")
        } else if (pass !== confPass) {
            toast.warn("Password do not match")
        } else {


            // if no error then create account
            const formData = new FormData()
            formData.append("username", newUsername)
            formData.append("email", newEmail)
            formData.append("password", pass)

            if (avatar) {
                formData.append("avatar", avatar)
            }

            try {
                await axios.post("/api/v1/users/register", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })

                toast.success("Account created successfully")
            } catch (error) {
                console.log("Axios error", error);       // remove this after
                toast.error(error.response?.data?.message || "An error occurred")
            }

            // set all fields blank after successfull
            setUsername("")
            setEmail("")
            setPass("")
            setConfPass("")
            if (avatarRef.current) {
                avatarRef.current.value = null
            }
        }// if block ends here

    }


    return (
        <>
            <div className='flex flex-col items-center'>
                <div className="inputs mt-10 w-11/12 sm:w-2/3 lg:w-1/3 flex justify-center rounded-xl shadow-2xl border border-black">

                    <div className='flex flex-col items-center relative'>
                        <div className='my-2 mt-5'>
                            <label htmlFor="username" className='font-semibold block'>Username</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='username' placeholder='username...' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="email" className='font-semibold block'>Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='email' placeholder='email...' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="avatar" className='font-semibold block'>Avatar <span className='text-myGrey' >(optional)</span></label>
                            <input ref={avatarRef} onChange={(e) => setAvatar(e.target.files[0])} type="file" className='rounded-md p-2 w-[270px] border border-black' id='avatar' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="pass" className='font-semibold block'>Password</label>
                            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='pass' placeholder='password...' />
                        </div>
                        <div className='my-2'>
                            <label htmlFor="confpass" className='font-semibold block'>Confirm Password</label>
                            <input value={confPass} onChange={(e) => setConfPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='confpass' placeholder='confirm password...' />
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