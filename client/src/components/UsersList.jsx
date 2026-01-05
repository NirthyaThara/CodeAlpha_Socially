import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API, { BASE_URL } from '../api';
import { UserCircle, Search, UserPlus } from 'lucide-react';
import Header from './Header';

const UsersList = () => {
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('q') || '');

    useEffect(() => {
        if (searchQuery) {
            searchUsers();
        } else {
            fetchUsers();
        }
    }, [searchQuery]);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/auth');
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const searchUsers = async () => {
        try {
            const { data } = await API.get(`/auth/search?q=${searchQuery}`);
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Header onSearch={setSearchQuery} />

            <div style={{ padding: '0 20px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', fontWeight: '800' }}>Explore</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {users.map(user => (
                        <Link key={user._id} to={`/profile/${user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="socially-card" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '15px 20px',
                                background: 'white'
                            }}>
                                <div style={{
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: '#f0f0f0'
                                }}>
                                    {user.profilePicture ? (
                                        <img src={`${BASE_URL}${user.profilePicture}`} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <UserCircle size={55} color="var(--socially-teal)" />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{user.username}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--socially-gray)' }}>{user.followers?.length || 0} followers</p>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'var(--socially-mint)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--socially-teal)'
                                }}>
                                    <UserPlus size={18} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersList;
