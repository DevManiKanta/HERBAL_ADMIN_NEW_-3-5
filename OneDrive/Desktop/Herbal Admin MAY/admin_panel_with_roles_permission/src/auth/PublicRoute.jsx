// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// export default function PublicRoute({ children }) {
//   const { isAuthenticated } = useAuth();

//   return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
// }

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import HerbalPageLoader from "../components/ui/HerbalPageLoader";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <HerbalPageLoader fullScreen message="Loading…" />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}
