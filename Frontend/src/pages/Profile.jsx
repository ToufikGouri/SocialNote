import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getUserAllPosts, getUserSavedPosts } from '../redux/feedSlice'
import Post from "../components/Post"
import VerifiedLogo from "../assets/Posts Assets/Verified.png"
import UserPostsLogo from "../assets/Posts Assets/UserPosts.png"
import SavedPostsLogo from "../assets/Posts Assets/SavedPosts.png"
import ModalProfile from '../components/ModalProfile'
import { ModalBody } from "../components/Modal"
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'


const Profile = ({ ownProfile = true, userData = {} }) => {

    const user = ownProfile ? useSelector(state => state.user.userData) : userData
    const userPosts = ownProfile ? useSelector(state => state.feed.userPosts) : userData.posts
    const { savedPosts, loading } = useSelector(state => state.feed)
    const dispatch = useDispatch()
    const [posts, setPosts] = useState([])
    const [activeSection, setActiveSection] = useState("posts")
    const [modalOpen, setModalOpen] = useState(false)
    const [modalFollow, setModalFollow] = useState(false)

    // for checking someone's profile
    const loggedInUser = useSelector(state => state.user.userData)
    const checkFollow = loggedInUser?.following.includes(user?._id) || false
    const [isFollowing, setIsFollowing] = useState(checkFollow)
    const [followersCount, setFollowersCount] = useState(user?.followers.length)
    const [followListData, setFollowListData] = useState([])

    const handleFollow = async (val) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/follow`, { isFollow: val, followTo: user._id }, { withCredentials: true })
            setIsFollowing(val)
            setFollowersCount(followersCount + (val ? 1 : -1))
        } catch (error) {
            toast.error("Failed to follow")
        }
    }

    const handleFollowList = async (action) => {
        if (action === "followers") {
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/followers/${user?._id}`, { withCredentials: true })
                    .then((res) => setFollowListData(res.data.data.followers))
            } catch (error) {
                toast.error("Failed to load followers")
            }
        } else if (action === "following") {
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/following/${user?._id}`, { withCredentials: true })
                    .then((res) => setFollowListData(res.data.data.following))
            } catch (error) {
                toast.error("Failed to load following")
            }
        } else {
            toast.error("Something went wrong")
        }
    }

    // on reload the data takes time to get fetched so condition for reload is:
    // if userposts or savedposts is still null (default is null if empty we'll get empty array) means the data not set till now then dispatch else don't
    // for this userPosts,savedPosts is used in dependency because it'll change on fetching user data
    useEffect(() => {
        if (ownProfile && (userPosts === null || savedPosts === null)) {
            dispatch(getUserAllPosts())
            dispatch(getUserSavedPosts())
            setActiveSection("posts")
        }
        setPosts(userPosts)
    }, [userPosts, savedPosts])

    useEffect(() => {
        // this use effect is just used to reload the profile on change in userposts or savedposts
        // which is handled and dispatched in post already
    }, [userPosts, savedPosts])

    return (
        <>
            <div className='flex flex-col items-center sm:items-end'>

                <div className="mainContainer w-full sm:w-3/4 sm:me-16 py-12 sm:py-6">
                    <div className="profileContainer flex max-sm:flex-col max-sm:items-center">

                        {/* Avatar image Start*/}
                        <div className='w-full sm:w-1/4 flex sm:justify-center items-center max-sm:px-2'>
                            <img className='rounded-full object-cover h-24 w-24 sm:h-40 sm:w-40 border border-black' src={user?.avatar} alt="user profile pic" />

                            {/* Profile data for small screen */}
                            <div className='sm:hidden ms-3 w-full flex flex-col justify-evenly font-bold'>
                                <p className='inline-flex items-center'>{user?.username} <span className={`h-5 w-5 ms-1 sm:mt-1 ${user?.isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></p>
                                <div className='flex justify-between w-full my-2'>
                                    <p className='flex flex-col items-center leading-4'><span>{user?.posts?.length}</span> posts</p>
                                    <button onClick={() => { setModalFollow(true); handleFollowList("followers") }} className='flex flex-col items-center leading-4'><span>{followersCount}</span> Followers</button>
                                    <button onClick={() => { setModalFollow(true); handleFollowList("following") }} className='flex flex-col items-center leading-4'><span>{user?.following?.length}</span> Following</button>
                                </div>
                            </div>

                        </div>

                        {/* Profile data for bigger screen */}
                        <div className='flex flex-col justify-evenly font-bold w-full sm:w-2/4 sm:text-xl'>
                            <p className='hidden sm:inline-flex items-center'>{user?.username} <span className={`h-5 w-5 ms-1 sm:mt-1 ${user?.isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></p>

                            <div className='hidden sm:flex justify-between w-full'>
                                <p>{user?.posts?.length} posts</p>
                                <button onClick={() => { setModalFollow(true); handleFollowList("followers") }} >{followersCount || user?.followers.length} Followers</button>
                                <button onClick={() => { setModalFollow(true); handleFollowList("following") }} >{user?.following?.length} Following</button>
                            </div>

                            <div className='max-sm:p-2 w-full'>
                                <p className={`font-normal text-base min-h-6`}>{user?.bio}</p>

                                {/* Follow/Edit profile buttons */}
                                {
                                    ownProfile ? (
                                        <button onClick={() => setModalOpen(true)} className={`font-normal text-base w-full text-center rounded-md border-2 border-black hover:bg-black hover:bg-opacity-5 `}>
                                            Edit profile
                                        </button>
                                    ) : (
                                        <button onClick={() => handleFollow(!isFollowing)} className={`font-normal text-base w-full text-center rounded-md border-2 text-white bg-sky-500 hover:bg-sky-300`}>
                                            {isFollowing ? "Unfollow" : "Follow"}
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='postsContainer flex flex-col items-center sm:my-10 py-5' >

                        {/* Profile posts selection */}
                        <div className='postType w-full sm:w-2/4'>
                            <div className='flex'>
                                <button onClick={() => { setPosts(userPosts); setActiveSection("posts") }} className={`font-normal w-full text-center border-b-2 ${activeSection === "posts" ? "text-blue-500 border-blue-500" : "text-slate-300 hover:text-blue-300"} `}>Posts</button>
                                {ownProfile && <button onClick={() => { setPosts(savedPosts); setActiveSection("saved") }} className={`font-normal w-full text-center border-b-2 ${activeSection === "saved" ? "text-blue-500 border-blue-500" : "text-slate-300 hover:text-blue-300"} `}>Saved Posts ({savedPosts?.length})</button>}
                            </div>
                        </div>

                        {/* Profile posts */}
                        <div className="Posts sm:w-full flex flex-col items-center">
                            {posts?.length > 0 ?
                                (
                                    // If there are some posts
                                    posts.map(val =>
                                        <Post key={val._id} _id={val._id} owner={val.owner} image={val.image}
                                            caption={val.caption} totalLikes={val.totalLikes} totalComments={val.totalComments} uploadTime={val.createdAt}
                                            isLiked={val.isLiked} isCommented={val.isCommented} isSaved={val.isSaved} isVerified={val.isVerified} following={isFollowing} />
                                    )
                                ) : (
                                    // If there are no posts
                                    activeSection === "posts" ? (   // for empty posts
                                        <div className='flex flex-col items-center'>
                                            <img className='h-40 w-40 my-10' src={UserPostsLogo} alt="Empty posts" />
                                            <p className='text-3xl font-semibold'>No Posts Yet</p>
                                        </div>
                                    ) : (                           // for empty saved posts
                                        <div className='flex flex-col items-center'>
                                            <img className='h-40 w-40 my-10' src={SavedPostsLogo} alt="Empty posts" />
                                            <p className='text-3xl font-semibold'>Your Saved Posts Will Appear Here</p>
                                        </div>
                                    )
                                )}
                        </div>

                    </div>

                </div>

                {/* Modal for following/followers list */}
                <ModalBody isOpen={modalFollow} onClose={setModalFollow}>
                    <div className='w-full min-h-60 max-h-96 overflow-y-auto'>
                        <div className='w-full flex justify-center text-xl'>
                            <div className="font-semibold inline-flex items-center">{user?.username}<span className={`h-5 w-5 mx-1 sm:mt-1 ${user?.isVerified ? "" : "hidden"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></div>
                        </div>
                        {followListData.length > 0 ?
                            (
                                followListData.map((val) =>
                                    <div key={val._id} className='flex relative py-2 p-3' >
                                        <div className='me-2'>
                                            <div className='cursor-pointer h-8 w-8 bg-cover bg-no-repeat bg-center rounded-full border border-black' style={{ backgroundImage: `url(${val.avatar})` }}></div>
                                        </div>
                                        <div className='w-full flex justify-between'>
                                            <div className="font-semibold inline-flex">{val.username}<span className={`h-5 w-5 mx-1 sm:mt-1 ${val.isVerified ? "" : "invisible w-0"}  bgImgProps`} style={{ backgroundImage: `url(${VerifiedLogo})` }} /></div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className='flex justify-center items-center h-52'>
                                    <p className="text-xl">No data to display</p>
                                </div>
                            )}
                    </div>
                </ModalBody>
                {/* Modal for edit profile */}
                <ModalProfile modalOpen={modalOpen} setModalOpen={setModalOpen} />
                <ToastContainer limit={3} />
            </div>
        </>
    )
}

export default Profile