import React from 'react'
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <>
            {/* <div className='parent flex items-center text-lg h-16 bg-myBlue' > */}
            <div className='parent flex items-center text-white text-lg h-16 glassEffect' >

                <ul className='flex justify-around w-full'>
                    <li className='hover:text-myBlue'><Link to="/" >SocialNote</Link></li>
                    <li className='hover:text-myBlue'><Link to="/" >Home</Link></li>
                    <li className='hover:text-myBlue'><Link to="/notes" >MyNotes</Link></li>
                    <li className='hover:text-myBlue'><Link to="/signup" >Signup</Link></li>
                </ul>

            </div>
        </>
    )
}

export default Navbar