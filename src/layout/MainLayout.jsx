import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from '../firebase/CheckAuth'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainLayout() {

  const [user, setUser] = useState(false)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(true)
      else setUser(false)
    })
  }, [user])

  return (
    <>
      <div>
        <Navbar user={user} />
        <Outlet />
        <ToastContainer />
        <Footer />
      </div>
    </>
  )
}

export default MainLayout;
