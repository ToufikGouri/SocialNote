import React, { useState } from 'react'
import DeleteLogo from "../assets/Notes Assets/Cancel.png"
import HeartRed from "../assets/Notes Assets/Heart filled.png"
import HeartWhite from "../assets/Notes Assets/Heart unfilled.png"
import Modal from "../components/Modal"
import axios from 'axios'
import MyModal from './ModalNote'
import { ToastContainer, toast } from 'react-toastify';

const SubNote = ({ _id, title = "Title", description = "Description", time = "Date", urgencyLevel = "Low", favorite = false, onNoteAdded }) => {

    const [liked, setLiked] = useState(favorite)            // note liked or not
    const [modalOpen, setModalOpen] = useState(false)       // modal open close
    const [myModalOpen, setMyModalOpen] = useState(false)   // modal update

    const formatedTime = time.split("-").reverse().join("-")
    let noteColor = "urgentGreen";

    // Setting note bg color
    if (urgencyLevel === "High") {
        noteColor = "urgentRed"
    } else if (urgencyLevel === "Mid") {
        noteColor = "urgentOrange"
    } else {
        noteColor = "urgentGreen"
    }

    const handleLike = async (val) => {
        setLiked(val)
        await axios.patch("/api/v1/notes/updatenote", { _id, favorite: val })
        onNoteAdded()
    }

    const handleDelete = async () => {
        await axios.delete(`/api/v1/notes/deletenote/${_id}`).then(() => toast.success("Note deleted successfully"))
        setModalOpen(false)
        onNoteAdded()
    }


    return (
        <>
            <div onClick={() => setMyModalOpen(true)} className={`noteBody my-2 drop-shadow-lg cursor-pointer hover:shadow-xl relative inline-block rounded-xl bg-${noteColor} min-h-32 w-72 md:w-3/6 p-4`}>
                <p className='absolute right-3 top-0 italic'>{time}</p>

                <h1 className='font-bold'>{title}</h1>
                <p>{description}</p>

                {/* logos of notes */}
                <div className='absolute top-[-8px] right-[-8px] hover:cursor-pointer' onClick={(e) => { e.stopPropagation(); setModalOpen(true) }} ><img className='h-5' src={DeleteLogo} alt="Delete" /></div>
                <div className='absolute top-[-8px] left-[-8px] hover:cursor-pointer dropLine' onClick={(e) => { e.stopPropagation(); handleLike(!liked) }}><img className='h-5' src={liked === true ? HeartRed : HeartWhite} alt="Like" /></div>
            </div >


            {/* Delete Modal */}
            <Modal Modal isOpen={modalOpen} deleteOrNot={handleDelete} onClose={() => setModalOpen(false)}>
                <h2 className="text-xl mb-1">Remove this note?</h2>
            </Modal >

            {/* Update Modal */}
            < MyModal modalOpen={myModalOpen} setModalOpen={setMyModalOpen} onNoteAdded={onNoteAdded}
                tl={title} desc={description} ti={formatedTime} ur={urgencyLevel} fav={liked}
                _id={_id} successMsg='updated' methodHandle={(data) => axios.patch("/api/v1/notes/updatenote", data)}
            />

        </>
    )
}

export default SubNote