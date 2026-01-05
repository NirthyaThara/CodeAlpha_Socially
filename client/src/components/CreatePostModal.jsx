import React, { useState } from 'react';
import { postAPI } from '../api';
import { X, Image as ImageIcon, Video } from 'lucide-react';

const CreatePostModal = ({ user, onClose, onSuccess }) => {
    const [newPost, setNewPost] = useState('');
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !media) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('content', newPost);
        if (media) formData.append('media', media);

        try {
            await postAPI.create(formData);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="socially-card" style={{ width: '100%', maxWidth: '450px', position: 'relative', background: 'white' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--socially-gray)' }}
                >
                    <X size={24} />
                </button>
                <h3 style={{ marginBottom: '25px', fontSize: '1.4rem', fontWeight: '800' }}>Create Post</h3>

                <textarea
                    className="socially-input"
                    placeholder="What's happening?"
                    rows="5"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    style={{ marginBottom: '20px', resize: 'none', fontSize: '1.1rem' }}
                />

                {media && (
                    <div style={{ marginBottom: '15px', padding: '10px', background: 'var(--socially-mint)', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{media.name}</span>
                        <X size={16} style={{ cursor: 'pointer' }} onClick={() => setMedia(null)} />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <label style={{ cursor: 'pointer', color: 'var(--socially-teal)' }}>
                            <ImageIcon size={28} />
                            <input type="file" accept="image/*" onChange={(e) => setMedia(e.target.files[0])} style={{ display: 'none' }} />
                        </label>
                        <label style={{ cursor: 'pointer', color: 'var(--socially-teal)' }}>
                            <Video size={28} />
                            <input type="file" accept="video/*" onChange={(e) => setMedia(e.target.files[0])} style={{ display: 'none' }} />
                        </label>
                    </div>
                    <button
                        onClick={handleCreatePost}
                        disabled={loading}
                        className="socially-btn"
                        style={{ background: 'var(--socially-teal)', padding: '12px 30px', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
