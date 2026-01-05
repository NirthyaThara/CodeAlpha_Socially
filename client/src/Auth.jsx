import React, { useState } from 'react';
import { authAPI } from './api';
import { ArrowRight, Mail, Lock, User as UserIcon } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = isLogin
                ? await authAPI.login({ email: formData.email, password: formData.password })
                : await authAPI.register(formData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onAuthSuccess(data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            background: 'var(--socially-gradient)'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--socially-teal)',
                    borderRadius: '25px',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 20px rgba(120, 213, 215, 0.4)'
                }}>S</div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Socially</h1>
                <p style={{ color: 'var(--socially-gray)', fontSize: '1.1rem' }}>Connect with the world</p>
            </div>

            <div className="socially-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.5rem' }}>
                    {isLogin ? 'Welcome Back!' : 'Join Socially'}
                </h2>

                {error && <p style={{ color: '#ff4b4b', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <UserIcon size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--socially-gray)' }} />
                            <input
                                type="text"
                                className="socially-input"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                style={{ paddingLeft: '45px' }}
                                required
                            />
                        </div>
                    )}
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--socially-gray)' }} />
                        <input
                            type="email"
                            className="socially-input"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ paddingLeft: '45px' }}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--socially-gray)' }} />
                        <input
                            type="password"
                            className="socially-input"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ paddingLeft: '45px' }}
                            required
                        />
                    </div>

                    <button type="submit" className="socially-btn" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: 'var(--socially-teal)',
                        padding: '15px'
                    }}>
                        {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--socially-gray)' }}>
                    {isLogin ? "New to Socially? " : "Already a member? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--socially-teal)', cursor: 'pointer', fontWeight: '700' }}
                    >
                        {isLogin ? 'Create Account' : 'Sign In'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
