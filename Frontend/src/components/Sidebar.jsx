import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HomeLogo from "../assets/Posts Assets/Home.png"
import SearchLogo from "../assets/Posts Assets/Search.png"
import CreateLogo from "../assets/Posts Assets/Create.png"
import EditNoteLogo from "../assets/Posts Assets/EditNote.png"
import SocialNoteLogo from "../assets/SocialNote Logo.png"
import { useSelector } from "react-redux"
import ModalPost from './ModalPost'

const Sidebar = () => {

    const [modalOpen, setModalOpen] = useState(false)
    const isLoggedIn = useSelector(state => state.user.isLoggedIn) || false
    const user = useSelector(state => state.user.userData)
    const navigate = useNavigate()
    const { pathname } = useLocation()

    if (pathname === "/") {
        document.title = `SocialNotes`
    } else {
        const page = pathname.charAt(1).toUpperCase() + pathname.slice(2)
        document.title = `${page} | SocialNotes`
    }

    return (
        <>
            {/* SocialNote Logo for mobile */}
            <div onClick={() => navigate("/")} className={`hidden items-center w-full fixed z-20 h-12 ps-2 cursor-pointer bg-white ${isLoggedIn ? "max-sm:flex " : ""}`}>
                <div className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${SocialNoteLogo})` }}></div>
                <p className='text-xl font-semibold text-[#ffb600]'>SocialNotes</p>
            </div>

            {/* Main container */}
            <div className={`fixed z-20 max-sm:bottom-0 w-full sm:w-2/12 sm:h-screen flex flex-col justify-center items-center bg-white sm:border-2  ${isLoggedIn ? "" : "hidden"}`}>

                {/* SocialNote Logo*/}
                <div onClick={() => navigate("/")} className='hidden sm:flex items-center cursor-pointer'>
                    <div className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${SocialNoteLogo})` }}></div>
                    <p className='text-xl font-semibold text-[#ffb600]'>SocialNotes</p>
                </div>

                {/* Other buttons */}
                <div className="flex sm:flex-col justify-evenly items-center h-14 w-full sm:h-2/3 sm:w-1/3">
                    <div onClick={() => navigate("/")} className={`flex items-center cursor-pointer smoothHover hover:invert-0 ${pathname === "/" ? "" : "invert-[0.5]"}`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${HomeLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-3'>Home</p>
                    </div>
                    <div onClick={() => navigate("/search")} className={`flex items-center cursor-pointer smoothHover hover:invert-0 ${pathname === "/search" ? "" : "invert-[0.5]"}`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${SearchLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-2'>Search</p>
                    </div>
                    <div onClick={() => { setModalOpen(true) }} className={`flex items-center cursor-pointer smoothHover hover:invert-0 ${modalOpen ? "" : "invert-[0.5]"}`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${CreateLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-3'>Create</p>
                    </div>
                    <div onClick={() => navigate("/notes")} className={`flex items-center cursor-pointer smoothHover hover:invert-0 ${pathname === "/notes" ? "" : "invert-[0.5]"}`}>
                        <button className='h-8 w-8 bgImgProps' style={{ backgroundImage: `url(${EditNoteLogo})` }}></button>
                        <p className='hidden sm:block font-semibold ms-3'>Notes</p>
                    </div>
                    <div onClick={() => navigate("/profile")} className={`flex items-center cursor-pointer smoothHover hover:invert-0`}>
                        <button className='h-8 w-8 bg-no-repeat bg-cover bg-center rounded-full border border-black' style={{ backgroundImage: `url(${user?.avatar})` }}></button>
                        <p className={`hidden sm:block font-semibold ms-3 ${pathname === "/profile" ? "" : "invert-[0.5]"}`}>Profile</p>
                    </div>
                </div>
            </div >

            <ModalPost modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    )
}

export default Sidebar