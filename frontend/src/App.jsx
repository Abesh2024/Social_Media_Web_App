// import { useState } from 'react'
// import './App.css'
import React from 'react'
import { Button, Container, Heading } from '@chakra-ui/react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import UserPage from './pages/UserPage'
import Header from './components/Header'
import PostPage from './pages/PostPage'
import HomePage from './pages/HomePage'
import Auth from './pages/Auth'
import { useRecoilValue } from 'recoil'
import userAtom from './atoms/userAtom'
// import Logout from './components/Logout'
import UpdateProfile from './pages/UpdateProfile'
import CreatePost from './components/CreatePost'

function App() {
  const user = useRecoilValue(userAtom)
  const {pathname} = useLocation();
  console.log(user);
  return (
    <Container maxW={pathname === "/" ? "900px" : "620px"}>
      <Header/>
      <Routes>
        <Route path="/" element={user ? <HomePage/> : <Navigate to="/auth" />} />
        <Route path="/auth"  element={!user ? <Auth/> : <Navigate to="/"/>}/>
        <Route path="/update"  element={user ? <UpdateProfile/> : <Navigate to="/auth"/>}/>
        
        <Route path="/:userName"  element={<UserPage/>}/>
        <Route  path="/:userId/post/:pid" element={<PostPage/>} />
      </Routes>

      {/* {user && <Logout />} */}
      {user && <CreatePost />}

    </Container>
  )
}

export default App
