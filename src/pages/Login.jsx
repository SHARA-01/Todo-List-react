import React, { useState } from 'react'
import { auth, logInWithEmailAndPassword } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [passvisable, setPassvisable] = useState(false)

    const handleLogin = async () => {
        if (email !== '' && password !== '') {
            await logInWithEmailAndPassword(email, password);
        } else {
            toast.error('All fields are required.')
        }

        await onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/list')
            } else {
                return;
            }
        })
    }

    const handlePasswordVisiblity = () => {
        setPassvisable(!passvisable)
    }
    return (
        <div className='min-h-[89vh]'>
            <div className='flex flex-col space-y-3 text-center w-[550px] border p-5 py-10 rounded-md shadow-md mx-auto my-5 px-12 '>
                <span className='text-black-700 text-left text-xl font-semibold'>Login your account</span>
                <input className='px-4  py-1 shadow-md border rounded-md focus:shadow-xl focus:outline-none' type="email" onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                <span className='flex w-full'>
                    <input className='w-full px-4 py-1 shadow-md border rounded-md focus:shadow-xl focus:outline-none ' type={passvisable ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    <button className='-ml-9' onClick={handlePasswordVisiblity}>🔑</button>
                </span>

                <button onClick={handleLogin} className='border rounded-md bg-blue-500 text-white py-1 font-semibold focus:border-blue-500 focus:bg-white focus:text-blue-500 hover:shadow-md hover:bg-white hover:text-blue-500 hover:border-blue-400'>Login</button>
                <span className='text-left'>Don't have an account?<Link className='text-blue-600' to='/register'> Register</Link></span>
            </div>
        </div>
    )
}

export default Login;