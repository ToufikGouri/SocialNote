import React, { useEffect, useRef, useState } from 'react'
import Modal from "react-modal"
import DeleteLogo from "../assets/Notes Assets/Cancel.png"
import UploadIcon from "../assets/Posts Assets/UploadIcon.png"
import UploadImage from "../assets/Posts Assets/UploadImage.png"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAllPosts, getUserAllPosts } from '../redux/feedSlice'

const ModalPost = ({ modalOpen, setModalOpen, updatedImage = null, updatedCaption = "", disableImageUpload = false, handleEditPost }) => {

    const [caption, setCaption] = useState(updatedCaption)
    const [postImage, setPostImage] = useState(updatedImage)
    const [previewImage, setPreviewImage] = useState(updatedImage)
    const imageRef = useRef(null)
    const user = useSelector(state => state.user.userData)
    const dispatch = useDispatch()

    useEffect(() => {

        if (postImage && (typeof postImage !== "string")) {
            // Create an object URL for the selected file
            const objectURL = URL.createObjectURL(postImage)
            setPreviewImage(objectURL)

            // Cleanup function to revoke the object URL
            return () => URL.revokeObjectURL(objectURL)
        }

    }, [postImage])

    const handleAddPost = async () => {

        const newCaption = caption.trim()

        if (!newCaption) {
            toast.warning("Please enter caption")
        } else if (!postImage) {
            toast.warning("Please select an image")
        } else {

            const formData = new FormData()
            formData.append("caption", newCaption)
            formData.append("image", postImage)

            try {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/feed/addpost`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                })
                setCaption("")
                setModalOpen(false)
                // updating posts
                dispatch(getAllPosts())
                dispatch(getUserAllPosts())
                imageRef.current.value = null

                toast.success("Post uploaded successfully")
            } catch (error) {
                console.log("Axios error", error);       // remove this after
                toast.error("Failed to upload post")
            }
        }

    }

    return (
        <>
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Post Modal"
                className="w-4/5 sm:w-1/2 max-sm:my-8 rounded-xl outline-none bg-white"
                overlayClassName={`fixed z-50 inset-0 flex ${postImage ? "sm:items-center" : "items-center"} justify-center bg-black bg-opacity-50`}
            >

                {/* Selecting image */}
                <div className={`h-96 flex flex-col justify-around items-center ${postImage ? "hidden" : "block"}`}>
                    <p className='text-2xl text-center font-semibold'>Create new post</p>
                    <img className="h-32 w-32" src={UploadImage} alt="Create post" />
                    <div className='text-center'>
                        {/* <div className='flex justify-center items-center border-4 border-black h-full'> */}
                        <label htmlFor="postImage" className='p-2 flex items-center bg-sky-500 cursor-pointer smoothHover text-lg rounded-lg text-white me-2'>
                            <p>Choose an image</p>
                            <img src={UploadIcon} className='h-8 w-8 ms-2 invert' alt="upload" />
                        </label>
                        <input ref={imageRef} onChange={(e) => setPostImage(e.target.files[0])} type="file" accept="image/*" id="postImage" className='hidden' />
                    </div>
                </div>

                {/* Image preview and caption */}
                <div className={`h-72 sm:h-96 flex max-sm:flex-col max-sm:items-center justify-between relative ${postImage ? "block" : "hidden"}`}>

                    <div className='w-full sm:w-2/4 h-full flex items-center justify-center max-sm:border-b-2 sm:border-r-2'>
                        <img className='w-11/12 h-full object-contain' src={previewImage} alt="Post image" />
                        {/* <div className='h-full w-80 bg-no-repeat bg-contain bg-center border-r border-black' style={{ backgroundImage: `url(${postImage && URL.createObjectURL(postImage)})` }}></div> */}
                    </div>

                    <div className='w-full sm:w-2/4 p-2'>
                        <div className='flex sm:my-2'>
                            <div className='h-8 w-8 me-2 bg-no-repeat bg-cover bg-center rounded-full border border-black' style={{ backgroundImage: `url(${user?.avatar})` }}></div>
                            <p>{user?.username}</p>
                        </div>
                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='w-full outline-none resize-none border-b-2' cols="30" rows="10" placeholder='Write a caption...'></textarea>

                        {/* Upload or remove image buttons */}
                        <div className='flex justify-around my-4'>
                            <button onClick={() => setPostImage(null)} className={`cursor-pointer duration-150 text-red-500 hover:text-red-100 ${disableImageUpload ? "hidden" : ""}`}>Change image</button>
                            <button onClick={() => { disableImageUpload ? handleEditPost("edit", caption) : handleAddPost() }} className='cursor-pointer duration-150 text-blue-500 hover:text-blue-100'>Upload</button>
                        </div>

                    </div>


                    {/* Modal close button */}
                    <div className='absolute top-[-8px] right-[-8px] hover:cursor-pointer dropLine' onClick={() => setModalOpen(false)}><img className='h-6 invert' src={DeleteLogo} alt="Delete" /></div>
                </div>
            </Modal>
        </>
    )
}

export default ModalPost