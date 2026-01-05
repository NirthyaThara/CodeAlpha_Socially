import React, { useState, useEffect } from 'react';
import { messageAPI, authAPI, postAPI, BASE_URL } from '../api';
import { X, Send } from 'lucide-react';

const ShareModal = ({ post, onClose }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingTo, setSendingTo] = useState(null); // Track which user we're sending to

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await messageAPI.getChatList();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Global search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length >= 1) {
                try {
                    const { data } = await authAPI.searchUsers(searchTerm); // Assuming authAPI.searchUsers exists and takes query
                    // Merge results but prioritize existing chat users if needed, or just show search results
                    setUsers(prev => {
                        const existingIds = new Set(prev.map(u => u._id));
                        const newUsers = data.filter(u => !existingIds.has(u._id));
                        return [...prev, ...newUsers];
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleShare = async (userId) => {
        console.log("DEBUG: Attempting to share post", post._id, "to user", userId);
        setSendingTo(userId);
        try {
            await messageAPI.sendMessage({
                receiverId: userId,
                content: "Shared a post",
                sharedPostId: post._id
            });

            // Also notify the post controller to increment share count
            await postAPI.sharePost(post._id);

            console.log("DEBUG: Share successful for user", userId);
            alert('Sent!');
            onClose();
        } catch (err) {
            console.error("DEBUG: Share failed", err);
            const errorMsg = err.response?.data?.message || 'Failed to send';
            alert(errorMsg);
            setSendingTo(null);
        }
    };

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="socially-card" style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '20px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontWeight: '700' }}>Share to...</h3>
                    <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>

                <input
                    type="text"
                    placeholder="Search people..."
                    className="socially-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '15px' }}
                />

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {filteredUsers.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--socially-gray)' }}>No users found.</p>
                    ) : (
                        filteredUsers.map(user => (
                            <div key={user._id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px', borderBottom: '1px solid #f0f0f0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src={user.profilePicture ? `${BASE_URL}${user.profilePicture}` : "https://via.placeholder.com/40"}
                                        alt={user.username}
                                        style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
                                    />
                                    <span style={{ fontWeight: '600' }}>{user.username}</span>
                                </div>
                                <button
                                    onClick={() => handleShare(user._id)}
                                    className="socially-btn"
                                    disabled={sendingTo !== null}
                                    style={{ padding: '6px 15px', fontSize: '0.8rem' }}
                                >
                                    {sendingTo === user._id ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
