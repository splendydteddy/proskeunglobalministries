import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SermonsPage from './pages/SermonsPage';
import Login from './pages/Login';
import UploadPortal from './pages/UploadPortal';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages" element={<SermonsPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/upload"
          element={
            <ProtectedRoute>
              <UploadPortal />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
