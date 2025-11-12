import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


// PrivateRoute component to protect routes that require authentication
export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Loading state while checking auth
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children;
}
