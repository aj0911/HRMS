import React, { useEffect } from 'react'
import {  useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    // States
    const auth = useSelector(state=>state.auth)
    const navigate = useNavigate();

    // Rendering
    useEffect(()=>{
        if(!auth.isAuth)navigate('/auth')
    },[])

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard