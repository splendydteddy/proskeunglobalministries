import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SermonsPage from './pages/SermonsPage';
import Login from './pages/Login';
import UploadPortal from './pages/UploadPortal';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Your main public website homepage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dedicated public page to view/download sermons (Optional: can also be embedded in HomePage) */}
        <Route path="/sermons" element={<SermonsPage />} />
        
        {/* Secure pastor login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected audio upload dashboard for authenticated pastors */}
        <Route path="/admin/upload" element={<UploadPortal />} />
      </Routes>
    </Router>
  );
}

export default App;