import '../Navbar/Navbar.css';
import logo from '../../assets/iar.png';
import iitpkd from '../../assets/iit_pkd.jpg';
import contact from '../../assets/contact.png';
import menu from "../../assets/menu.svg";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useStore from '../../Store';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const token = useStore((state) => state.token);
// const setToken = useStore((state) => state.setToken);

  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
  };

  return (
    <nav className="navbar">
      <img src={logo} alt="logo" className="logo1" />

      <div className="desktopMenu">
        <Link to="/" className="desktopMenuListItem">Home</Link>
        <Link to="/about" className="desktopMenuListItem">About us</Link>
        {/* <Link to="/LifeAtIITPKD" className="desktopMenuListItem">Life At IITPKD</Link> */}
        
        <div className="desktopMenuListItem" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
          Alumni
          {showDropdown && (
            <div className="dropdownMenu">
              <Link to="/NotableAlumni" className="dropdownListItem">Notable Alumni</Link>
              <Link to="/AlumniDirectorySignIn" className="dropdownListItem">Alumni Directory</Link>
            </div>
          )}
        </div>

        <Link to="/events" className="desktopMenuListItem">Events</Link>

        {token ? (
          <div className="authSection">
            <Link to="/profile" className="profile-icon">
              <i className="fas fa-user-circle"></i>
            </Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        ) : (
          <Link to="/Otp" className="signin-button">Sign In</Link>
        )}
      </div>

      <img src={menu} alt="menu" className="mobmenu" onClick={() => setShowMenu(!showMenu)} />

      <div className="navMenu" style={{ display: showMenu ? 'flex' : 'none' }}>
        <Link to="/" className="ListItem" onClick={() => setShowMenu(false)}>Home</Link>
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

        {token ? (
          <>
            <Link to="/profile" className="ListItem" onClick={() => setShowMenu(false)}>Profile</Link>
            <div className="ListItem logout-item" onClick={handleLogout}>Logout</div>
          </>
        ) : (
          <Link to="/Otp" className="ListItem" onClick={() => setShowMenu(false)}>Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;