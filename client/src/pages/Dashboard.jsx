import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Hello, {currentUser?.displayName || currentUser?.email}!</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-placeholder">
            <h2>Dashboard Coming Soon</h2>
            <p>TODO: Add profile cards of tradespeople for users to explore</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
