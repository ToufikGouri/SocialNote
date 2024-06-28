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
import ModalComment from './Modal'
import { toast } from "react-toastify"
import axios from 'axios'
import { useSelector } from 'react-redux'

const Post = ({ _id, owner, image, caption, totalLikes, totalComments, isLiked, isCommented, isSaved, uploadTime }) => {

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
    const [modalOpen, setModalOpen] = useState(false)
    const [modalDeleteComment, setModalDeleteComment] = useState(false)
    const [postLiked, setPostLiked] = useState(isLiked)
    const [postSaved, setPostSaved] = useState(isSaved)
    const [postComments, setPostComments] = useState([])
    const [commentContent, setCommentContent] = useState("")
    const [longCaption, setLongCaption] = useState(false)

    const [likesCount, setLikesCount] = useState(totalLikes)
    const [commentsCount, setCommentsCount] = useState(totalComments)
    const [currentCmntId, setCurrentCmntId] = useState(null)

    const handleLikeOrSave = async (action, val) => {
        if (action === "like") {
            try {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/like`, { postId: _id, isLiked: val }, { withCredentials: true })
                setPostLiked(val)
                setLikesCount(likesCount + (val ? 1 : -1))  // update likes count
            } catch (error) {
                console.log("Axios error", error);       // remove this after
                toast.error("Failed to like post")
            }

        } else if (action === "save") {
            setPostSaved(val)
            try {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/interaction/save`, { postId: _id, isSaved: val }, { withCredentials: true })
            } catch (error) {
                console.log("Axios error", error);       // remove this after
                toast.error("Failed to save post")
            }

        } else {
            toast.error("Something went wrong")
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
                <div className='flex m-2 items-center'>
                    <img className='h-10 w-10 rounded-full me-2' src={owner.avatar} alt="User" />
                    <p className='font-semibold'>{owner.username}</p>
                    {/* <p className='font-semibold'>{uploadTime}</p> */}
                </div>
                <div className='min-h-52 flex'>
                    <img className='w-96 self-center sm:w-full' src={image} alt="Post" />
                </div>

                {/* Like,Comment & Share buttons*/}
                <div className='flex justify-between m-2 sm:mx-0'>
                    <div className='flex'>
                        <button onClick={() => handleLikeOrSave("like", !postLiked)} className='cursor-pointer invertHalf h-7 w-7 bgImgProps' style={{ backgroundImage: `url(${postLiked ? LikeLogo : UnLikeLogo})` }}></button>
                        <button onClick={() => { setModalOpen(true); loadComments() }} className='cursor-pointer invertHalf h-7 w-7 bgImgProps mx-3' style={{ backgroundImage: `url(${CommentLogo})` }}></button>
                    </div>
                    <button onClick={() => handleLikeOrSave("save", !postSaved)} className='cursor-pointer invertHalf h-7 w-7 bgImgProps' style={{ backgroundImage: `url(${postSaved ? SaveLogo : UnSaveLogo})` }}></button>
                </div >

                {/* Post details */}
                <div className='mx-3 sm:mx-1' >
                    <p className='font-semibold'>{likesCount} likes</p>
                    <p><span className='font-semibold inline-flex items-center me-1'>{owner.username} <img className={`h-5 sm:mt-1 isVerifiedCodeHere and useDivWithBginsteadofImg`} src={VerifiedLogo} alt="Verified" /></span>
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

            <Modal
                isOpen={modalOpen}
                onRequestClose={() => { setModalOpen(false); setCommentContent("") }}
                contentLabel="Custom Modal"
                className="w-full sm:w-1/2 lg:w-1/3 outline-none bg-white"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className='flex flex-col items-center relative'>

                    {/* Post owner details */}
                    <div className='flex p-3 w-full border-b-2'>
                        <div className='me-2'>
                            <div className='cursor-pointer h-8 w-8 bg-cover bg-no-repeat bg-center rounded-full border border-black' style={{ backgroundImage: `url(${owner.avatar})` }}></div>
                        </div>
                        <div className="font-semibold">{owner.username} </div>
                        <div className={`cursor-pointer font-semibold text-blue-500 ms-2`}>Follow</div>
                    </div>

                    {/* Post's comments */}
                    <div className='w-full min-h-60'>
                        {postComments.length > 0 ? (
                            postComments.map(val =>
                                <div key={val._id} className='flex group relative py-2 p-3' >
                                    <div className='me-2'>
                                        <div className='cursor-pointer h-8 w-8 bg-cover bg-no-repeat bg-center rounded-full border border-black' style={{ backgroundImage: `url(${val.owner.avatar})` }}></div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">{val.owner.username}&nbsp;<span className='font-normal'>{val.content}</span></div>
                                    </div>
                                    {/* Delete comment */}
                                    <button onClick={() => { setCurrentCmntId(val._id); setModalDeleteComment(true) }} className={`${user._id === val.owner._id ? "group-hover:visible" : ""} absolute right-0 top-4 invisible cursor-pointer invertHalf h-4 w-4 bgImgProps`} style={{ backgroundImage: `url(${ThreeDotsLogo})` }}></button>
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