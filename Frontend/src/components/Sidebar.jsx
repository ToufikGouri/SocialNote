import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeLogo from "../assets/Posts Assets/Home.png"
import SearchLogo from "../assets/Posts Assets/Search.png"
import CreateLogo from "../assets/Posts Assets/Create.png"
import EditNoteLogo from "../assets/Posts Assets/EditNote.png"
import SocialNoteLogo from "../assets/Posts Assets/SocialNote Logo.png"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { getUserData, setUserData, setUserLog, sortNotesBy } from '../redux/userSlice'
import { toast } from "react-toastify"
import ModalPost from './ModalPost'

const Sidebar = () => {

    const [activePage, setActivePage] = useState("/")
    const [modalOpen, setModalOpen] = useState(false)
    const isLoggedIn = useSelector(state => state.user.isLoggedIn) || false
    const user = useSelector(state => state.user.userData)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getUserData())
    }, [isLoggedIn])
 
    const handleLogout = async () => {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`, {}, { withCredentials: true }).then(() => { toast.success("Logout successfully") })
        dispatch(setUserLog(false))
        dispatch(sortNotesBy("Clear"))
        dispatch(setUserData(null))
    }

    return (
        <>
            {/* SocialNote Logo for mobile */}
            <div onClick={() => navigate("/")} className='hidden max-sm:flex items-center w-full fixed z-20 h-12 ps-2 cursor-pointer bg-white'>
                <div className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${SocialNoteLogo})` }}></div>
                <p className='text-xl font-semibold text-[#ffb600]'>SocialNote</p>
            </div>

            {/* Main container */}
            <div className="fixed z-20 max-sm:bottom-0 w-full sm:w-2/12 sm:h-screen flex flex-col justify-center items-center bg-white sm:border-2 ">

                {/* SocialNote Logo*/}
                <div onClick={() => navigate("/")} className='hidden sm:flex items-center cursor-pointer'>
                    <div className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${SocialNoteLogo})` }}></div>
                    <p className='text-xl font-semibold text-[#ffb600]'>SocialNote</p>
                </div>

                {/* Other buttons */}
                <div className="flex sm:flex-col justify-evenly items-center h-14 w-full sm:h-2/3 sm:w-1/3">
                    <div onClick={() => { navigate("/"); setActivePage("/") }} className={`flex items-center cursor-pointer smoothHover ${activePage === "/" ? "invert-[0.5]" : ""}`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${HomeLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-3'>Home</p>
                    </div>
                    <div onClick={() => { navigate("/"); setActivePage("/") }} className={`flex items-center cursor-pointer smoothHover isActiveColorLogic`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${SearchLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-2'>Search</p>
                    </div>
                    <div onClick={() => { navigate("/"); setActivePage("/"); setModalOpen(true) }} className={`flex items-center cursor-pointer smoothHover isActiveColorLogic`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${CreateLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-3'>Create</p>
                    </div>
                    <div onClick={() => { navigate("/notes"); setActivePage("/notes") }} className={`flex items-center cursor-pointer smoothHover ${activePage === "/notes" ? "invert-[0.5]" : ""}`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${EditNoteLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-3'>Notes</p>
                    </div>
                    <div onClick={() => { navigate("/"); setActivePage("/") }} className={`flex items-center cursor-pointer smoothHover isActiveColorLogic`}>
                        <button className='h-8 w-8 bg-no-repeat bg-cover bg-center rounded-full border border-black' style={{ backgroundImage: `url(${user?.avatar})` }}></button>
                        <p className='hidden sm:block font-semibold ms-3'>Profile</p>
                    </div>
                </div>
            </div>

            <ModalPost modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    )
}

export default Sidebar