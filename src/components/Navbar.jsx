import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Navbar.css';

function Navbar({ isLoggedIn = false }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          BibTeX Generator
        </Link>

        <div className="navbar-right">
          {<Link to="/about" className="navbar-link">
              About
            </Link>
          }
          {isLoggedIn && (
            <Link to="/my-bibliographies" className="navbar-link">
              My Library
            </Link>
          )}
          {isLoggedIn ? (
            <button className="navbar-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="navbar-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;