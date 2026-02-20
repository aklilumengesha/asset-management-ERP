import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        localStorage.setItem('token', session.access_token);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        localStorage.setItem('token', session.access_token);
      } else {
        localStorage.removeItem('token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-t-2 border-r-2 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
