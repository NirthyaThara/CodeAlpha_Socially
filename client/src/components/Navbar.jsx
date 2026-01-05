import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Plus, Search, UserCircle } from 'lucide-react';

const Navbar = ({ onAddPost, user }) => {
    // Fallback for user id if not immediately available
    const userId = user?.id || user?._id;

    return (
        <div className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} /> <span>Home</span>
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Search size={24} /> <span>Explore</span>
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <MessageCircle size={24} /> <span>Messages</span>
            </NavLink>
            <NavLink to={`/profile/${userId}`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <UserCircle size={24} /> <span>Profile</span>
            </NavLink>

            <div className="fab-add" onClick={onAddPost} style={{ cursor: 'pointer' }}>
                <Plus size={28} />
            </div>
        </div>
    );
};

export default Navbar;
