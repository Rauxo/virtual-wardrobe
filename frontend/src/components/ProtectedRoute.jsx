import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './Layout/Layout';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/gettingStarted" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;