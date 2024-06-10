import React from 'react'
import Notes from "../assests/hero_notes.png"
import SocialMedia from "../assests/hero_socialmedia.png"
import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <>
            <div className='flex flex-col items-center linearBG'>

                <div className="flex text-white">
                    {/* Left side */}
                    <div className="sectionLeft flex justify-center w-1/2">
                        <h1 className='text-6xl w-2/4 mt-32 leading-tight'>Your favorite place for adding <span className='text-myGreen'>notes</span> and <span className='text-myGreen'>connect</span> with world.</h1>
                    </div>

                    {/* Right side */}
                    <div className="sectionRight w-1/2">

                        <div className="notes flex items-center">
                            <img src={Notes} className='h-80' alt="Add notes easily" />
                            <h1 className='text-4xl'>Add private <br /> notes</h1>
                        </div>

                        <div className="socialMedia flex items-center">
                            <h1 className='text-4xl'>Connect with <br /> others</h1>
                            <img src={SocialMedia} className='h-80' alt="Connect with others" />
                        </div>

                    </div>
                </div>

                <Link to="/signup" className='bg-myGreen w-32 text-2xl p-2 px-6 rounded-3xl relative bottom-10
                                   hover:text-white hover:scale-105 hover:ease-in-out'>
                    Signup</Link>
  
            </div>
        </>
    )
}

export default LandingPage