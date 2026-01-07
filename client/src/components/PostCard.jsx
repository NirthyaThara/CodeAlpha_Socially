import React, { useState } from 'react';
import { Heart, Share2, MessageCircle, Bookmark, UserCircle, MoreVertical, Trash2, Edit2, X, Check } from 'lucide-react';
import { BASE_URL, postAPI } from '../api';
import CommentSection from './CommentSection';

import ShareModal from './ShareModal';

const PostCard = ({ post, user, onUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [showMenu, setShowMenu] = useState(false);

    // Debugging ownership
    // console.log("Current User:", user?._id || user?.id, "Post User:", post.user?._id);

    const currentUserId = user?._id || user?.id;
    const postUserId = post.user?._id;
    const isOwner = currentUserId && postUserId && String(currentUserId) === String(postUserId);

    const handleAction = async (action) => {
        try {
            await postAPI[action](post._id);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await postAPI.delete(post._id);
                if (onUpdate) onUpdate();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            await postAPI.update(post._id, editContent); // Pass content string directly
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="socially-card" style={{ marginBottom: '25px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    background: '#f0f0f0'
                }}>
                    {post.user?.profilePicture ? (
                        <img
                            src={`${BASE_URL}${post.user.profilePicture}`}
                            alt="DP"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <UserCircle size={45} color="var(--socially-teal)" />
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{post.user?.username}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--socially-gray)' }}>{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {isOwner && (
                    <div style={{ position: 'relative' }}>
                        <MoreVertical size={20} style={{ cursor: 'pointer', color: 'var(--socially-gray)' }} onClick={() => setShowMenu(!showMenu)} />
                        {showMenu && (
                            <div style={{
                                position: 'absolute', right: 0, top: '25px', background: 'white',
                                boxShadow: 'var(--socially-shadow)', borderRadius: '10px',
                                overflow: 'hidden', zIndex: 10, minWidth: '120px'
                            }}>
                                <div
                                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                    style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', hover: { background: '#f0f0f0' } }}
                                >
                                    <Edit2 size={16} /> Edit
                                </div>
                                <div
                                    onClick={() => { handleDelete(); setShowMenu(false); }}
                                    style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#ff4b4b', fontSize: '0.9rem' }}
                                >
                                    <Trash2 size={16} /> Delete
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div style={{ marginBottom: '15px' }}>
                    <textarea
                        value={editContent} onChange={(e) => setEditContent(e.target.value)}
                        className="socially-input" rows={3} style={{ marginBottom: '10px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setIsEditing(false)} className="socially-btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }}><X size={16} /> Cancel</button>
                        <button onClick={handleUpdate} className="socially-btn" style={{ padding: '5px 15px', fontSize: '0.8rem' }}><Check size={16} /> Save</button>
                    </div>
                </div>
            ) : (
                <p style={{ fontSize: '1.05rem', color: 'var(--socially-dark)', marginBottom: '15px', lineHeight: '1.5' }}>
                    {post.content}
                </p>
            )}

            {post.media && (
                <div style={{
                    marginBottom: '15px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    maxHeight: '400px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    {post.mediaType === 'image' ? (
                        <img src={`${BASE_URL}${post.media}`} alt="Post content" style={{ width: '100%', objectFit: 'cover' }} />
                    ) : (
                        <video src={`${BASE_URL}${post.media}`} controls style={{ width: '100%' }} />
                    )}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #f0f0f0', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '25px' }}>
                    <button
                        onClick={() => handleAction('likePost')}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: post.likes.includes(user.id) ? '#ff4b4b' : 'var(--socially-dark)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                    >
                        <Heart size={22} fill={post.likes.includes(user.id) ? "#ff4b4b" : "none"} /> <span>{post.likes.length > 0 && post.likes.length}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--socially-dark)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                    >
                        <MessageCircle size={22} />
                    </button>
                    <button
                        onClick={() => setShowShareModal(true)}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--socially-dark)', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer', padding: 0 }}
                    >
                        <Share2 size={22} /> <span>{post.shares > 0 && post.shares}</span>
                    </button>
                </div>
                <button
                    onClick={() => handleAction('savePost')}
                    style={{ background: 'none', border: 'none', color: post.saves.includes(user.id) ? 'var(--socially-teal)' : 'var(--socially-dark)', cursor: 'pointer', padding: 0 }}
                >
                    <Bookmark size={22} fill={post.saves.includes(user.id) ? "var(--socially-teal)" : "none"} />
                </button>
            </div>

            {showComments && <CommentSection postId={post._id} user={user} />}

            {showShareModal && (
                <ShareModal
                    post={post}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};

export default PostCard;
