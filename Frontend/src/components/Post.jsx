import React, { useState } from 'react'
import LikeLogo from "../assets/Posts Assets/Like.png"
import UnLikeLogo from "../assets/Posts Assets/Unlike.png"
import CommentLogo from "../assets/Posts Assets/Comment.png"
import SaveLogo from "../assets/Posts Assets/Save.png"
import UnSaveLogo from "../assets/Posts Assets/UnSave.png"
import VerifiedLogo from "../assets/Posts Assets/Verified.png"
import ThreeDotsLogo from "../assets/Posts Assets/ThreeDots.png"
import DeleteLogo from "../assets/Notes Assets/Cancel.png"
import Modal from "react-modal"
import ModalLike from "react-modal"
import ModalPost from './ModalPost'
import ModalComment from './Modal'
import ModalDltPost from './Modal'
import { ModalBody } from './Modal'
import { toast } from "react-toastify"
import { useSelector } from 'react-redux'
import axios from 'axios'

// function to get date of user's activity in simple form
export const getTime = (defaultTime) => {
    let newUploadTime = defaultTime.replaceAll("-", "").slice(0, 8)
    let todayTime = Number(new Date().toISOString().replaceAll("-", "").slice(0, 8))
    let result = todayTime - Number(newUploadTime)

    if (result === 0) {
        return "today"
    } else if (result === 1) {
        return "1 d"
    } else if (result <= 7) {
        return `${result} d`
    } else {

        let day = newUploadTime.slice(6, newUploadTime.length)
        let month = new Date().toLocaleString("default", { month: "long" })
        let year = newUploadTime.slice(0, 4)

        return `${day} ${month} ${year}`
    }
}

const Post = ({ _id, owner, image, caption, totalLikes, totalComments, isLiked, isCommented, isSaved, uploadTime, isVerified = true }) => {

    /* const data = [
        {
            "content": "I love ai images they look so cool nowadays and it's too real amazing work beautiful looking ",
            "createdAt": "2024-06-25T15:15:39.682Z",
            "owner": {
                "avatar": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1718362115/Users/xzq4kgvefruujx6ybxon.png",
                "username": "check",
                "_id": "666c2003d51a72b755fc49db"
            },
            "post": "6676cfa00a86a458998ac9f0",
            "updatedAt": "2024-06-25T15:15:39.682Z",
            "__v": 0,
            "_id": "667adf1bc403015726f2abda"
        },
        {
            "content": "Wow wonderful cat i loved it",
            "createdAt": "2024-06-25T15:20:56.619Z",
            "owner": {
                "avatar": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1718362115/Users/xzq4kgvefruujx6ybxon.png",
                "username": "check",
                "_id": "666c2003d51a72b755fc49db"
            },
            "post": "6676cfa00a86a458998ac9f0",
            "updatedAt": "2024-06-25T15:20:56.619Z",
            "__v": 0,
            "_id": "667ae058673def4fb2122abc"
        },
        {
            "content": "This cat looks so cute ^_^",
            "createdAt": "2024-06-26T10:38:08.849Z",
            "owner": {
                "avatar": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1718717284/Users/tlhqxhzw9ehn6kvkbj6r.jpg",
                "username": "mtg",
                "_id": "66718b62e6fc39680bb1e78b"
            },
            "post": "6676cfa00a86a458998ac9f0",
            "updatedAt": "2024-06-26T10:38:08.849Z",
            "__v": 0,
            "_id": "667bef904d200bd79b623aa2"
        }
    ] */

    const user = useSelector(state => state.user.userData)
    // modals
    const [modalOpen, setModalOpen] = useState(false)            // opening modal for comments
    const [modalOpenLike, setModalOpenLike] = useState(false)    // opening modal for likes
    const [modalDeleteComment, setModalDeleteComment] = useState(false)
    const [modalUpdatePost, setModalUpdatePost] = useState(false)
    const [modalEditPost, setModalEditPost] = useState(false)
    const [modalDeletePost, setModalDeletePost] = useState(false)

    const [postLiked, setPostLiked] = useState(isLiked)
    const [postSaved, setPostSaved] = useState(isSaved)
    const [postComments, setPostComments] = useState([])    //loading post's all comments
    const [postAllLikes, setPostAllLikes] = useState([])    //loading post's all likes
    const [commentContent, setCommentContent] = useState("")
    const [longCaption, setLongCaption] = useState(false)

    // post's likes, comments count
    const [likesCount, setLikesCount] = useState(totalLikes)
    const [commentsCount, setCommentsCount] = useState(totalComments)
    const [currentCmntId, setCurrentCmntId] = useState(null)

    const handleLikeOrSave = async (action, val) => {
        if (action === "like") {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/like`, { postId: _id, isLiked: val }, { withCredentials: true })
            setLikesCount(likesCount + (val ? 1 : -1))  // update likes count
            setPostLiked(val)
        } else if (action === "save") {
            setPostSaved(val)
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/save`, { postId: _id, isSaved: val }, { withCredentials: true })
        } else {
            toast.error("Something went wrong")
        }
    }

    const handleUpdatePost = async (action, updatedCaption = caption) => {
        // Update post route => updatepost  { caption, _id }
        if (action === "edit") {
            try {
                await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/feed/updatepost`, { _id, caption: updatedCaption }, { withCredentials: true })
                toast.success("Post updated successfully")
            } catch (error) {
                toast.error("Error while updating post")
            }
        } else if (action === "delete") {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/feed/deletepost/${_id}`, { withCredentials: true })
                toast.success("Post deleted successfully")
            } catch (error) {
                toast.error("Error while deleting post")
            }
        } else {
            toast.error("Something went wrong")
        }

        setModalEditPost(false)
        setModalDeletePost(false)
        setModalUpdatePost(false)
    }

    const loadLikes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/getlike/${_id}`, { withCredentials: true })
            setPostAllLikes(response.data.data.likes)

        } catch (error) {
            console.log("Axios error", error);       // remove this after
            toast.error("Failed to load comments")
        }
    }

    const loadComments = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/getcomment/${_id}`, { withCredentials: true })
            setPostComments(response.data.data.comments)

        } catch (error) {
            console.log("Axios error", error);       // remove this after
            toast.error("Failed to load comments")
        }
    }

    const handleAddComment = async () => {

        const content = commentContent.trim()

        if (!content) {
            toast.warn("Can't add empty comment")
        } else {

            //if no error means create comment
            try {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/addcomment`, { postId: _id, content }, { withCredentials: true })
                loadComments()
                setCommentsCount(commentsCount + 1)
                setCommentContent("")
                // setModalOpen(false)
            } catch (error) {
                console.log("Axios error", error);       // remove this after
                toast.error("Failed to add comment")
            }
        }
    }

    const handleDeleteComment = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/deletecomment/${currentCmntId}`, { withCredentials: true })
            setModalDeleteComment(false)
            setCommentsCount(commentsCount - 1)
            loadComments()

        } catch (error) {
            console.log("Axios error", error);       // remove this after
            toast.error("Failed to delete comment")
        }
    }

    return (
        <>
            <div className="w-full sm:w-1/3 my-2 overflow-hidden">

                {/* Post owner and image */}
                <div className='flex m-2 items-center relative max-sm:max-w-96'>
                    <img className='h-10 w-10 rounded-full me-2' src={owner.avatar} alt="User" />
                    <p className='font-semibold inline-flex'>{owner.username} <span className={`h-5 w-5 ms-1 sm:mt-1 ${isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></p>
                    <p className='mx-2 font-light'>{getTime(uploadTime)}</p>
                    <div className={`cursor-pointer font-semibold text-blue-500 hover:text-blue-100 duration-100 ${owner._id === user?._id ? "hidden" : ""}`}>Follow</div>
                    <button onClick={() => { setModalUpdatePost(true) }} className={`${user?._id === owner._id ? "visible" : "invisible"} absolute right-0 top-4  cursor-pointer invertHalf h-4 w-4 bgImgProps`} style={{ backgroundImage: `url(${ThreeDotsLogo})` }}></button>
                </div>
                <div className='min-h-52 flex'>
                    <img className='w-96 self-center sm:w-full' src={image} onDoubleClick={() => handleLikeOrSave("like", true)} alt="Post" />
                </div>

                {/* Like,Comment & Share buttons*/}
                <div className='flex max-sm:max-w-96 justify-between m-2 sm:mx-0'>
                    <div className='flex'>
                        <button onClick={() => handleLikeOrSave("like", !postLiked)} className='cursor-pointer invertHalf h-7 w-7 bgImgProps' style={{ backgroundImage: `url(${postLiked ? LikeLogo : UnLikeLogo})` }}></button>
                        <button onClick={() => { setModalOpen(true); loadComments() }} className='cursor-pointer invertHalf h-7 w-7 bgImgProps mx-3' style={{ backgroundImage: `url(${CommentLogo})` }}></button>
                    </div>
                    <button onClick={() => handleLikeOrSave("save", !postSaved)} className='cursor-pointer invertHalf h-7 w-7 bgImgProps' style={{ backgroundImage: `url(${postSaved ? SaveLogo : UnSaveLogo})` }}></button>
                </div >

                {/* Post details */}
                <div className='mx-3 sm:mx-1' >
                    <button onClick={() => { setModalOpenLike(true); loadLikes() }} className='font-semibold'>{likesCount} likes</button>
                    <p><span className='font-semibold inline-flex items-center me-1'>{owner.username} <span className={`h-5 w-5 ms-1 sm:mt-1 ${isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></span>
                        {caption?.length < 85 ? (caption) : (longCaption ? caption : <span>{caption.split("").splice(0, 85).join("") + "..."} <span onClick={() => setLongCaption(true)} className='text-gray-400 cursor-pointer'>more</span></span>)}
                    </p>
                    <button onClick={() => { setModalOpen(true); loadComments() }} className='font-light'>View all {commentsCount} comments</button>
                </div >

            </div >
            <div className="lineBreak hidden w-full sm:block sm:w-1/3 my-4 border border-myGrey"></div>

            {/* Deleting comment */}
            <ModalComment isOpen={modalDeleteComment} okBtn={"Delete"} deleteOrNot={handleDeleteComment} onClose={() => setModalDeleteComment(false)}>
                <h2 className="text-xl mb-1">Delete comment?</h2>
            </ModalComment >

            {/* Updating post */}
            <ModalBody isOpen={modalUpdatePost} onClose={() => setModalUpdatePost(false)} >
                <div className='flex flex-col justify-around'>
                    <button onClick={() => setModalEditPost(true)} className='cursor-pointer text-xl duration-150 text-blue-500 hover:text-blue-100'>Edit</button>
                    <span className="LineBreak border my-2"></span>
                    <button onClick={() => setModalDeletePost(true)} className='cursor-pointer text-xl duration-150 text-red-500 hover:text-red-100'>Delete</button>
                    <span className="LineBreak border my-2"></span>
                    <button onClick={() => setModalUpdatePost(false)} className='cursor-pointer text-xl duration-150 hover:text-gray-300'>Cancel</button>
                </div>
            </ModalBody>

            {/* Editing post */}
            <ModalPost modalOpen={modalEditPost} setModalOpen={setModalEditPost} updatedImage={image} updatedCaption={caption} handleEditPost={handleUpdatePost} disableImageUpload={true} />

            {/* Deleting post */}
            <ModalDltPost isOpen={modalDeletePost} okBtn={"Delete"} deleteOrNot={() => handleUpdatePost("delete")} onClose={() => setModalDeletePost(false)}>
                <h2 className="text-xl my-2 mb-1">Delete post?</h2>
            </ModalDltPost >

            {/* Likes loading */}
            <ModalLike
                isOpen={modalOpenLike}
                onRequestClose={() => setModalOpenLike(false)}
                contentLabel="Custom Modal"
                className="w-full sm:w-1/2 lg:w-1/3 outline-none bg-white"
                overlayClassName="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className='flex flex-col items-center relative'>

                    <div className='p-3 w-full text-center text-xl border-b-2'> Likes </div>

                    {/* Post's likes */}
                    <div className='w-full min-h-60 max-h-96 overflow-y-auto'>       
                        {postAllLikes.length > 0 ? (
                            postAllLikes.map(val =>
                                <div key={val._id} className='flex relative py-2 p-3' >
                                    <div className='me-2'>
                                        <div className='cursor-pointer h-8 w-8 bg-cover bg-no-repeat bg-center rounded-full border border-black' style={{ backgroundImage: `url(${val.owner.avatar})` }}></div>
                                    </div>
                                    <div className='w-full flex justify-between'>
                                        <div className="font-semibold inline-flex">{val.owner.username}<span className={`h-5 w-5 mx-1 sm:mt-1 ${isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></div>
                                        <div className={`cursor-pointer font-semibold text-blue-500 hover:text-blue-100 duration-100 ${val.owner._id === user?._id ? "hidden" : ""}`}>Follow</div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className='flex flex-col justify-center items-center min-h-60'>
                                <h1 className='font-bold text-2xl'>No Likes yet.</h1>
                            </div>
                        )}
                    </div>

                    {/* Modal close button */}
                    <div className='absolute top-[-8px] right-[-8px] hover:cursor-pointer dropLine' onClick={() => setModalOpenLike(false)}><img className='h-6 invert' src={DeleteLogo} alt="Delete" /></div>
                </div>
            </ModalLike>

            {/* Comments handling */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => { setModalOpen(false); setCommentContent("") }}
                contentLabel="Custom Modal"
                className="w-full sm:w-1/2 lg:w-1/3 outline-none bg-white"
                overlayClassName="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className='flex flex-col items-center relative'>

                    {/* Post owner details */}
                    <div className='flex p-3 w-full border-b-2'>
                        <div className='me-2'>
                            <div className='cursor-pointer h-8 w-8 bg-cover bg-no-repeat bg-center rounded-full border border-black' style={{ backgroundImage: `url(${owner.avatar})` }}></div>
                        </div>
                        <div className="font-semibold inline-flex">{owner.username} <span className={`h-5 w-5 ms-1 sm:mt-1 ${isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></div>
                        <div className={`cursor-pointer font-semibold text-blue-500 hover:text-blue-100 duration-100 ms-2 ${owner._id === user?._id ? "hidden" : ""}`}>Follow</div>
                    </div>

                    {/* Post's comments */}
                    <div className='w-full min-h-60 max-h-96 overflow-y-auto'>
                        {postComments.length > 0 ? (
                            postComments.map(val =>
                                <div key={val._id} className='flex relative py-2 p-3' >
                                    <div className='me-2'>
                                        <div className='cursor-pointer h-8 w-8 bg-cover bg-no-repeat bg-center rounded-full border border-black' style={{ backgroundImage: `url(${val.owner.avatar})` }}></div>
                                    </div>
                                    <div>
                                        <div>
                                            <div className="font-semibold inline-flex">{val.owner.username} <span className={`h-5 w-5 mx-1 sm:mt-1 ${isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></div>
                                            <span className='font-normal'>{val.content}</span>
                                        </div>
                                        <p className='font-light text-sm'>{getTime(val.createdAt)}</p>
                                    </div>
                                    {/* Delete comment */}
                                    <button onClick={() => { setCurrentCmntId(val._id); setModalDeleteComment(true) }} className={`${user._id === val.owner._id ? "visible" : "invisible"} absolute right-0 top-4  cursor-pointer invertHalf h-4 w-4 bgImgProps`} style={{ backgroundImage: `url(${ThreeDotsLogo})` }}></button>
                                </div>
                            )
                        ) : (
                            <div className='flex flex-col justify-center items-center min-h-60'>
                                <h1 className='font-bold text-2xl'>No comments yet.</h1>
                                <p>Start the conversation.</p>
                            </div>
                        )}
                    </div>

                    {/* Adding comment */}
                    <div className='px-3 flex items-center w-full border-t-2'>
                        <textarea className='resize-none mt-6 min-h-8 w-full leading-5 focus:outline-none' value={commentContent} placeholder='Add a comment...'
                            onChange={(e) => {
                                setCommentContent(e.target.value);
                                e.target.style.height = `auto`
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 90)}px`
                            }}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { handleAddComment() } }}
                        >
                        </textarea>
                        <div onClick={handleAddComment} className={`cursor-pointer font-semibold ${commentContent ? "text-blue-500" : "text-blue-100"} `}>Post</div>
                    </div>

                    {/* Modal close button */}
                    <div className='absolute top-[-8px] right-[-8px] hover:cursor-pointer dropLine' onClick={() => setModalOpen(false)}><img className='h-6 invert' src={DeleteLogo} alt="Delete" /></div>
                </div>
            </Modal>
        </>
    )
}

export default Post