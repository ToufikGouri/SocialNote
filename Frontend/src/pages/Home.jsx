import React from 'react'
import LandingPage from './LandingPage'
import { useSelector } from "react-redux"
import Feed from './Feed'
import LoadingLogo from "../assets/Loading.svg"

const Home = () => {

    const isLoggedIn = useSelector(state => state.user.isLoggedIn)
    const loading = useSelector(state => state.user.loading)


    if (loading) {
        return <div className='h-[90vh] flex justify-center items-center' ><img className='h-32' src={LoadingLogo} alt="Loading..." /></div>
    }

    return (
        <>
            {/* {
                !isLoggedIn ? (
                    <LandingPage />
                ) : (
                    <Feed />
                    )
                    } */}
            <Feed />
        </>
    )
}

export default Home