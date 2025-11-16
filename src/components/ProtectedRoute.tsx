import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../zustand/useAuthStore';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to='/' replace />;
  }

  return children;
};
