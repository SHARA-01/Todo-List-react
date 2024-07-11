import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, logOut } from '../firebase/firebase'
import { toast } from 'react-toastify'
function Navbar({ user }) {
    const location = useLocation();
    const pathname = location.pathname.slice(1)
    console.log(pathname)

    const handleLogout = () => {
        let response = logOut()
        toast.success('User Logged out Successfully.', {
            position: 'top-center',
            autoClose: 2000,
            toastId: '00002'
        })
    }

    return (

        <ul className='flex space-x-5 justify-end px-8 py-1 shadow-md'>
            {
                user ?
                    <li className='py-1 align-middle'>
                        <button className='bg-blue-400 px-3 text-sm py-1 font-semibold text-white rounded-md hover:text-blue-500 hover:bg-white hover:border hover:border-blue-400' onClick={() => { handleLogout() }}>Logout</button>
                    </li>
                    :
                    <li className='py-1 align-middle'>
                        <Link className='bg-blue-400 px-3 text-sm py-1 font-semibold text-white rounded-md hover:text-blue-500 hover:bg-white hover:border hover:border-blue-400' to={pathname && pathname === 'login' ? '/register' : '/login'}>{pathname && pathname === 'login' ? "Register" : 'Login'}</Link>
                    </li>

            }


        </ul>

    )
}

export default Navbar