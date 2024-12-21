import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const logout = () => {
  localStorage.removeItem('token'); // Clear the token
  window.location.href = '/admin/login'; // Redirect to the login page
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token); // Decode the token
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decodedToken.role != "Admin") {
      // Logged in user not an admin
      logout(); // Log the user out
      return false;
    }
    if (decodedToken.exp < currentTime) {
      // Token has expired
      logout(); // Log the user out
      return false;
    }

    return true; // Token is valid
  } catch (error) {
    console.error('Error decoding token:', error);
    logout(); // Log out if there's an issue with the token
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
