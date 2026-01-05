import React, { useState } from 'react';
import { X } from 'lucide-react';
import { authAPI } from '../api';

const EditProfileModal = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: user.username || '',
        bio: user.bio || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.updateProfile(formData);
            onSuccess(data);
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="socially-card" style={{ width: '90%', maxWidth: '400px', background: 'white', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none' }}>
                    <X size={24} color="#666" />
                </button>

                <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Edit Profile</h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="socially-input"
                            style={{ width: '100%' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="socially-input"
                            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="socially-btn"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
