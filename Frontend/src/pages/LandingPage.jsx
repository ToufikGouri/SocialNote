import React from 'react'
import Notes from "../assets/hero_notes.png"
import SocialMedia from "../assets/hero_socialmedia.png"
import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <>
            <div className='md:flex flex-col items-center linearBG'>

                <div className="md:flex text-white">
                    {/* Left side */}
                    <div className="sectionLeft flex justify-center md:w-1/2">
                        <h1 className='text-5xl mt-20 md:mt-32 leading-tight text-center max-md:mx-4 md:text-left md:text-6xl md:w-3/4 lg:w-2/4'>
                            Your favorite place for adding <span className='text-myGreen'>notes</span> and <span className='text-myGreen'>connect</span> with world.
                        </h1>
                    </div>

                    {/* Right side */}
                    <div className="sectionRight md:pt-28 lg:pt-0 max-md:my-12 md:w-1/2">

                        <div className="notes max-md:justify-center flex items-center">
                            <img src={Notes} className='h-44 sm:h-48 lg:h-80' alt="Add notes easily" />
                            <h1 className='text-2xl sm:text-4xl'>Add private <br /> notes</h1>
                        </div>

                        <div className="socialMedia max-md:justify-center flex items-center">
                            <h1 className='text-2xl sm:text-4xl relative max-md:left-6'>Connect with <br /> others</h1>
                            <img src={SocialMedia} className='h-36 sm:h-48 lg:h-80' alt="Connect with others" />
                        </div>

                    </div>
                </div>

                <Link to="/signup"
                    className='bg-myGreen w-32 text-2xl p-2 px-6 rounded-3xl relative bottom-10 max-md:left-1/3 max-md:bottom-5
                    hover:text-white hover:scale-105 hover:ease-in-out'>Signup
                </Link>

            </div>
        </>
    )
}

export default LandingPage