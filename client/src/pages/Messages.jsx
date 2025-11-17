import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './Messages.css';

function Messages() {
  const { currentUser } = useAuth();

  return (
    <div className="messages-page">
      <Navbar />
      
      <div className="messages-container">
        <div className="messages-header">
          <h1>Messages</h1>
          <p>Hello, {currentUser?.displayName || currentUser?.email}!</p>
        </div>

        <div className="messages-content">
          <div className="messages-placeholder">
            <h2>TODO: maybe add message if time</h2>
            <p> probably too little time to add this page so this feature wont be added </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
