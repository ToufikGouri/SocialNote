import React, { useState } from 'react'
import AddLogo from "../assets/Notes Assets/PlusBig.png"
import DeleteLogo from "../assets/Notes Assets/Cancel.png"
import TimeLogo from "../assets/Notes Assets/TimeLogo.png"
import UrgencyLogo from "../assets/Notes Assets/UrgencyLogo.png"
import HeartRed from "../assets/Notes Assets/Heart filled.png"
import EmtpyNotes from "../assets/Notes Assets/EmptyNotes.png"
import SubNote from '../components/SubNote'
import Modal from "react-modal"



export const MyModal = ({ modalOpen, setModalOpen, urgencyLevel, setUrgencyLevel }) => {

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Custom Modal"
            className="w-4/5 sm:w-1/2 lg:w-1/3 rounded-xl bg-white"
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className='flex flex-col items-center relative'>
                <div>
                    <div className='my-3'>
                        <label htmlFor="title" className='font-semibold block'>Title</label>
                        <input type="text" className='rounded-md p-2 w-[270px] border border-black' id='title' placeholder='Title...' />
                    </div>

                    <div className='my-3'>
                        <label htmlFor="disc" className='font-semibold block'>Discription</label>
                        <textarea name="disc" className='rounded-md p-2 w-[270px] border border-black' id="disc" cols="30" rows="10" placeholder='Discription...'></textarea>
                    </div>

                    <div className='my-3'>
                        <label htmlFor="time" className='font-semibold block'>Date</label>
                        <input type="date" className='rounded-md p-2 w-[270px] border border-black' id='time' />
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
                        <button className='bg-myGreen group flex text-lg p-2 pe-4 ps-6 rounded-3xl hover:text-white hover:scale-105 hover:ease-in-out'>
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

const Notes = () => {

    const data = [
        {
            id: 1,
            title: "The first title",
            description: "The first Description",
            time: "11/06/2024"
        },
        {
            id: 2,
            title: "develop the whole page",
            description: "The description of this one is the number second which is something i think something should be added more lines of anything like this or that but much more should be added to make it big",
            time: "02/11/2023"
        },
        {
            id: 3,
            title: "That's the thired title which is some long and some more texts could be added here",
            description: "The title was some long but this one is gonna be mid",
            time: "13/09/2023"
        },
    ]

    // starting
    const [modalOpen, setModalOpen] = useState(false)
    const [urgencyLevel, setUrgencyLevel] = useState("Low")


    return (
        <>
            <MyModal modalOpen={modalOpen} setModalOpen={setModalOpen} urgencyLevel={urgencyLevel} setUrgencyLevel={setUrgencyLevel} />


            <div className='flex items-center flex-col'>

                {/* Container of all divs*/}
                {/* If notes available */}
                <main className="w-11/12 md:w-3/4">

                    {/* BUTTONS */}
                    <div className="buttons max-md:text-sm lg:w-2/4 m-auto flex justify-between items-center my-10">
                        <button className='flex items-center max-sm:h-10 max-sm:w-[80px] md:p-1 md:px-3 shadow-lg hover:bg-myPink border border-black rounded-3xl' onClick={() => setModalOpen(true)}><img src={AddLogo} className='h-4 md:h-6 m-[-1px]' alt='Add button'></img>Add note</button>

                        <h1 className='md:text-xl font-semibold mx-3'>Sort By:</h1>
                        <button className='flex items-center me-3 max-sm:h-10 max-sm:w-[80px] md:p-1 shadow-lg md:px-3 hover:bg-myPink border border-black rounded-3xl'><img src={UrgencyLogo} className='h-4 md:h-6 mx-1' alt='Add button'></img>Urgency</button>
                        <button className='flex items-center max-sm:h-10 max-sm:w-[80px] md:p-1 md:px-3 shadow-lg hover:bg-myPink border border-black rounded-3xl'><img src={HeartRed} className='h-4 md:h-6 mx-1' alt='Add button'></img>Favorite</button>
                    </div>

                    {/* NOTES */}
                    <div className="notes flex flex-col items-center justify-center">
                        {data.map(val =>
                            <SubNote key={val.id} title={val.title} description={val.description} time={val.time} urgencyLevel={urgencyLevel}
                            />)}
                    </div>
                </main>

                {/* When notes empty */}
                {/* <img src={EmtpyNotes} alt="Your notes are empty" />
                <div className='flex'>
                    <h1 className='text-xl sm:text-3xl'>Your notes are empty !!</h1>
                    <button className='flex items-center mx-2 p-1 px-3 hover:bg-myPink border border-black rounded-3xl'><img src={AddLogo} className='h-6' alt='Add button'></img>Add note</button>
                </div> */}

            </div>
        </>
    )
}

export default Notes