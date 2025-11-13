import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// NEW: Import GoogleAuthProvider and signInWithPopup
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';

import Button from '../other/Button';
import Navbar from '../Navbar';

import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User logged in:', userCredential.user);
      navigate("/home");
    } catch (error) {
      console.error('Error logging in:', error.message);

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert('Invalid email or password.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // NEW: Handler for Google Sign-In
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in with Google:', result.user);
      navigate('/home');
    } catch (error) {
      console.error('Error with Google sign-in:', error.message);
      alert(`Google Sign-In Error: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              text="Login" 
              onClick={handleLogin}
              type="primary"
              buttonType="submit"
            />
          </form>

          {/* --- NEW SECTION --- */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          <Button 
            text="Sign in with Google" 
            onClick={handleGoogleLogin}
            type="secondary" 
          />
          {/* --- END NEW SECTION --- */}

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;