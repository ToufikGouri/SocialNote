import React, { useEffect, useState } from 'react'
import DeleteLogo from "../assets/Notes Assets/Cancel.png"
import HeartRed from "../assets/Notes Assets/Heart filled.png"
import HeartWhite from "../assets/Notes Assets/Heart unfilled.png"
import Modal from "../components/Modal"

const SubNote = ({ title = "Title", description = "Description", time = "Date", urgencyLevel = "Low" }) => {

    const [liked, setLiked] = useState(false)            // note liked or not
    const [modalOpen, setModalOpen] = useState(false)    // model open close
    const [isDelete, setIsDelete] = useState(false)      // delete or not value 

    let noteColor = "urgentGreen";

    // Setting note bg color
    if (urgencyLevel === "High") {
        noteColor = "urgentRed"
    } else if (urgencyLevel === "Mid") {
        noteColor = "urgentOrange"
    } else {
        noteColor = "urgentGreen"
    }


    return (
        <>
            <div className={`noteBody my-2 drop-shadow-lg relative inline-block rounded-xl bg-${noteColor} min-h-32 w-72 md:w-3/6 p-4`}>
                <p className='absolute right-3 top-0 italic'>{time}</p>

                <h1 className='font-bold'>{title}</h1>
                <p>{description}</p>

                {/* logos of notes */}
                <div className='absolute top-[-8px] right-[-8px] hover:cursor-pointer' onClick={() => setModalOpen(true)} ><img className='h-5' src={DeleteLogo} alt="Delete" /></div>
                <div className='absolute top-[-8px] left-[-8px] hover:cursor-pointer dropLine' onClick={() => setLiked(!liked)}><img className='h-5' src={liked === true ? HeartRed : HeartWhite} alt="Like" /></div>
            </div>


            {/* Delete Modal */}
            <Modal isOpen={modalOpen} deleteOrNot={() => { setIsDelete(true); setModalOpen(false) }} onClose={() => setModalOpen(false)}>
                <h2 className="text-xl mb-1">Remove this note?</h2>
            </Modal>

        </>
    )
}

export default SubNote