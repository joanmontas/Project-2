import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// NEW: Import fetchSignInMethodsForEmail
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../../firebase';

import Button from '../other/Button';
import Navbar from '../Navbar';

import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError("ERROR: Passwords do not match! Please Try again,=.");
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError("ERROR: Please fill out all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      console.error('Error registering:', error.message);
      
      if (error.code === 'auth/email-already-in-use') {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, formData.email);
          if (methods.includes('google.com')) {
            setError('This email is already registered with Google. Please log in with Google instead.');
          } else {
            setError('This email address is already in use.');
          }
        } catch (fetchError) {
          setError('This email address is already in use.');
        }
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. It should be at least 6 characters.');
      } else {
        setError(error.message);
      }
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setSuccess('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in/up with Google:', result.user);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      console.error('Error with Google sign-in:', error.message);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        try {
          const email = error.customData.email;
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes('password')) {
            setError('This email is registered with a password. Please log in with your email and password to link your Google account.');
          } else {
            setError('An account already exists with this email. Please log in with your original method.');
          }
        } catch (fetchError) {
          setError('Could not check sign-in methods. Please try again.');
        }
      } else {
        setError(`Google Sign-In Error: ${error.message}`);
      }
    }
  };

  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Register</h2>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              text="Register" 
              onClick={handleRegister}
              type="primary"
              buttonType="submit"
            />
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <Button 
            text="Sign up with Google" 
            onClick={handleGoogleRegister}
            type="secondary" 
          />

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;