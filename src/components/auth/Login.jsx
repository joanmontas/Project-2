import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Button from '../other/Button';
import Navbar from '../Navbar';

import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleLogin = () => {
    console.log('Login clicked', { email, password });
    navigate("/home")
    // Backend integration will go here later
  };

  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          <form onSubmit={(e) => e.preventDefault()}>
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
            />
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;