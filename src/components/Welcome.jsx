import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './other/Button'; // Assuming Button component path
import './Welcome.css';

function Welcome() {
  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="welcome-container">
        <div className="welcome-card">
          <h1 className="welcome-title">Welcome to BibTeX Converter</h1>
          <p className="welcome-subtitle">
            Simple Introduction
          </p>
          <div className="welcome-actions">
            <Link to="/login" className="welcome-link">
              <Button text="Login" type="primary" />
            </Link>
            <Link to="/register" className="welcome-link">
              <Button text="Register" type="secondary" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;