import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { BASE_URL } from './api';
import { Search, UserCircle, MessageSquare } from 'lucide-react';
import Header from './components/Header';

const MessagesList = () => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const { data } = await API.get('/messages/users');
            setChats(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Header />
            <div style={{ padding: '0 20px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', fontWeight: '800' }}>Messages</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {chats.length > 0 ? chats.map(chat => (
                        <Link key={chat._id} to={`/chat/${chat._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                                    {chat.profilePicture ? (
                                        <img src={`${BASE_URL}${chat.profilePicture}`} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <UserCircle size={55} color="var(--socially-teal)" />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{chat.username}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--socially-gray)' }}>Tap to open conversation</p>
                                </div>
                                <MessageSquare size={20} color="var(--socially-teal)" />
                            </div>
                        </Link>
                    )) : (
                        <div className="socially-card" style={{ textAlign: 'center', padding: '40px', background: 'white' }}>
                            <p style={{ color: 'var(--socially-gray)' }}>You can only message mutual followers. Follow someone and let them follow you back!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesList;
