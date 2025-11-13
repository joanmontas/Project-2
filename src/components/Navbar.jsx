import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Navbar.css';

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Later: Clear auth tokens, user data, etc.
    try {
      console.log('Logging out...');
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/home" : "/"} className="navbar-logo">
          BibTeX Generator
        </Link>

        <div className="navbar-right">
          {user ? (
            // When in loged in
            <>
              <span style={{ marginRight: '15px', fontSize: '14px', color: '#374151' }}>
                {user.email}
              </span>
              <button className="navbar-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            // When in logged out
            <>
              <Link 
                to="/login" 
                className="navbar-btn" 
                style={{ marginRight: '10px', backgroundColor: 'white', color: '#2d6a4f', border: '1px solid #2d6a4f' }}
              >
                Login
              </Link>
              <Link to="/register" className="navbar-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;