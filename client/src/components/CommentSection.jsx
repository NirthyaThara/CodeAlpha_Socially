import React, { useState, useEffect } from 'react';
import API, { BASE_URL } from '../api';
import { Send } from 'lucide-react';

const CommentSection = ({ postId, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        const { data } = await API.get(`/posts/${postId}/comments`);
        setComments(data);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await API.post(`posts/${postId}/comments`, { postId, content: newComment });
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ marginTop: '15px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
            <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="text"
                    className="socially-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ padding: '10px 15px', borderRadius: '15px', fontSize: '0.9rem' }}
                />
                <button type="submit" style={{ background: 'var(--socially-teal)', color: 'white', border: 'none', borderRadius: '15px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={18} />
                </button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {comments.map(c => (
                    <div key={c._id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <img
                            src={c.user.profilePicture ? `${BASE_URL}${c.user.profilePicture}` : "https://via.placeholder.com/30"}
                            alt="avatar"
                            style={{ width: '30px', height: '30px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div style={{ background: '#F4F9F9', padding: '8px 12px', borderRadius: '12px', flex: 1 }}>
                            <p style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '2px' }}>{c.user.username}</p>
                            <p style={{ fontSize: '0.85rem', color: '#444' }}>{c.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
