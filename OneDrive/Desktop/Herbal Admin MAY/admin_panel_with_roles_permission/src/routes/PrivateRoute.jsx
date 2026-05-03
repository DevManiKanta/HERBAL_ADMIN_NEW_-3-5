// import { Navigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext"; // ⚠️ check path

// export default function PrivateRoute({ children, permission }) {
//   const { isAuthenticated, can, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (permission && !can(permission)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// }


import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import HerbalPageLoader from "../components/ui/HerbalPageLoader";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <HerbalPageLoader fullScreen message="Checking your session…" />;
  }

  // ❌ Only login check here
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ✅ Always allow page render
  return children;
}