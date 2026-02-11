import React from 'react'
import { useState } from 'react';
import { BrowserRouter as Router, Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Event1 from "./pages/Events/Event1"
import Event2 from "./pages/Events/Event2"
import Event3 from "./pages/Events/Event3"
import Events from "./pages/Events"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"
import LIfeAtIITPKD from "./pages/LIfeAtIITPKD"
import NotableAlumni from "./pages/NotableAlumni"
import AlumniDirectorySignIn from "./pages/AlumniDirectorySignIn"
import PrivateRoute1 from './ProtectedRoute';
import PrivateRouteProfile from './ProtectedRouteProfile';
import AlumniDirectory from "./pages/AlumniDirectory"
import useStore from './Store';
import OTPSignIn from './components/Sign_In/Sign_In';
import AlumniProfile from './components/Alumni_profile/Alumni_profile';
import SignUpPage from './components/Signup/signup';
import Admin from './components/Admin/Admin';
import './App.css';
import IDCardGeneratorPage from './pages/IDCardGenerator/IDCardGenerator';
import NotFoundPage from './components/PageNotFound/NotFoudPage';
import Intro from './components/INTRO/Intro';
function App() {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.userRole);
  console.log("the user here in the app.jsx file is " + user);
  return (
  <div className='bg'>
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Intro/>}/>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Event1" element={<Event1 />} />
        <Route path="/Event2" element={<Event2 />} />
        <Route path="/Event3" element={<Event3 />} />
        {/* Event4, Event5, Event6 removed */}
        <Route path="/events" element={<Events />} />
        <Route path="/LifeAtIITPKD" element={<LIfeAtIITPKD />} />
        <Route path="/Verification" element={<OTPSignIn/>}/>
        <Route path="/NotableAlumni" element={<NotableAlumni />} />
        <Route path="/AlumniDirectorySignIn" element={<AlumniDirectorySignIn/>}/>
        {/* <Route path="/SignIn" element={<SignIn setToken={setToken} />} /> */}
        <Route path="/SignUp" element={<SignUpPage />} />
          {/* Protected Routes */}
          <Route path="/id-card-generator" element={<IDCardGeneratorPage />} />
        <Route element={<PrivateRouteProfile token={token}/>}> <Route path="/AlumniDirectory" element={<AlumniDirectory />} />  </Route>
        <Route element={<PrivateRouteProfile token={token}/>}> <Route path="/profile" element={<AlumniProfile />} />  </Route>
        <Route element={<PrivateRouteProfile token={user==="admin"}/>}> <Route path="/admin-dashboard" element={<Admin />} />  </Route>
        {/* <Route path="/Dashboard" element={<Admin />} />   */}
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Router>
    </div>
  )
}

export default App
