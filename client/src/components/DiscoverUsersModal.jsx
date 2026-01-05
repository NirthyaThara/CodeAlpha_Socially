import React, { useState, useEffect } from 'react';
import { authAPI, BASE_URL } from '../api';
import { X, Search, UserPlus, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DiscoverUsersModal = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Fetch random users or suggestions initially could be added here
    // For now, we search

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                try {
                    const { data } = await authAPI.searchUsers(query);
                    setUsers(data);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setUsers([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="socially-card" style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '20px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontWeight: '700' }}>Discover People</h3>
                    <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>

                <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--socially-gray)' }} />
                    <input
                        type="text"
                        placeholder="Search for friends..."
                        className="socially-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                        autoFocus
                    />
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {users.length === 0 && query && (
                        <p style={{ textAlign: 'center', color: 'var(--socially-gray)' }}>No users found.</p>
                    )}
                    {users.length === 0 && !query && (
                        <p style={{ textAlign: 'center', color: 'var(--socially-gray)' }}>Type to search...</p>
                    )}

                    {users.map(user => (
                        <div key={user._id}
                            onClick={() => { navigate(`/profile/${user._id}`); onClose(); }}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img
                                    src={user.profilePicture ? `${BASE_URL}${user.profilePicture}` : "https://via.placeholder.com/40"}
                                    alt={user.username}
                                    style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
                                />
                                <div>
                                    <span style={{ fontWeight: '600', display: 'block' }}>{user.username}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--socially-gray)' }}>View Profile</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscoverUsersModal;
