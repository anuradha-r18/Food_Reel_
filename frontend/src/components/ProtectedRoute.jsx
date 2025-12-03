import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ role, children }) => {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const ROLE_CONFIG = {
    user: { cookie: "userToken", redirect: "/user/login" },
    partner: { cookie: "partnerToken", redirect: "/food-partner/login" },
  };

  const { cookie, redirect } = ROLE_CONFIG[role] || {};

  useEffect(() => {
    const token = Cookies.get(cookie);
    console.log(`[ProtectedRoute] role=${role}, cookieName=${cookie}, token=`, token);

    if (!token) {
      console.warn(`[ProtectedRoute] No token — redirecting to ${redirect}`);
      navigate(redirect, { state: { from: location.pathname }, replace: true });
    } else {
      setIsReady(true);
    }
  }, [cookie, navigate, redirect, role, location.pathname]);

  if (!isReady) return null;

  return children;
};

export default ProtectedRoute;
