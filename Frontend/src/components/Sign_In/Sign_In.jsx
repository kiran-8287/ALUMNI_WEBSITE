import {React,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup ,signInWithRedirect,signOut,getRedirectResult} from "firebase/auth";
import { auth, provider } from "../../firebase/firebaseConfig";
import useStore from "../../Store";
import logo from "../../assets/OTP/IIT_PKD_long logo_RGB.jpg";
import "./Sign_In.css";


// console.log("ENV:", import.meta.env);

const BACKEND_URL = import.meta.env.VITE_BASE_URL;
console.log("Backend URL:", import.meta.env.VITE_BASE_URL);

const SignIn = () => {
  const navigate = useNavigate();
  const setToken = useStore((state) => state.setToken);
  const setUserEmail = useStore((state) => state.setUserEmail);
  const setTokenId = useStore((state) => state.setTokenId);
  const setUserRole = useStore((state) => state.setUserRole);
  // const handleGoogleLogin = async () => {
  //   try {
  //     await signInWithRedirect(auth, provider);
  //   } catch (error) {
  //     console.error("Google Redirect Error:", error);
  //     alert("Authentication failed. Try again.");
  //   }
  // };

// useEffect(() => {
//   const handleRedirectResult = async () => {
//     try {
//       const result = await getRedirectResult(auth);
//       if (!result) {
//         // console.log()
//       }; // user just opened page normally

//       const user = result.user;
//       const tokenId = await user.getIdToken();
//       setTokenId(tokenId);

//       const res = await fetch(`${BACKEND_URL}/check-email`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${tokenId}`,
//         },
//       });

//       if (!res.ok) throw new Error("Backend failed");

//       const data = await res.json();

//       if (!data.role) {
//         await signOut(auth);
//         alert("You are not authorized to access this portal.");
//         return;
//       }

//       setToken(true);
//       setUserEmail(user.email);
//       setUserRole(data.role);

//       console.log("The role is:", data.role);
//       navigate("/");

//     } catch (error) {
//       console.error("Redirect Sign-In Error:", error);
//       alert("Authentication failed. Try again.");
//     }
//   };

//   handleRedirectResult();
// }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const tokenId = await user.getIdToken();
      setTokenId(tokenId);
    const res = await fetch(`${BACKEND_URL}/check-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenId}`,
      },
    });

    const data = await res.json();

    if (!data.role) {
      await signOut(auth);
      alert("You are not authorized to access this portal.");
      return;
    }
    //   const idToken = await user.getIdToken();
    //   setTokenId(idToken);
    //   setToken(true);
    //   setUserEmail(user.email);

    //   navigate("/");
    // } catch (error) {
    //   console.error("Google Sign-In Error:", error);
    //   alert("Authentication failed. Try again.");
      // }
     
      setToken(true);
      setUserEmail(user.email);
      setUserRole(data.role); // "admin" or "alumni"
      console.log("the role is "+data.role);

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
