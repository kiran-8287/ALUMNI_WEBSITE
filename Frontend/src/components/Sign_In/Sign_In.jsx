import { Link } from 'react-router-dom';
import React, { useEffect, useState,useRef } from 'react';
import './Sign_In.css';
import { initializeOTPSignIn } from './otpScript';
import logo from "../../assets/OTP/IIT_PKD_long logo_RGB.jpg"
import useStore from '../../Store';
const OTPSignIn = () => {
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);
  const sendOtpBtnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const resendBtnRef = useRef(null);
  const otpSectionRef = useRef(null);
  const successMessageRef = useRef(null);
  const formRef = useRef(null);
  const setToken = useStore((state) => state.setToken);
  const token = useStore((state) => state.token);
  const [emailNotFound, setEmailNotFound] = useState(false); //for handling email not found state
  const setUserEmail = useStore((state) => state.setUserEmail);

  console.log("Token state:", token);
  useEffect(() => {
    initializeOTPSignIn({
      emailInputRef,
      otpInputRef,
      sendOtpBtnRef,
      loginBtnRef,
      resendBtnRef,
      otpSectionRef,
      successMessageRef,
      formRef,
      token,
      setToken, // ✅ Pass Zustand method here
      setUserEmail,
      onSuccessRedirect: () => {
        window.location.href = '/#'; // or useNavigate for React Router
      },
      onEmailNotFound: () => {
        setEmailNotFound(true); // Show popup if email not found
      },
    });
  }, []);

  return (
    <div className="otp-signin-page">
    <div className="container">
      <div className="signin-card">

          {emailNotFound && (
            <div className="popup-overlay"
             onClick={() => setEmailNotFound(false)}
            >
              <div className="popup error"
               onClick={(e) => e.stopPropagation()}
              >
                <p>Email is not registered. Please <Link to="/Signup">Register</Link>.</p>
                <button className="close-btn" onClick={() => setEmailNotFound(false)}>×</button>
              </div>
            </div>
          )}


        <div className="header">
          <div className="logo-section">
            <img src={logo} alt="IIT Palakkad Logo" className="logo" />
          </div>
          <h1>Welcome to IIT Palakkad</h1>
          <p>Enter your email to receive an OTP for secure access</p>
        </div>

        <form className="signin-form" ref={formRef}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input ref={emailInputRef} type="email" placeholder="your@gmail.com" required />
            <span className="error-message" id="emailError"></span>
          </div>

          <button type="button" className="btn btn-primary" ref={sendOtpBtnRef}>
            <span className="btn-text">Send OTP</span>
            <span className="btn-loader" id="otpLoader"></span>
          </button>

          <div className="otp-section" ref={otpSectionRef}>
            <div className="form-group">
              <label htmlFor="otp">Enter 6-Digit OTP</label>
              <input ref={otpInputRef} type="text" maxLength="6" placeholder="000000" />
              <span className="error-message" id="otpError"></span>
            </div>

            <button type="button" className="btn btn-primary" ref={loginBtnRef}>
              <span className="btn-text">Verify & Login</span>
              <span className="btn-loader" id="loginLoader"></span>
            </button>

            <div className="resend-section">
              <p>Didn't receive the code? <button type="button" className="link-btn" ref={resendBtnRef}>Resend OTP</button></p>
            </div>
          </div>
          <div>
            <p>If you don't have an account <Link to="/Signup" className='link-btn'>register</Link></p>
        </div>
        </form>
        
        <div className="success-message" ref={successMessageRef}>
          <div className="success-icon">✓</div>
          <h2>Authentication Successful!</h2>
          <p>Welcome to IIT Palakkad Alumni Portal. You will be redirected shortly.</p>
        </div>

        

        <div className="footer-info">
          <p>Indian Institute of Technology Palakkad</p>
          <p className="tagline">Nurturing Minds For a Better World</p>
        </div>
      </div>
    </div></div>
  );
};

export default OTPSignIn;
