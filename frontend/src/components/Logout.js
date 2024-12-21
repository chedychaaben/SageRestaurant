import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Logout logic
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]); // Dependency array ensures it runs only once

  return null; // No need for a button or any visible UI
};

export default Logout;
