import { useLocation, Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // DEVELOPMENT MODE: Bypass authentication for local testing
  // Remove this in production!
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Auto-create a mock token for development
    if (!localStorage.getItem("token")) {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldmVsb3BlciIsImV4cCI6OTk5OTk5OTk5OX0.mock";
      localStorage.setItem("token", mockToken);
    }
    return children;
  }

  const token = localStorage.getItem("token");
  const location = useLocation();

  // Check if token exists and is not expired
  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      return true;
    }
  };

  if (!token || isTokenExpired()) {
    // Clear localStorage if token is expired
    localStorage.clear();
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
