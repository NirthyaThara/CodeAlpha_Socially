import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, messageAPI, BASE_URL } from './api';
import { Plus, Image as ImageIcon, Video, X, Share2 } from 'lucide-react';
import Header from './components/Header';
import PostCard from './components/PostCard';
import DiscoverUsersModal from './components/DiscoverUsersModal';
import PostSelectionModal from './components/PostSelectionModal';
import ShareModal from './components/ShareModal';

const Feed = ({ user }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showDiscoverModal, setShowDiscoverModal] = useState(false);
    const [newPost, setNewPost] = useState('');
    const [media, setMedia] = useState(null);
    const [showPostSelection, setShowPostSelection] = useState(false);
    const [selectedPostForShare, setSelectedPostForShare] = useState(null);

    useEffect(() => {
        fetchPosts();
        fetchUsers();
    }, []);

    const fetchPosts = async () => {
        const { data } = await postAPI.getAll();
        setPosts(data);
    };

    const fetchUsers = async () => {
        try {
            const { data } = await messageAPI.getChatList();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', newPost);
        if (media) formData.append('media', media);

        try {
            await postAPI.create(formData);
            setNewPost('');
            setMedia(null);
            setShowPostModal(false);
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Header onSearch={(q) => navigate(`/users?q=${q}`)} />

            {/* Stories Section */}
            <div className="stories-container">
                <div className="story-bubble add-story" onClick={() => setShowDiscoverModal(true)}>
                    <div className="story-img-container">
                        <Plus size={24} color="var(--socially-teal)" />
                    </div>
                    <span>Add</span>
                </div>
                {/* <div className="story-bubble add-story" onClick={() => setShowPostSelection(true)} style={{ marginLeft: '10px' }}>
                    <div className="story-img-container" style={{ borderColor: 'var(--socially-pink)' }}>
                        <Share2 size={24} color="var(--socially-pink)" />
                    </div>
                    <span>Share</span>
                </div> */}
                {users.map(u => (
                    <div key={u._id} className="story-circle">
                        <img src={u.profilePicture ? `${BASE_URL}${u.profilePicture}` : "https://via.placeholder.com/60"} alt={u.username} />
                    </div>
                ))}
            </div>

            {showPostModal && (
                <CreatePostModal
                    user={user}
                    onClose={() => setShowPostModal(false)}
                    onPostCreated={fetchPosts}
                />
            )}

            {showDiscoverModal && (
                <DiscoverUsersModal onClose={() => setShowDiscoverModal(false)} />
            )}

            {showPostSelection && (
                <PostSelectionModal
                    user={user}
                    onClose={() => setShowPostSelection(false)}
                    onSelectPost={(post) => {
                        setSelectedPostForShare(post);
                        setShowPostSelection(false);
                    }}
                />
            )}

            {selectedPostForShare && (
                <ShareModal
                    post={selectedPostForShare}
                    onClose={() => setSelectedPostForShare(null)}
                />
            )}

            {/* Feed Posts */}
            <div style={{ padding: '0 20px' }}>
                {posts.map(post => (
                    <PostCard key={post._id} post={post} user={user} onUpdate={fetchPosts} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
