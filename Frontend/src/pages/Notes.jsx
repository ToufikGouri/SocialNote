import React, { useEffect, useState } from 'react'
import AddLogo from "../assets/Notes Assets/PlusBig.png"
import TimeLogo from "../assets/Notes Assets/TimeLogo.png"
import UrgencyLogo from "../assets/Notes Assets/UrgencyLogo.png"
import HeartRed from "../assets/Notes Assets/Heart filled.png"
import EmtpyNotes from "../assets/Notes Assets/EmptyNotes.png"
import LoadingLogo from "../assets/Loading.svg"
import { ToastContainer, toast } from 'react-toastify';
import SubNote from '../components/SubNote'
import axios from "axios"
import MyModal from '../components/ModalNote'
import { useDispatch, useSelector } from "react-redux"
import { getUserNotes } from '../redux/userSlice'
import { Link } from 'react-router-dom'

const Notes = () => {

    const [modalOpen, setModalOpen] = useState(false)
    const [isNoteAdded, setIsNoteAdded] = useState(false)    // to update the page on change in notes, just toggle the state to activate the useEffect
    const notes = useSelector(state => state.userNotes)
    const loading = useSelector(state => state.loading)
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserNotes())
    }, [isNoteAdded, isLoggedIn])

    if (loading) {
        return <div className='h-[90vh] flex justify-center items-center' ><img className='h-32' src={LoadingLogo} alt="Loading..." /></div>
    }


    return (
        <>
            <MyModal modalOpen={modalOpen} setModalOpen={setModalOpen} onNoteAdded={() => { setIsNoteAdded(!isNoteAdded) }} methodHandle={(data) => axios.post("/api/v1/notes/addnote", data)} />

            {/* Container of all divs */}
            <div className='flex items-center flex-col'>

                {notes.length !== 0 ? (
                    //  If notes available 
                    <main className="w-11/12 md:w-3/4">

                        {/* BUTTONS */}
                        <div className="buttons max-md:text-sm lg:w-2/4 m-auto flex justify-between items-center my-10">
                            <button className='flex items-center max-sm:h-10 max-sm:w-[80px] md:p-1 md:px-3 shadow-lg hover:bg-myPink border border-black rounded-3xl' onClick={() => setModalOpen(true)}><img src={AddLogo} className='h-4 md:h-6 m-[-1px]' alt='Add button'></img>Add note</button>

                            <h1 className='md:text-xl font-semibold mx-3'>Sort By:</h1>
                            <button className='flex items-center me-3 max-sm:h-10 max-sm:w-[80px] md:p-1 shadow-lg md:px-3 hover:bg-myPink border border-black rounded-3xl'><img src={UrgencyLogo} className='h-4 md:h-6 mx-1' alt='Add button'></img>Urgency</button>
                            <button className='flex items-center max-sm:h-10 max-sm:w-[80px] md:p-1 md:px-3 shadow-lg hover:bg-myPink border border-black rounded-3xl'><img src={HeartRed} className='h-4 md:h-6 mx-1' alt='Add button'></img>Favorite</button>
                        </div>

                        {/* NOTES  */}
                        <div className="notes flex flex-col items-center justify-center">
                            {notes.map(val =>
                                <SubNote key={val._id} _id={val._id}
                                    title={val.title} description={val.description} time={val.time}
                                    urgencyLevel={val.urgency} favorite={val.favorite} onNoteAdded={() => { setIsNoteAdded(!isNoteAdded) }}
                                />)}
                        </div>
                    </main>
                ) : (
                    //  When notes empty 
                    <div>
                        <img src={EmtpyNotes} alt="Your notes are empty" />
                        {
                            isLoggedIn ? (
                                <div className='flex items-center justify-center'>
                                    <h1 className='text-xl sm:text-3xl'>Your notes are empty !!</h1>
                                    <button className='flex items-center mx-2 p-1 px-3 hover:bg-myPink border border-black rounded-3xl' onClick={() => setModalOpen(true)}><img src={AddLogo} className='h-6' alt='Add button'></img>Add note</button>
                                </div>
                            ) : (
                                <div className='flex items-center justify-center'>
                                    <h1 className='text-xl sm:text-3xl'>Please signup first</h1>
                                    <Link to="/signup"
                                        className='bg-myGreen text-2xl mx-2 p-2 px-5 rounded-3xl max-md:left-1/3 max-md:bottom-5 hover:text-white hover:scale-105 hover:ease-in-out'>Signup
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                )}

                {/* This component need to be included so place it at the bottom */}
                <ToastContainer limit={3} />

            </div>
        </>
    )
}

export default Notes