import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebaseConfig";
import useStore from "../../Store";
import logo from "../../assets/OTP/IIT_PKD_long logo_RGB.jpg";
import "./Sign_In.css";

const SignIn = () => {
  const navigate = useNavigate();
  const setToken = useStore((state) => state.setToken);
  const setUserEmail = useStore((state) => state.setUserEmail);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // // OPTIONAL: restrict to IIT Palakkad email
      // if (!user.email.endsWith("@iitpkd.ac.in")) {
      //   await auth.signOut();
      //   alert("Only IIT Palakkad emails are allowed.");
      //   return;
      // }

      setToken(true);
      setUserEmail(user.email);

      navigate("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Authentication failed. Try again.");
    }
  };

  return (
    <div className="otp-signin-page">
      <div className="container">
        <div className="signin-card">

          <div className="header">
            <div className="logo-section">
              <img src={logo} alt="IIT Palakkad Logo" className="logo" />
            </div>
            <h1>Welcome to IIT Palakkad</h1>
            <p>Sign in securely using your Google account</p>
          </div>

          <div className="signin-form">
            <button className="btn btn-primary google-btn" onClick={handleGoogleLogin}>
              <span>Sign in with Google</span>
            </button>

            <p className="signup-text">
              Don’t have an account? <Link to="/Signup">Register</Link>
            </p>
          </div>

          <div className="footer-info">
            <p>Indian Institute of Technology Palakkad</p>
            <p className="tagline">Nurturing Minds For a Better World</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignIn;
