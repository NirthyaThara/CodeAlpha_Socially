import React, { useState, useEffect } from 'react';
import { notificationAPI, BASE_URL } from '../api';
import { Heart, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await notificationAPI.getNotifications();
            setNotifications(data);
            await notificationAPI.markRead();
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotificationClick = (n) => {
        if (n.type === 'like' && n.post) {
            // Navigate to post or user profile
            navigate(`/profile/${n.recipient}`); // Ideally link to post, but profile for now
        } else if (n.type === 'follow') {
            navigate(`/profile/${n.sender._id}`);
        }
        onClose();
    };

    return (
        <div style={{
            position: 'absolute', top: '60px', right: '0',
            width: '320px', background: 'white', borderRadius: '20px',
            boxShadow: 'var(--socially-shadow)', zIndex: 1000,
            overflow: 'hidden', border: '1px solid #f0f0f0'
        }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Notifications</h3>
                <X size={18} style={{ cursor: 'pointer', color: 'var(--socially-gray)' }} onClick={onClose} />
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--socially-gray)', fontSize: '0.9rem' }}>
                        No new notifications
                    </div>
                ) : (
                    notifications.map(n => (
                        <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                                padding: '12px 15px', borderBottom: '1px solid #fafafa',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                cursor: 'pointer', background: n.read ? 'white' : '#f0f9fa'
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={n.sender.profilePicture ? `${BASE_URL}${n.sender.profilePicture}` : "https://via.placeholder.com/40"}
                                    alt="User"
                                    style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute', bottom: '-2px', right: '-2px',
                                    background: n.type === 'like' ? '#ff4b4b' : '#3dccc7',
                                    borderRadius: '50%', padding: '3px', display: 'flex'
                                }}>
                                    {n.type === 'like' ? <Heart size={10} color="white" fill="white" /> : <UserPlus size={10} color="white" />}
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--socially-dark)' }}>
                                    <strong>{n.sender.username}</strong>
                                    {n.type === 'like' ? ' liked your post.' : ' started following you.'}
                                </p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--socially-gray)' }}>
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {n.type === 'like' && n.post && n.post.media && (
                                <img
                                    src={`${BASE_URL}${n.post.media}`}
                                    alt="Post"
                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
