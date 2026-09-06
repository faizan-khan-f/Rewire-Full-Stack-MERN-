import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for auth state to be resolved before making redirect decisions
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // If there is no user logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
