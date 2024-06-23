import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts, getUserAllPosts } from '../redux/feedSlice'
import Post from '../components/Post'

const Feed = () => {

    // allPosts, userPosts

    const allPosts = useSelector(state => state.feed.allPosts)
    const loading = useSelector(state => state.feed.loading)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllPosts())
        dispatch(getUserAllPosts())
    }, [])

    const data = [
        {
            "_id": "667697f5959f256e5af86ce4",
            "caption": "My first ever post",
            "comments": [],
            "createdAt": "2024-06-22T09:23:01.091Z",
            "image": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1719048180/Posts/sku1xdnkwbkceqjqztkp.png",
            "likes": [],
            "owner": {
                "_id": "666c2003d51a72b755fc49db",
                "username": "check",
                "avatar": "http://res.cloudinary.com/duj7aqdfc/image/upload/v1718362115/Users/xzq4kgvefruujx6ybxon.png"
            },
            "totalComments": 0,
            "totalLikes": 0,
            "updatedAt": "2024-06-22T09:23:01.091Z",
            "__v": 0
        },
        {
            "_id": "6676cfa00a86a458998ac9f0",
            "caption": "Awesome AI cat",
            "comments": [],
            "createdAt": "2024-06-22T13:20:32.600Z",
            "image": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1719062430/Posts/v3pf6ivnly7svmjzmgnj.webp",
            "likes": [],
            "owner": {
                "_id": "666c2003d51a72b755fc49db",
                "username": "check",
                "avatar": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1718362115/Users/xzq4kgvefruujx6ybxon.png"
            },
            "totalComments": 0,
            "totalLikes": 0,
            "updatedAt": "2024-06-22T13:20:32.600Z",
            "__v": 0
        },
        {
            "_id": "6676cfe30a86a458998ac9f8",
            "caption": "The beautiful eiffel tower I visited today",
            "comments": [],
            "createdAt": "2024-06-22T13:21:39.715Z",
            "image": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1719062498/Posts/ah8oh0txgmkuaigrjoz6.jpg",
            "likes": [],
            "owner": {
                "_id": "66718b62e6fc39680bb1e78b",
                "username": "mtg",
                "avatar": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1718717284/Users/tlhqxhzw9ehn6kvkbj6r.jpg"
            },
            "totalComments": 0,
            "totalLikes": 0,
            "updatedAt": "2024-06-22T13:21:39.715Z",
            "__v": 0
        },
        {
            "_id": "6676d00c0a86a458998ac9fc",
            "caption": "The mountain i am going to hike tommorow, any other advice for upcoming tour? I would love to hear from you guys",
            "comments": [],
            "createdAt": "2024-06-22T13:22:20.825Z",
            "image": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1719062539/Posts/dcmbbppg3ygbgpcrqzbk.jpg",
            "likes": [],
            "owner": {
                "_id": "66718b62e6fc39680bb1e78b",
                "username": "mtg",
                "avatar": "https://res.cloudinary.com/duj7aqdfc/image/upload/v1718717284/Users/tlhqxhzw9ehn6kvkbj6r.jpg"
            },
            "totalComments": 0,
            "totalLikes": 0,
            "updatedAt": "2024-06-22T13:22:20.825Z",
            "__v": 0
        }
    ]


    // console.log("All posts", allPosts);
    // getting All posts data till this point just using custom data because of overview in development in mobile(can't login backend localhost issue)

    return (
        <>
            {/* <h1>This is feed</h1> */}

            <div className="flex flex-col items-center">
                {data.map(val =>
                    <Post key={val._id} _id={val._id} owner={val.owner} image={val.image}
                    caption={val.caption} totalLikes={val.totalLikes} totalComments={val.totalComments} uploadTime={val.createdAt} />
                )}
            </div>
        </>
    )
}

export default Feed