import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn = false }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Later: Clear auth tokens, user data, etc.
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          BibTeX Generator
        </Link>

        <div className="navbar-right">
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