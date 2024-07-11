import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { RouterProvider, Route, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLayout from './layout/MainLayout'
import List from './pages/List'
import NotFound from './pages/404'
import PrivateRouter from './router/PrivateRouter'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />} >
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/' element={<PrivateRouter />} >
        <Route path="/list" element={<List />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>,
)
