import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

const PrivateRouteProfile = ({ token, requiredRole }) => {
  const [roleStatus, setRoleStatus] = useState('checking');

  useEffect(() => {
    if (!requiredRole) return undefined;
    let active = true;
    const backendUrl = import.meta.env.VITE_BASE_URL || 'https://alumni-website-v7pq.onrender.com';

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        if (active) setRoleStatus('unauthenticated');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/check-email`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${await currentUser.getIdToken()}` },
        });
        const result = await response.json();
        if (active) setRoleStatus(result.role === requiredRole ? 'authorized' : 'denied');
      } catch {
        if (active) setRoleStatus('denied');
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [requiredRole]);

  if (requiredRole) {
    if (roleStatus === 'checking') return null;
    if (roleStatus === 'unauthenticated') return <Navigate to="/Verification" replace />;
    if (roleStatus !== 'authorized') return <Navigate to="/home" replace />;
    return <Outlet />;
  }

  if (!token) return <Navigate to="/Verification" replace />;
  return <Outlet />;
};

PrivateRouteProfile.propTypes = {
    token: PropTypes.bool.isRequired, // Ensure token is a required boolean
    requiredRole: PropTypes.string,
};

export default PrivateRouteProfile;
