import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/ui/Skeleton';
import { needsProfileSetup } from '../utils/profile';

export default function ProtectedRoute() {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const onCompleteProfile = location.pathname === '/app/complete-profile';
  if (needsProfileSetup(user) && !onCompleteProfile) {
    return <Navigate to="/app/complete-profile" replace />;
  }

  return <Outlet />;
}
