import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import {Navigate, useLocation } from 'react-router-dom';

const RiderRoute = ({children}) => {
 const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <p>Loading......</p>;
  }

  if (!user || role !== "rider") {
    return (
      <Navigate
        to="/forbidden"
        replace
        state={{ from: location.pathname }}
      />
    );
  }
   return children;
};

export default RiderRoute;