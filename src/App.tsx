import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { QuizList } from './components/Quiz/QuizList';
import { QuizPlayer } from './components/Quiz/QuizPlayer';
import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth Route wrapper (redirects to home if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <div className="auth-page">
                  <Login />
                  <p className="auth-switch">
                    Don't have an account? <a href="/signup">Sign up</a>
                  </p>
                </div>
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <div className="auth-page">
                  <Signup />
                  <p className="auth-switch">
                    Already have an account? <a href="/login">Login</a>
                  </p>
                </div>
              </AuthRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizPlayer />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
