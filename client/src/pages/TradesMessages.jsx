import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getReceivedMessages, markMessageAsRead, deleteContactMessage } from '../api';
import Navbar from '../components/Navbar';
import './TradesMessages.css';

function TradesMessages() {
  const { currentUser, userRole } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getReceivedMessages();
      setMessages(data);
    } catch (err) {
      console.error('Load messages error:', err);
      setError(err.response?.data?.error || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      
      // Update local state
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (err) {
      console.error('Mark as read error:', err);
      alert('Failed to mark message as read');
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await deleteContactMessage(messageId);
      
      // Remove from local state
      setMessages(messages.filter(msg => msg._id !== messageId));
    } catch (err) {
      console.error('Delete message error:', err);
      alert('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today at ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays === 1) {
      return 'Yesterday at ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays < 7) {
      return diffDays + ' days ago';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  // Filter messages
  const filteredMessages = filterUnread 
    ? messages.filter(msg => !msg.isRead)
    : messages;

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (userRole !== 'tradesperson') {
    return (
      <div className="trades-messages-page">
        <Navbar />
        <div className="trades-messages-container">
          <div className="access-denied">
            <h1>Access Denied</h1>
            <p>Only tradespeople can access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trades-messages-page">
      <Navbar />
      
      <div className="trades-messages-container">
        <div className="messages-header">
          <div className="header-content">
            <h1>Your Messages</h1>
            <p>Messages from potential customers</p>
          </div>
          {unreadCount > 0 && (
            <div className="unread-badge">{unreadCount} unread</div>
          )}
        </div>

        <div className="messages-controls">
          <button
            className={`filter-btn ${!filterUnread ? 'active' : ''}`}
            onClick={() => setFilterUnread(false)}
          >
            All Messages ({messages.length})
          </button>
          <button
            className={`filter-btn ${filterUnread ? 'active' : ''}`}
            onClick={() => setFilterUnread(true)}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="messages-content">
          {loading ? (
            <div className="messages-loading">
              <div className="spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : error ? (
            <div className="messages-error">
              <p>{error}</p>
              <button onClick={loadMessages} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="messages-empty">
              <h2>📭</h2>
              <p>{filterUnread ? 'No unread messages' : 'No messages yet'}</p>
              <p className="empty-subtitle">
                {filterUnread 
                  ? 'All caught up! Check back later for new inquiries.'
                  : 'When customers contact you, their messages will appear here.'}
              </p>
            </div>
          ) : (
            <div className="messages-list">
              {filteredMessages.map((msg) => (
                <div 
                  key={msg._id} 
                  className={`message-card ${!msg.isRead ? 'unread' : ''}`}
                >
                  <div className="message-header">
                    <div className="sender-info">
                      <h3>{msg.senderName}</h3>
                      <span className="message-date">{formatDate(msg.createdAt)}</span>
                    </div>
                    {!msg.isRead && (
                      <span className="new-badge">New</span>
                    )}
                  </div>

                  <div className="message-body">
                    <p className="message-text">{msg.message}</p>
                  </div>

                  <div className="message-contact">
                    <div className="contact-info">
                      <div className="contact-item">
                        <strong>Email:</strong> 
                        <a href={`mailto:${msg.senderEmail}`}>{msg.senderEmail}</a>
                      </div>
                      {msg.senderPhone && (
                        <div className="contact-item">
                          <strong>Phone:</strong> 
                          <a href={`tel:${msg.senderPhone}`}>{msg.senderPhone}</a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="message-actions">
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(msg._id)}
                        className="btn btn-secondary btn-small"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="btn btn-delete btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradesMessages;
