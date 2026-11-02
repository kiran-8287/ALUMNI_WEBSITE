import '../Navbar/Navbar.css';
import logo from '../../assets/iar.png';
import iitPkdLogo from '../../assets/iit_pkd.jpg';
import menu from "../../assets/menu.svg";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useStore from '../../Store';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
// import { FaUserCircle } from "react-icons/fa";
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const token = useStore((state) => state.token);
  const userRole = useStore((state) => state.userRole);
// const setToken = useStore((state) => state.setToken);

  const logout = useStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      logout();
      setShowMenu(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-link">
        <a href="https://iitpkd.ac.in" target="_blank" rel="noopener noreferrer">
          <img src={iitPkdLogo} alt="IIT PKD Logo" className="logo2" />
        </a>
        <a href="/">
          <img src={logo} alt="IAR Cell Logo" className="logo1" />
        </a>
      </div>

      <div className="desktopMenu">
        <Link to="/home" className="desktopMenuListItem">Home</Link>
        <Link to="/about" className="desktopMenuListItem">About us</Link>
        
        <div className="desktopMenuListItem alumni-trigger" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
          Alumni
          <div className={`dropdownMenu ${showDropdown ? 'visible' : ''}`}>
            <Link to="/NotableAlumni" className="dropdownListItem" onClick={() => setShowDropdown(false)}>Notable Alumni</Link>
            <Link to="/AlumniDirectorySignIn" className="dropdownListItem" onClick={() => setShowDropdown(false)}>Alumni Directory</Link>
          </div>
        </div>

        <Link to="/events" className="desktopMenuListItem">Events</Link>
        <a href="https://iitpkd.ac.in/gallery" className="desktopMenuListItem">Gallery</a>

        {token ? (
          <div className="authSection">
              {userRole === "admin" ? (
              <Link to="/admin-dashboard" className="profile-icon">
              <i className="fas fa-user-shield"></i>
              </Link>
              ) : (
              <Link to="/profile" className="profile-icon">
                <i className="fas fa-user-circle"></i>
              </Link>
            )}

            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>

        ) : (
          <Link to="/Verification" className="signin-button">Sign In</Link>
        )}
      </div>

      <img src={menu} alt="menu" className="mobmenu" onClick={() => setShowMenu(!showMenu)} />

      <div className="navMenu" style={{ display: showMenu ? 'flex' : 'none' }}>
        <Link to="/home" className="ListItem" onClick={() => setShowMenu(false)}>Home</Link>
        <Link to="/about" className="ListItem" onClick={() => setShowMenu(false)}>About us</Link>
        {/* <Link to="/LifeAtIITPKD" className="ListItem" onClick={() => setShowMenu(false)}>Life At IITPKD</Link> */}
        
        <div className="ListItem" onClick={() => setShowMobileDropdown(!showMobileDropdown)}>
          Alumni
        </div>
        {showMobileDropdown && (
          <div className="mobileDropdown">
            <Link to="/NotableAlumni" className="dropdownListItem" onClick={() => setShowMenu(false)}>Notable Alumni</Link>
            <Link to="/AlumniDirectorySignIn" className="dropdownListItem" onClick={() => setShowMenu(false)}>Alumni Directory</Link>
          </div>
        )}

        <Link to="/events" className="ListItem" onClick={() => setShowMenu(false)}>Events</Link>
        <a href="https://iitpkd.ac.in/gallery" className="ListItem" onClick={() => setShowMenu(false)}>Gallery</a>

        {token ? (
          <>
            <Link
              to={userRole === "admin" ? "/admin-dashboard" : "/profile"}
              className="ListItem" onClick={() => setShowMenu(false)}
            >{userRole === "admin" ? "Dashboard" : "Profile"}
            </Link>
            <div className="ListItem logout-item" onClick={handleLogout}>Logout</div>
          </>
        ) : (
          <Link to="/Verification" className="ListItem" onClick={() => setShowMenu(false)}>Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
