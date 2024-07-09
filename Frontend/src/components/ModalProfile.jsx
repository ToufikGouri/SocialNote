import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal"
import DeleteLogo from "../assets/Notes Assets/Cancel.png"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getTime } from './Post'
import { setUserData, setUserLog, sortNotesBy } from '../redux/userSlice'


const ModalProfile = ({ modalOpen, setModalOpen }) => {

    const user = useSelector(state => state.user.userData)

    const [username, setUsername] = useState(user?.username || "")
    const [email, setEmail] = useState(user?.email || "")
    const [bio, setBio] = useState(user?.bio || "")
    const [avatar, setAvatar] = useState("")
    const [newPass, setNewPass] = useState("")
    const [oldPass, setOldPass] = useState("")
    const avatarRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const clearFields = () => {
        setUsername(user?.username);
        setEmail(user?.email);
        setBio(user?.bio || "");
        setNewPass("");
        setOldPass("");
        if (avatarRef.current) {
            setAvatar("");
            avatarRef.current.value = null
        };
        setModalOpen(false)
    }

    const handleCreate = async () => {

        const newUsername = username.trim().toLowerCase()
        const newEmail = email.trim().toLowerCase()
        const newBio = bio.trim()
        // don't trim or lowercase passwords

        if (getTime(user?.updatedAt) === "today") {
            setModalOpen(false)
            toast.warn("Profile can be updated once a day")
            return
        }

        if (newUsername === user?.username && newEmail === user?.email && newBio === user?.bio && avatar === "" && newPass === "" && oldPass === "") {
            clearFields()
            toast.warn("No data updated")
            return
        }

        if (newUsername !== "" && newUsername.length < 3) {
            toast.warn("Username must be atleast 3 characters")
        } else if (newEmail !== "" && (!newEmail.includes("@gmail.com") || newEmail.includes(" "))) {
            toast.warn("Please enter correct email address")
        } else if (newBio.length > 150) {
            toast.warn("Bio can't be more than 150 characters")
        } else if (oldPass !== "" && newPass === "") {
            toast.warn("Please enter new password")
        } else if (newPass !== "" && oldPass === "") {
            toast.warn("Please enter old password")
        } else if ((newPass || oldPass) !== "" && (newPass.length < 8 || oldPass.length < 8)) {
            toast.warn("Password must be atleast 8 characters")
        } else {

            // if no error then update account
            const formData = new FormData()
            formData.append("username", newUsername ? newUsername : user?.username)
            formData.append("email", newEmail ? newEmail : user?.email)
            formData.append("bio", bio ? bio : user?.bio)
            if (newPass && oldPass) {
                formData.append("oldPassword", oldPass)
                formData.append("newPassword", newPass)
            }
            if (avatar) {
                formData.append("avatar", avatar)
            }

            try {
                const updatedUser = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/updateuser`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }).then((res) => res.data.data)
                // set all fields blank
                clearFields()
                dispatch(setUserData(updatedUser))
                toast.success("Account updated successfully")
            } catch (error) {
                toast.error("An error occurred")
            }

        }// if block ends here  

    }

    const handleLogout = async () => {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`, {}, { withCredentials: true })
            .then(() => { toast.success("Logout successfully") })
        dispatch(setUserLog(false))
        dispatch(sortNotesBy("Clear"))
        dispatch(setUserData(null))
        navigate("/")
    }


    return (
        <>
            <Modal
                isOpen={modalOpen}
                onRequestClose={clearFields}
                contentLabel="Profile Modal"
                className="w-11/12 sm:w-2/3 lg:w-1/3 max-sm:my-8 rounded-xl outline-none bg-white"
                overlayClassName={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50`}
            >

                <div>
                    <div className='flex flex-col items-center relative'>
                        <p className='text-2xl mt-2 font-semibold'>Edit Profile</p>

                        <div className='my-[0.5px] sm:my-1'>
                            <label htmlFor="username" className='font-semibold block'>Username</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='username' placeholder="username..." />
                        </div>
                        <div className='my-[0.5px] sm:my-1'>
                            <label htmlFor="email" className='font-semibold block'>Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='email' placeholder="email..." />
                        </div>
                        <div className='my-[0.5px] sm:my-1 relative'>
                            <label htmlFor="bio" className='font-semibold block'>Bio</label>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={`rounded-md p-2 w-[270px] border ${bio.length > 150 ? "border-red-500 outline-red-500" : "border-black"} resize-none`} rows={4} id="bio" placeholder='Bio (max 150 characters)...'></textarea>
                            <div className='absolute top-0 right-0'>{bio.length}/150</div>
                        </div>
                        <div className='my-[0.5px] sm:my-1'>
                            <label htmlFor="avatar" className='font-semibold block'>New profile image <span className='text-myGrey' >(optional)</span></label>
                            <input ref={avatarRef} onChange={(e) => setAvatar(e.target.files[0])} type="file" accept="image/*" className='rounded-md p-2 w-[270px] border border-black cursor-pointer' id='avatar' />
                        </div>

                        {/* Reset password */}
                        <div className='flex items-center w-full text-sm text-center'>
                            <span className='border w-2/5 h-[1px]'></span>
                            <p className='w-40'>Reset Password?</p>
                            <span className='border w-2/5 h-[1px]'></span>
                        </div>

                        <div className='my-[0.5px] sm:my-1'>
                            <label htmlFor="oldPass" className='font-semibold block'>Old password</label>
                            <input value={oldPass} onChange={(e) => setOldPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='oldPass' placeholder="Old password..." />
                        </div>
                        <div className='my-[0.5px] sm:my-1'>
                            <label htmlFor="newPass" className='font-semibold block'>New password</label>
                            <input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" className='rounded-md p-2 w-[270px] border border-black' id='newPass' placeholder="New password..." />
                        </div>

                        {/* Buttons */}
                        <div className='my-1 w-[270px] flex justify-around'>
                            <button onClick={clearFields} className='border border-black text-lg p-1 px-6 smoothHover rounded-3xl'>Close</button>
                            <button onClick={handleCreate} className='bg-myGreen flex justify-center text-lg p-1 px-6 smoothHover rounded-3xl hover:text-white'>Update</button>
                        </div>

                        <div className='my-1'>Joined since {user && getTime(user?.createdAt)} </div>
                        <button onClick={handleLogout} className='border border-red-500 text-lg p-1 px-6 smoothHover rounded-3xl text-red-500 my-2'>Logout</button>

                        {/* Modal close button */}
                        <div className='absolute top-[-8px] right-[-8px] hover:cursor-pointer dropLine' onClick={() => setModalOpen(false)}><img className='h-6 invert' src={DeleteLogo} alt="Delete" /></div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ModalProfile