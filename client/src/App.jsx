import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Feed from './Feed';
import Navbar from './components/Navbar';
import UsersList from './components/UsersList';
import UserProfile from './UserProfile';
import MessagesList from './MessagesList';
import Chat from './Chat';
import CreatePostModal from './components/CreatePostModal';
import './index.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showPostModal, setShowPostModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {!user ? (
          <Routes>
            <Route path="/auth" element={<Auth onAuthSuccess={(userData) => setUser(userData)} />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        ) : (
          <div className="app-layout">
            {/* Left Sidebar (Navigation) */}
            <Navbar onAddPost={() => setShowPostModal(true)} user={user} />

            {/* Main Feed Area */}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Feed user={user} />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/profile/:id" element={<UserProfile currentUser={user} onUpdateUser={setUser} onLogout={handleLogout} />} />
                <Route path="/messages" element={<MessagesList />} />
                <Route path="/chat/:id" element={<Chat currentUser={user} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>

            {/* Right Sidebar (Suggestions - Desktop Only) */}
            <div className="right-sidebar">
              <div className="socially-card" style={{ padding: '25px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Suggested for you</h3>
                <div style={{ color: 'var(--socially-gray)', fontSize: '0.9rem' }}>
                  <p style={{ marginBottom: '10px' }}>Connect with more people to see their posts here!</p>
                </div>
                <button className="socially-btn" disabled style={{ width: '100%', marginTop: '10px', opacity: 0.6, cursor: 'not-allowed' }}>
                  Find People
                </button>
              </div>

              <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#aaa', padding: '0 10px' }}>
                © 2026 Socially by DeepMind
              </div>
            </div>

            {showPostModal && (
              <CreatePostModal
                user={user}
                onClose={() => setShowPostModal(false)}
                onSuccess={() => {
                  setShowPostModal(false);
                  // Refresh feed if needed (via event or simple page reload for now)
                  window.location.reload();
                }}
              />
            )}
          </div>
        )}
      </div>
    </Router >
  );
}

export default App;
