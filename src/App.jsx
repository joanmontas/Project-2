import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';
import Preview from './components/Preview';
import ProtectedRoute from './components/ProtectedRoute';
import MyBibliographies from './components/MyBibliographies';
import About from './components/About';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview"
          element={
            <ProtectedRoute>
              <Preview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bibliographies"
          element={
            <ProtectedRoute>
              <MyBibliographies />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;