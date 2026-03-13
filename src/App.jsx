import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreateThreadPage from './pages/CreateThreadPage';
import NotFoundPage from './pages/NotFoundPage';
import { initAuth } from './store/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  if (!initialized) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route
          path="/new-thread"
          element={
            <ProtectedRoute>
              <CreateThreadPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
