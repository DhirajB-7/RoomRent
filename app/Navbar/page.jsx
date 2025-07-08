import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className='flex  h-13 justify-between p-5 items-center'>
      <div className=''>
        <Link className='cursor-pointer'  href={"/"} >
        Jari Rooms
        </Link>
       
        </div>
        <div className='flex gap-10'>
            <div>
            <Link href={"/register"}>Sign Up</Link>
            </div>
            <div>
            <Link href={"/login"}>Sign In</Link>
            </div>
            <div>
            <Link href={"/user"}>Profile</Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar
