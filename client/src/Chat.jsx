import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { BASE_URL } from './api';
import { ArrowLeft, Send, UserCircle } from 'lucide-react';
import PostDetailModal from './components/PostDetailModal';

const Chat = ({ currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiver, setReceiver] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        fetchChatData();
        const interval = setInterval(fetchMessages, 3000); // Simple polling for messages
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChatData = async () => {
        try {
            const { data } = await API.get(`/auth/${id}`);
            setReceiver(data.user);
            fetchMessages();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async () => {
        try {
            const { data } = await API.get(`/messages/${id}`);
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await API.post('/messages', { receiverId: id, content: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="chat-container">
            {/* Chat Header */}
            <div style={{
                padding: '20px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                zIndex: 10
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ width: '45px', height: '45px', borderRadius: '15px', overflow: 'hidden' }}>
                    {receiver?.profilePicture ? (
                        <img src={`${BASE_URL}${receiver.profilePicture}`} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <UserCircle size={45} color="var(--socially-teal)" />
                    )}
                </div>
                <div>
                    <h4 style={{ fontWeight: '700' }}>{receiver?.username}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--socially-teal)' }}>Online</p>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map((msg, index) => {
                    const isMine = String(msg.sender) === String(currentUser?._id || currentUser?.id);
                    return (
                        <div key={msg._id} style={{
                            alignSelf: isMine ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            padding: msg.sharedPost ? '10px' : '12px 18px',
                            borderRadius: isMine ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                            background: isMine ? 'var(--socially-dark)' : 'white',
                            color: isMine ? 'white' : 'var(--socially-dark)',
                            boxShadow: 'var(--socially-soft-shadow)',
                            fontSize: '0.95rem',
                            lineHeight: '1.4'
                        }}>
                            {msg.sharedPost ? (
                                <div
                                    onClick={() => setSelectedPost(msg.sharedPost)}
                                    style={{
                                        background: isMine ? 'rgba(255,255,255,0.1)' : '#f8f8f8',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        border: isMine ? '1px solid rgba(255,255,255,0.2)' : '1px solid #eee',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'var(--socially-soft-shadow)';
                                    }}
                                >
                                    {/* User Info */}
                                    <div style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: isMine ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee' }}>
                                        <img
                                            src={msg.sharedPost.user?.profilePicture ? `${BASE_URL}${msg.sharedPost.user.profilePicture}` : "https://via.placeholder.com/24"}
                                            alt="user"
                                            style={{ width: '24px', height: '24px', borderRadius: '8px' }}
                                        />
                                        <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>{msg.sharedPost.user?.username}</span>
                                    </div>

                                    {/* Post Media Preview */}
                                    {msg.sharedPost.media && (
                                        <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                                            {msg.sharedPost.mediaType === 'image' ? (
                                                <img src={`${BASE_URL}${msg.sharedPost.media}`} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: 'white', fontSize: '0.8rem' }}>Video Post</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Post Content */}
                                    <div style={{ padding: '10px', fontSize: '0.85rem' }}>
                                        <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {msg.sharedPost.content}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                msg.content
                            )}
                            <div style={{ fontSize: '0.65rem', marginTop: '5px', textAlign: 'right', opacity: 0.7 }}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '20px', background: 'transparent' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        className="socially-input"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{ background: 'white', borderRadius: '25px', padding: '15px 25px' }}
                    />
                    <button type="submit" style={{
                        width: '55px',
                        height: '55px',
                        borderRadius: '20px',
                        background: 'var(--socially-dark)',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Send size={24} />
                    </button>
                </div>
            </form>

            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </div>
    );
};

export default Chat;
