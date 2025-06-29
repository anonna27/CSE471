

//--------------------------------------------------------------

// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import './Login.css';
// import axios from 'axios';

// const Login = ({ onClose, onSignupClick }) => {
//   const history = useHistory();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(''); // State for success message

//   const handleLoginClick = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/user/login', { email, password });
//       console.log('Received response:', response.data);

//       if (response.status === 200) {
//         localStorage.setItem('token', response.data.token);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           history.push('/'); // Redirect to home page after a short delay
//         }, 5000); // 5000 milliseconds = 5 seconds
//       } else {
//         setError(response.data.error || 'Login failed. Please try again.');
//         setSuccess('');
//       }
//     } catch (error) {
//       setError('Login failed. Please try again.');
//       setSuccess('');
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <div className="login-form">
//       <button className="close-button" onClick={onClose}>✕</button>
//       <h2>Login</h2>
//       <form onSubmit={handleLoginClick}>
//         <div className="form-group">
//           <input
//             type="email"
//             placeholder="Email:"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="password"
//             placeholder="Password:"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {success && <div className="success-message">{success}</div>} {/* Display success message */}
//         <button type="submit">Login</button>
//       </form>
//       <p style={{ marginTop: '10px', textAlign: 'center' }}>
//         Don't have an account?{' '}
//         <span
//           onClick={onSignupClick}
//           style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
//         >
//           Signup
//         </span>
//       </p>
//     </div>
//   );
// };

// export default Login;

//--------------------------------------------------------

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = ({ onClose, onSignupClick, setIsLoggedIn,setName }) => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/login', { email, password });
      console.log('Received response:', response.data);

      if (response.status === 200) {
        // Store the token, userId, and userName in localStorage for persistence
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);  // Store userId
        localStorage.setItem('userName', response.data.userName); // Store userName if needed

        // Update the state with login success and user information
        setSuccess('Login successful!');
        setError('');
        setIsLoggedIn(true);
        setName(response.data.userName);  // Update the state with userName

        // Redirect to the homepage
        history.push('/home'); 
      } else {
        // Handle login failure
        setError(response.data.error || 'Login failed. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      // Handle any other errors (e.g., network or server errors)
      setError('Login failed. Please try again.');
      setSuccess('');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-form">
      <button className="close-button" onClick={onClose}>✕</button>
      <h2>Login</h2>
      <form onSubmit={handleLoginClick}>
        <div className="form-group">
          <input type="email" placeholder="Email:" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password:" value={password}  onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '10px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <span onClick={onSignupClick} style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }} > Signup </span>
      </p>
    </div>
  );
};

export default Login;

