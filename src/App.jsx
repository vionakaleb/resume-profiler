import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import PublicProfilePage from "./pages/PublicProfilePage.jsx";

const RESERVED = new Set([
  "login",
  "register",
  "logout",
  "api",
  "admin",
  "settings",
  "auth",
  "resumes",
  "ml",
  "health",
  "_next",
  "assets",
  "static",
]);

function UsernameRoute() {
  const { username } = useParams();
  if (!username || RESERVED.has(username.toLowerCase())) {
    return <Navigate to="/" replace />;
  }
  return <PublicProfilePage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/:username" element={<UsernameRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
