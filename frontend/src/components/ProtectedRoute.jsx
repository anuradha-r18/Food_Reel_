import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      console.warn('[ProtectedRoute] No token — redirecting to /user/login');
      navigate('/user/login', { state: { from: location.pathname }, replace: true });
    }
  }, [token, navigate, location.pathname]);

  if (!token) {
    // Avoid flashing the protected page before redirect
    return null;
  }

  return children;
};

export default ProtectedRoute;
