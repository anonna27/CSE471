import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Writing from './pages/Writing/Writing';
import Chapters from './pages/Chapters/Chapters';
import Story from './pages/Story/Story';

import './App.css';
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data && response.data.user) {
            const { username } = response.data.user;
            setName(username);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <Router>
      <div className='app'>
        <Switch>
          <Route path="/" exact>
            {!isLoggedIn ? (
              <>
                <Navbar setShowLogin={setShowLogin} setShowSignup={setShowSignup} />
                {showLogin && <Login onClose={() => setShowLogin(false)} setIsLoggedIn={setIsLoggedIn} setName={setName} />}
                {showSignup && <SignUpForm onClose={() => setShowSignup(false)} />}
              </>
            ) : (
              <Redirect to="/home" />
            )}
          </Route>
          <Route path="/home" exact>
            {isLoggedIn ? (
              <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={name} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/profile" exact>
            {isLoggedIn ? (
              <Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={name} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/writing" exact>
            {isLoggedIn ? (
              <Writing />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/chapters" exact>
            {isLoggedIn ? (
              <Chapters isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={name} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/stories/:id" exact>
            {isLoggedIn ? (
              <Story isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={name} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
