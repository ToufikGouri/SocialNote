import React, { useState } from 'react'
import LikeLogo from "../assets/Posts Assets/Like.svg"
import UnLikeLogo from "../assets/Posts Assets/Unlike.svg"
import CommentLogo from "../assets/Posts Assets/Comment.svg"
import SaveLogo from "../assets/Posts Assets/Save.svg"
import UnSaveLogo from "../assets/Posts Assets/UnSave.svg"
import VerifiedLogo from "../assets/Posts Assets/Verified.svg"

const Post = ({ _id, owner, image, caption, totalLikes, totalComments, uploadTime }) => {

    const [postLiked, setPostLiked] = useState(false)
    const [postSaved, setPostSaved] = useState(false)
    const [longCaption, setLongCaption] = useState(false)


    return (
        <>
            <div className="w-full sm:w-1/3 my-2 overflow-hidden">

                {/* Post owner and image */}
                <div className='flex m-2 items-center'>
                    <img className='h-10 w-10 rounded-full me-2' src={owner.avatar} alt="User" />
                    <p className='font-semibold'>{owner.username}</p>
                    {/* <p className='font-semibold'>{uploadTime}</p> */}
                </div>
                <img className='w-96 sm:w-full' src={image} alt="Post" />

                {/* Like,Comment & Share buttons*/}
                <div className='flex justify-between m-2 sm:mx-0'>
                    <div className='flex'>
                        <div className='cursor-pointer invertHalf w-7'>
                            <img onClick={() => setPostLiked(!postLiked)} className={`h-7`} src={postLiked ? LikeLogo : UnLikeLogo} alt="Likes" />
                        </div>
                        <div className='cursor-pointer invertHalf mx-3'>
                            <img className={`h-7`} src={CommentLogo} alt="Comments" />
                        </div>
                    </div>
                    <div className='cursor-pointer invertHalf'>
                        <img onClick={() => setPostSaved(!postSaved)} className={`h-7`} src={postSaved ? SaveLogo : UnSaveLogo} alt='Save' />
                    </div>
                </div>

                {/* Post details */}
                <div className='mx-3 sm:mx-1'>
                    <p className='font-semibold'>{totalLikes} likes</p>
                    <p><span className='font-semibold inline-flex items-center me-1'>{owner.username} <img className={`h-5 sm:mt-1 isVerifiedCodeHere`} src={VerifiedLogo} alt="Verified" /></span>
                        {caption?.length < 85 ? (caption) : (longCaption ? caption : <span>{caption.split("").splice(0, 85).join("") + "..."} <span onClick={() => setLongCaption(true)} className='text-gray-400 cursor-pointer'>more</span></span>)}
                    </p>
                    <p className='font-light'>View all {totalComments} comments</p>
                </div>

            </div>
            <div className="lineBreak d-none hidden w-full sm:block sm:w-1/3 my-4 border border-myGrey"></div>
        </>
    )
}

export default Post