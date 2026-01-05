import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { postAPI, authAPI, BASE_URL } from './api';
import { UserCircle, MapPin, Calendar, Mail, Camera, Settings, Grid, Bookmark as BookmarkIcon, LogOut } from 'lucide-react';
import PostCard from './components/PostCard';
import EditProfileModal from './components/EditProfileModal';

const UserProfile = ({ currentUser, onUpdateUser, onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'saved'
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isOwnProfile = currentUser && (currentUser.id === id || currentUser._id === id);

    useEffect(() => {
        fetchProfile();
        // Reset tab when profile changes
        setActiveTab('posts');
    }, [id, currentUser]);

    // Fetch saved posts when tab changes to 'saved'
    useEffect(() => {
        if (activeTab === 'saved' && isOwnProfile) {
            fetchSavedPosts();
        }
    }, [activeTab, isOwnProfile]);

    const fetchProfile = async () => {
        try {
            const { data } = await API.get(`/auth/${id}`);
            setProfile(data.user);
            setPosts(data.posts);
            const currentUserId = currentUser.id || currentUser._id;
            setIsFollowing(data.user.followers.some(f => (f._id || f).toString() === currentUserId));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSavedPosts = async () => {
        try {
            const { data } = await postAPI.getSavedPosts();
            setSavedPosts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await API.post(`/auth/unfollow/${id}`);
            } else {
                await API.post(`/auth/follow/${id}`);
            }
            fetchProfile();
            // Also update the current user in local storage/parent state
            const currentUserId = currentUser.id || currentUser._id;
            const userRes = await API.get(`/auth/${currentUserId}`);
            const updatedUser = { ...userRes.data.user, id: userRes.data.user._id };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            onUpdateUser(updatedUser);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDPUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('media', file);
        try {
            const { data } = await authAPI.updateDP(formData);
            setProfile(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            onUpdateUser(data.user);
        } catch (err) {
            console.error(err);
        }
    };

    if (!profile) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    const postsToDisplay = activeTab === 'saved' ? savedPosts : posts;

    return (
        <div style={{ paddingBottom: '100px', background: 'white', minHeight: '100vh' }}>
            {/* Header / Cover */}
            <div style={{ position: 'relative', height: '180px', background: 'var(--socially-mint)', borderRadius: '0 0 40px 40px' }}>
                <div style={{ position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '35px',
                            border: '5px solid white',
                            overflow: 'hidden',
                            background: '#f0f0f0',
                            boxShadow: 'var(--socially-soft-shadow)'
                        }}>
                            {profile.profilePicture ? (
                                <img src={`${BASE_URL}${profile.profilePicture}`} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <UserCircle size={100} color="var(--socially-teal)" />
                            )}
                        </div>
                        {isOwnProfile && (
                            <label style={{
                                position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--socially-dark)', color: 'white',
                                padding: '8px', borderRadius: '15px', cursor: 'pointer', display: 'flex'
                            }}>
                                <Camera size={16} />
                                <input type="file" accept="image/*" onChange={handleDPUpload} style={{ display: 'none' }} />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div style={{ marginTop: '60px', textAlign: 'center', padding: '0 20px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>{profile.username}</h2>
                <p style={{ color: 'var(--socially-gray)', fontSize: '0.9rem', marginBottom: '20px' }}>@{profile.username.toLowerCase()}</p>

                {/* Stats */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '25px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: '800', fontSize: '1.2rem' }}>{posts.length}</p>
                        <p style={{ color: 'var(--socially-gray)', fontSize: '0.75rem', fontWeight: '600' }}>Posts</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: '800', fontSize: '1.2rem' }}>{profile.followers?.length || 0}</p>
                        <p style={{ color: 'var(--socially-gray)', fontSize: '0.75rem', fontWeight: '600' }}>Followers</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: '800', fontSize: '1.2rem' }}>{profile.following?.length || 0}</p>
                        <p style={{ color: 'var(--socially-gray)', fontSize: '0.75rem', fontWeight: '600' }}>Following</p>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                    {!isOwnProfile ? (
                        <>
                            <button
                                onClick={handleFollow}
                                className="socially-btn"
                                style={{ background: isFollowing ? 'white' : 'var(--socially-dark)', color: isFollowing ? 'var(--socially-dark)' : 'white', border: isFollowing ? '1px solid #ddd' : 'none', flex: 1, maxWidth: '150px' }}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                            <button
                                onClick={() => navigate(`/chat/${id}`)}
                                className="socially-btn-outline"
                                style={{ flex: 1, maxWidth: '150px' }}
                            >
                                Message
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '300px' }}>
                            <button
                                className="socially-btn"
                                style={{ background: 'var(--socially-dark)', flex: 1 }}
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={onLogout}
                                className="socially-btn-outline"
                                style={{ border: '2px solid #ff4b4b', color: '#ff4b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* About / Bio */}
                <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '10px' }}>About</h3>
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {profile.bio || "No bio yet. Tell the world something about yourself!"}
                    </p>
                </div>
            </div>

            {/* Post Feed Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', padding: '0 20px', marginBottom: '20px' }}>
                <div
                    onClick={() => setActiveTab('posts')}
                    style={{
                        padding: '10px 20px',
                        borderBottom: activeTab === 'posts' ? '3px solid var(--socially-teal)' : 'none',
                        color: activeTab === 'posts' ? 'var(--socially-dark)' : 'var(--socially-gray)',
                        fontWeight: activeTab === 'posts' ? '700' : '600',
                        fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <Grid size={18} /> My Posts
                </div>
                {isOwnProfile && (
                    <div
                        onClick={() => setActiveTab('saved')}
                        style={{
                            padding: '10px 20px',
                            borderBottom: activeTab === 'saved' ? '3px solid var(--socially-teal)' : 'none',
                            color: activeTab === 'saved' ? 'var(--socially-dark)' : 'var(--socially-gray)',
                            fontWeight: activeTab === 'saved' ? '700' : '600',
                            fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <BookmarkIcon size={18} /> Saved
                    </div>
                )}
            </div>

            {/* User's Posts */}
            <div style={{ padding: '0 20px' }}>
                {postsToDisplay.length > 0 ? (
                    postsToDisplay.map(post => (
                        <PostCard key={post._id} post={post} user={currentUser} onUpdate={() => { fetchProfile(); if (activeTab === 'saved') fetchSavedPosts(); }} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--socially-gray)' }}>
                        {activeTab === 'posts' ? "No posts yet." : "No saved posts yet."}
                    </div>
                )}
            </div>

            {isEditModalOpen && (
                <EditProfileModal
                    user={profile}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={(updatedUser) => {
                        setProfile(updatedUser);
                        setIsEditModalOpen(false);
                        const token = localStorage.getItem('token'); // Preserve token
                        localStorage.setItem('user', JSON.stringify({ ...updatedUser, token })); // Update local storage but keep context
                        onUpdateUser(updatedUser);
                    }}
                />
            )}
        </div>
    );
};

export default UserProfile;
