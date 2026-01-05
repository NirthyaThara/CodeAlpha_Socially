import React from 'react';
import { X } from 'lucide-react';
import { BASE_URL } from '../api';

const PostDetailModal = ({ post, onClose }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', zIndex: 4000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            padding: '20px'
        }} onClick={onClose}>
            <div className="socially-card" style={{
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto',
                background: 'white',
                padding: '20px',
                position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontWeight: '700' }}>Post Details</h3>
                    <X size={24} style={{ cursor: 'pointer', color: 'var(--socially-gray)' }} onClick={onClose} />
                </div>

                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                    <img
                        src={post.user?.profilePicture ? `${BASE_URL}${post.user.profilePicture}` : "https://via.placeholder.com/50"}
                        alt="user"
                        style={{ width: '50px', height: '50px', borderRadius: '15px', objectFit: 'cover' }}
                    />
                    <div>
                        <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{post.user?.username}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--socially-gray)' }}>
                            {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Post Content */}
                <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--socially-dark)' }}>
                        {post.content}
                    </p>
                </div>

                {/* Post Media */}
                {post.media && (
                    <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '15px' }}>
                        {post.mediaType === 'image' ? (
                            <img src={`${BASE_URL}${post.media}`} alt="post" style={{ width: '100%', objectFit: 'cover' }} />
                        ) : (
                            <video src={`${BASE_URL}${post.media}`} controls style={{ width: '100%' }} />
                        )}
                    </div>
                )}

                {/* Post Stats */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid #f0f0f0',
                    fontSize: '0.9rem',
                    color: 'var(--socially-gray)'
                }}>
                    <span><strong>{post.likes?.length || 0}</strong> likes</span>
                    <span><strong>{post.shares || 0}</strong> shares</span>
                    <span><strong>{post.comments?.length || 0}</strong> comments</span>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
