import React from 'react'
import { useState } from 'react';
import { BrowserRouter as Router, Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Event1 from "./pages/Events/Event1"
import Event2 from "./pages/Events/Event2"
import Event3 from "./pages/Events/Event3"
import Event4 from "./pages/Events/Event4"
import Event5 from "./pages/Events/Event5"
import Event6 from "./pages/Events/Event6"
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
import NotFoundPage from './components/PageNotFound/NotFoudPage';
function App() {
  const token = useStore((state) => state.token);
  return (
  <div className='bg'>
    <Router>
      <ScrollToTop />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Event1" element={<Event1 />} />
        <Route path="/Event2" element={<Event2 />} />
        <Route path="/Event3" element={<Event3 />} />
        <Route path="/Event4" element={<Event4 />} />
        <Route path="/Event5" element={<Event5 />} />
        <Route path="/Event6" element={<Event6 />} />
        <Route path="/events" element={<Events />} />
        <Route path="/LifeAtIITPKD" element={<LIfeAtIITPKD />} />
        <Route path="/Verification" element={<OTPSignIn/>}/>
        <Route path="/NotableAlumni" element={<NotableAlumni />} />
        <Route path="/AlumniDirectorySignIn" element={<AlumniDirectorySignIn/>}/>
        {/* <Route path="/SignIn" element={<SignIn setToken={setToken} />} /> */}
        <Route path="/SignUp" element={<SignUpPage />} />
          {/* Protected Routes */}
        <Route element={<PrivateRoute1 token={token}/>}> <Route path="/AlumniDirectory" element={<AlumniDirectory />} />  </Route>
        <Route element={<PrivateRouteProfile token={token}/>}> <Route path="/profile" element={<AlumniProfile />} />  </Route>
        <Route element={<PrivateRouteProfile token={token}/>}> <Route path="/Admin" element={<AlumniProfile />} />  </Route>
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Router>
    </div>
  )
}

export default App
