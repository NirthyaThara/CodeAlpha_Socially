import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { notificationAPI } from '../api';

const Header = ({ onSearch }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initial fetch for badge
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await notificationAPI.getNotifications();
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="search-header">
            <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--socially-gray)' }} />
                <input
                    type="text"
                    placeholder="Search for people..."
                    className="socially-input"
                    style={{ paddingLeft: '45px', background: 'white' }}
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                />
            </div>
            <div style={{ position: 'relative' }}>
                <div
                    onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications) setUnreadCount(0); // Optimistic clear
                    }}
                    style={{
                        width: '50px',
                        height: '50px',
                        background: 'white',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--socially-soft-shadow)',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                >
                    <Bell size={20} color="var(--socially-dark)" />
                    {unreadCount > 0 && (
                        <div style={{
                            position: 'absolute', top: '12px', right: '12px',
                            width: '8px', height: '8px', background: '#ff4b4b',
                            borderRadius: '50%', border: '2px solid white'
                        }} />
                    )}
                </div>
                {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>
        </div>
    );
};

export default Header;
