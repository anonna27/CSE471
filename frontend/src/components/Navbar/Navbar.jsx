import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import SignUpForm from '../SignUpForm/SignUpForm';
import Login from '../Login/Login';


const Navbar = ({ setShowLogin }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLogin, setShowLoginState] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Menu");

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowLoginState(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowLoginState(true);
    setShowSignIn(false);
  };

  const handleClosePopups = () => {
    setShowSignIn(false);
    setShowLogin(false);
    setShowLoginState(false);
  };

  const handleSignupClick = () => {
    setShowSignIn(true);
    setShowLoginState(false);
  };

  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className='logo' />
      <img src={assets.art} alt="" className='art' />
      <ul className="navbar-menu">
        <li onClick={() => setActiveMenuItem("Home")} className={activeMenuItem === "Home" ? "active" : ""}>Home</li>
        <li onClick={() => setActiveMenuItem("Menu")} className={activeMenuItem === "Menu" ? "active" : ""}>Menu</li>
        <li onClick={() => setActiveMenuItem("Contact-Us")} className={activeMenuItem === "Contact-Us" ? "active" : ""}>Contact Us</li>
        <div className="sliding-line" style={{ left: activeMenuItem === "Home" ? "0%" : activeMenuItem === "Menu" ? "33.33%" : "66.66%" }}></div>
      </ul>
      <div className="dot">
        <button onClick={handleSignInClick}>SIGN UP</button>
        <button onClick={handleLoginClick}>LOG IN</button>
      </div>

      {showSignIn && <SignUpForm onClose={handleClosePopups} onLoginClick={handleLoginClick} />}
      {showLogin && <Login onClose={handleClosePopups} onSignupClick={handleSignupClick} />}
    </div>
  );
};

export default Navbar;




