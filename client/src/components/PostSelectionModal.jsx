import React, { useState, useEffect } from 'react';
import { postAPI, BASE_URL } from '../api';
import { X, Image as ImageIcon } from 'lucide-react';

const PostSelectionModal = ({ user, onClose, onSelectPost }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            const { data } = await postAPI.getAll();
            // Filter posts by current user
            const myPosts = data.filter(p => p.user?._id === (user.id || user._id));
            setPosts(myPosts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="socially-card" style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '20px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontWeight: '700' }}>Select a post to share</h3>
                    <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        <p style={{ textAlign: 'center' }}>Loading your posts...</p>
                    ) : posts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--socially-gray)' }}>You haven't posted anything yet.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                            {posts.map(post => (
                                <div
                                    key={post._id}
                                    onClick={() => onSelectPost(post)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '1px solid #f0f0f0',
                                        position: 'relative',
                                        aspectRatio: '1/1',
                                        background: '#f9f9f9'
                                    }}
                                >
                                    {post.media ? (
                                        post.mediaType === 'image' ? (
                                            <img src={`${BASE_URL}${post.media}`} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                                                <ImageIcon size={30} color="white" />
                                            </div>
                                        )
                                    ) : (
                                        <div style={{ padding: '10px', fontSize: '0.8rem', height: '100%', overflow: 'hidden' }}>
                                            {post.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostSelectionModal;
