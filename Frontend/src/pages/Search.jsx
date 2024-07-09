import React, { useState } from 'react'
import Profile from "../pages/Profile"
import axios from 'axios'
import SearchLogo from "../assets/Posts Assets/Search.png"
import BackLogo from "../assets/Posts Assets/Back.png"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Search = () => {

    const [username, setUsername] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [noResult, setNoResult] = useState(false)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const loggedInUser = useSelector(state => state.user.userData)

    const handleSearch = async () => {
        const searchUser = username.trim().toLowerCase()
        if (!searchUser) return

        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/search`, {
                params: { searchUser, usernameOnly: true },     // get only usernames
                withCredentials: true
            }).then((res) => setSearchResults(res.data.data))
            setNoResult(false)
        } catch (error) {
            setSearchResults([])
            setNoResult(true)
            console.log("Failed to seach", error);
        }
    }

    const handleGetUser = async (searchUser) => {

        if (searchUser === loggedInUser.username) {
            navigate('/profile')
            return
        }

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/search`, {
            params: { searchUser },    // get whole user data
            withCredentials: true
        }).then((res) => setUser(res.data.data))

        setUsername(searchUser)
        setSearchResults([])
    }

    return (
        <>
            <div>
                {user ?
                    (
                        // User profile
                        <div>
                            <div className='relative h-8'>
                                <div onClick={() => setUser(null)} className='cursor-pointer flex group absolute top-12 sm:top-0  sm:left-[20%]'>
                                    <button className={`bgImgProps w-7 h-7 mx-1 group-hover:-translate-x-1 transition-transform`} style={{ backgroundImage: `url(${BackLogo})` }}></button>
                                    <p className='font-semibold'>Back to search</p>
                                </div>
                            </div>
                            {user && (<Profile ownProfile={false} userData={user} />)}
                        </div>
                    ) :
                    (
                        <div className={`flex flex-col items-center justify-center h-screen py-12 sm:py-6`} >
                            {/* Searching logic */}
                            <div className={`fixed top-12 sm:top-10 sm:left-1/3`}>
                                <div className="SearchInput">
                                    <input
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); if (e.target.value === "") { setSearchResults([]); setNoResult(false) } }}   // setting searchResults back to empty when user clears the input
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                                        className='border-2 border-black  p-2 pe-10 w-80 sm:w-96 rounded-md outline-none' type="text" id="search" placeholder='Search by usernames...'
                                    />
                                    <button onClick={handleSearch} className={`bgImgProps w-7 h-7 absolute top-2 right-1`} style={{ backgroundImage: `url(${SearchLogo})` }}></button>
                                </div>
                                {/* If we got search results */}
                                <ul>
                                    {searchResults.map(val =>
                                        <li key={val._id} onClick={() => handleGetUser(val.username)}
                                            className='border-2 border-t-0 p-1 px-2 cursor-pointer text-slate-500 hover:text-black hover:bg-black/5'>
                                            {val.username}
                                        </li>
                                    )}
                                </ul>
                            </div>
                            {/* Search response message */}
                            <div className='absolute sm:left-1/3 text-center'>
                                {searchResults.length > 0 ? (
                                    <p className='text-3xl font-semibold'>Found {searchResults.length} user(s)</p>
                                ) : (
                                    noResult ? (<p className='text-3xl font-semibold'>No users found</p>)
                                        : (<p className='text-3xl font-semibold'>Find users by their usernames</p>)
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Search