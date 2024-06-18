import React, { useState } from 'react'
import AddLogo from "../assets/Notes Assets/PlusBig.png"
import DeleteLogo from "../assets/Notes Assets/Cancel.png"
import Modal from "react-modal"
import { ToastContainer, toast } from 'react-toastify';

const MyModal = ({ modalOpen, setModalOpen, onNoteAdded, methodHandle, _id, successMsg = "added", tl = "", desc = "", ti = "", ur = "Low", fav = false }) => {

    const [title, setTitle] = useState(tl)
    const [description, setDescription] = useState(desc)
    const [time, setTime] = useState(ti)
    const [urgencyLevel, setUrgencyLevel] = useState(ur)

    const handleAddNote = async () => {

        const newTitle = title.trim()
        const newDescription = description.trim()

        if (newTitle.length === 0) {
            toast.warn(`Title can not be empty`)
        } else if (newDescription.length === 0) {
            toast.warn(`Description can not be empty`)
        } else if (time.length === 0) {
            toast.warn(`Please enter Date`)
        } else {

            const formatedTime = time.split("-").reverse().join("-")
            const noteData = {
                title: newTitle,
                description: newDescription,
                time: formatedTime,
                urgency: urgencyLevel,
                favorite: fav,
                _id
            } 

            //if no error means create note
            try {
                await methodHandle(noteData)
                onNoteAdded()
                toast.success(`Note ${successMsg} successfully`)

            } catch (error) {
                console.log("Axios error", error);       // remove this after
                toast.error(error.response?.data?.message || "An error occurred")
            }

            setTitle("")
            setDescription("")
            setTime("")
            setUrgencyLevel("Low")
            setModalOpen(false)
        }// if block ends here

    }

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Custom Modal"
            className="w-4/5 sm:w-1/2 lg:w-1/3 rounded-xl outline-none bg-white"
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className='flex flex-col items-center relative'>
                <div>
                    <div className='my-3'>
                        <label htmlFor="title" className='font-semibold block'>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className='rounded-md p-2 w-[270px] border border-black' id='title' placeholder='Title...' />
                    </div>

                    <div className='my-3'>
                        <label htmlFor="disc" className='font-semibold block'>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="disc" className='rounded-md p-2 w-[270px] border border-black' id="disc" cols="30" rows="10" placeholder='Description...'></textarea>
                    </div>

                    <div className='my-3'>
                        <label htmlFor="time" className='font-semibold block'>Date</label>
                        <input value={time} onChange={(e) => setTime(e.target.value)} type="date" className='rounded-md p-2 w-[270px] border border-black' id='time' />
                    </div>

                    <div className='my-3'>
                        <h1 className='font-semibold block'>Task urgency</h1>
                        <div className='pt-4 pb-6 flex justify-around'>
                            <label> <input type="radio" className='hidden' value="High" checked={urgencyLevel === "High"} onChange={(e) => setUrgencyLevel(e.target.value)} />
                                <span className={`bg-urgentRed p-2 px-4 cursor-pointer rounded-2xl ${urgencyLevel === "High" ? "border-4" : ""}`}>High</span>
                            </label>
                            <label> <input type="radio" className='hidden' value="Mid" checked={urgencyLevel === "Mid"} onChange={(e) => setUrgencyLevel(e.target.value)} />
                                <span className={`bg-urgentOrange p-2 px-4 cursor-pointer rounded-2xl ${urgencyLevel === "Mid" ? "border-4" : ""}`}>Mid</span>
                            </label>
                            <label> <input type="radio" className='hidden' value="Low" checked={urgencyLevel === "Low"} onChange={(e) => setUrgencyLevel(e.target.value)} />
                                <span className={`bg-urgentGreen p-2 px-4 cursor-pointer rounded-2xl ${urgencyLevel === "Low" ? "border-4" : ""}`}>Low</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-center mb-5">
                        <button onClick={handleAddNote} className='bg-myGreen group flex text-lg p-2 pe-4 ps-6 rounded-3xl hover:text-white hover:scale-105 hover:ease-in-out'>
                            Add  <img src={AddLogo} className='h-6 group-hover:scale-105 group-hover:invert' alt="Add" />
                        </button>
                    </div>

                </div>

                {/* Modal close button */}
                <div className='absolute top-[-8px] right-[-8px] hover:cursor-pointer dropLine' onClick={() => setModalOpen(false)}><img className='h-6 invert' src={DeleteLogo} alt="Delete" /></div>

            </div>
        </Modal>
    )
}

export default MyModal