import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import Modal from 'react-modal'
import { useSelector, useDispatch } from "react-redux"
import { getUserData, setUserData, setUserLog, sortNotesBy } from '../redux/userSlice'
import { toast } from "react-toastify"

const Navbar = () => {

    const isLoggedIn = useSelector(state => state.isLoggedIn) || false
    const user = useSelector(state => state.userData)
    const dispatch = useDispatch()
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        dispatch(getUserData())
    }, [isLoggedIn])

    const handleLogout = async () => {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`, {}, { withCredentials: true }).then(() => { setModalOpen(false); toast.success("Logout successfully") })
        dispatch(setUserLog(false))
        dispatch(sortNotesBy("Clear"))
        dispatch(setUserData(null))
    }


    return (
        <>
            <div className={`parent flex items-center text-lg h-16 text-white linearBG `} >

                <ul className='flex relative justify-around w-full'>
                    <li className='hover:text-myBlue'><Link to="/" >SocialNote</Link></li>
                    <li className='hover:text-myBlue'><Link to="/" >Home</Link></li>
                    <li className='hover:text-myBlue'><Link to="/notes" >MyNotes</Link></li>
                    {!isLoggedIn ? (
                        <li className='hover:text-myBlue w-20'><Link to="/signup" >Signup</Link></li>
                    ) : (
                        // <li className='hover:text-myBlue'><Link to="/" onClick={handleLogout} >Logout</Link></li> 
                        <li onClick={() => setModalOpen(true)} className='cursor-pointer w-20'>
                            <div className={`rounded-full absolute top-[-4px] h-10 w-10 bg-no-repeat bg-cover bg-center border border-black`} style={{ backgroundImage: `url(${user?.avatar})` }} ></div>

                        </li>
                    )}
                </ul>

            </div>
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Profile Modal"
                className="w-2/5 sm:w-1/4 lg:w-2/12 absolute top-16 right-2 rounded-xl outline-none bg-white shadow-2xl"
                overlayClassName="fixed inset-0 flex items-center justify-center"
            >
                <div className='flex py-2 flex-col items-center'>
                    <button className='w-4/5 p-2 text-start font-medium rounded-md hover:text-white hover:bg-black hover:bg-opacity-40' >Profile</button>
                    <button onClick={handleLogout} className='w-4/5 p-2 text-start font-medium rounded-md hover:text-white hover:bg-black hover:bg-opacity-40' >Logout</button>
                </div>
            </Modal>
        </>
    )
}

export default Navbar