import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';
import "./AlumniDirectorySignIn.css";
import useStore from '../Store';

const AlumniDirectorySignIn = () => {
  const token = useStore((state)=>state.token);
  const userRole = useStore((state)=>state.userRole);
  
  return (
    <div className="alumni-signin-container">
      <Navbar />
      <hr className="alumni-divider" />
      <div className="alumni-content">
        {token && userRole === 'admin' ? (
          <p className="alumni-message">
            Administrator access confirmed. <Link to="/AlumniDirectory" className="alumni-link">Open Alumni Directory</Link>
          </p>
        ) : token ? (
          <p className="alumni-message">The Alumni Directory is restricted to administrators.</p>
        ) : (
          <>
            <p className="alumni-message">
              You need to be logged in to see the results
            </p>
            <Link to="/Verification" className="alumni-signin-btn">Sign In</Link>
            <p className="alumni-subtitle">Why do I need to login?</p>
            <p className="alumni-description">
              This platform is for alumni, students and faculty of IIT Palakkad. By logging in, 
              you will help us authenticate your identity to use this platform.
            </p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AlumniDirectorySignIn;
