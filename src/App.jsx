import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';
import Welcome from './components/Welcome';
import './App.css';

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Welcome />}></Route> {/* <-- CHANGED */}
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </div>
  );
}
export default App;