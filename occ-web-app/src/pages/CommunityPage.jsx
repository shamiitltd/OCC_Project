import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CommunityPage() {
    const { AppState } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('recent');

    // Create post state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAuthor, setNewAuthor] = useState('');
    const [newCategory, setNewCategory] = useState('Study Help');
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        setPosts(AppState.getCommunityPosts());
    }, [AppState]);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        
        const newPostObj = {
            id: 'POST_' + Date.now(),
            author: newAuthor,
            authorInitials: newAuthor.substring(0, 2).toUpperCase() || 'AN',
            title: newTitle,
            content: newContent,
            category: newCategory,
            likes: 0,
            views: 1,
            comments: 0,
            date: new Date().toISOString()
        };

        const updated = [newPostObj, ...posts];
        setPosts(updated);
        
        // Reset and close
        setNewAuthor('');
        setNewTitle('');
        setNewContent('');
        setShowCreateModal(false);
        alert('Post created successfully!');
    };

    const handleLike = (postId) => {
        const updated = posts.map(p => {
            if (p.id === postId) {
                return { ...p, likes: p.likes + 1 };
            }
            return p;
        });
        setPosts(updated);
    };

    // Filter and sorting
    let filtered = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    if (sortBy === 'likes') {
        filtered = [...filtered].sort((a, b) => b.likes - a.likes);
    } else {
        filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return (
        <div className="communitypage-wrapper">
            {/* HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label community">// OCC Community</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}>Learn Together,<br /><span className="text-gradient-community">Grow Together</span></h1>
                    <p>India's largest community for students and aspirants. Share your journey, help others, and build your network.</p>
                    <div className="page-hero-actions">
                        <button className="btn btn-community btn-lg" onClick={() => setShowCreateModal(true)}>Create New Post <span className="arrow">→</span></button>
                    </div>
                    {/* Stats */}
                    <div className="flex gap-xl justify-center flex-wrap" style={{ marginTop: 'var(--space-2xl)' }}>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-community)' }}>8,200+</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Active Members</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-community)' }}>{posts.length}</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Discussions</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-community)' }}>50+</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Study Groups</div></div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <div className="container" style={{ paddingVertical: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-2xl)' }}>
                    
                    {/* Left Sidebar */}
                    <div>
                        {/* Categories */}
                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h4 style={{ marginBottom: 'var(--space-lg)' }}>📋 Categories</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                                <button className={`sidebar-link ${categoryFilter === 'All' ? 'active' : ''}`} onClick={() => setCategoryFilter('All')}>🌍 All Posts</button>
                                <button className={`sidebar-link ${categoryFilter === 'Success Story' ? 'active' : ''}`} onClick={() => setCategoryFilter('Success Story')}>🏆 Success Stories</button>
                                <button className={`sidebar-link ${categoryFilter === 'Study Help' ? 'active' : ''}`} onClick={() => setCategoryFilter('Study Help')}>📚 Study Help</button>
                                <button className={`sidebar-link ${categoryFilter === 'Question' ? 'active' : ''}`} onClick={() => setCategoryFilter('Question')}>❓ Questions</button>
                                <button className={`sidebar-link ${categoryFilter === 'Resource' ? 'active' : ''}`} onClick={() => setCategoryFilter('Resource')}>📦 Resources</button>
                                <button className={`sidebar-link ${categoryFilter === 'Career' ? 'active' : ''}`} onClick={() => setCategoryFilter('Career')}>💼 Career Advice</button>
                            </div>
                        </div>

                        {/* Quick Access */}
                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h4 style={{ marginBottom: 'var(--space-lg)' }}>⚡ Quick Access</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                                <Link to="/exams" className="sidebar-link" style={{ textDecoration: 'none' }}>📝 Exam Resources</Link>
                                <Link to="/mentors" className="sidebar-link" style={{ textDecoration: 'none' }}>🎓 Find a Mentor</Link>
                                <Link to="/careers" className="sidebar-link" style={{ textDecoration: 'none' }}>💼 Browse Jobs</Link>
                                <Link to="/training" className="sidebar-link" style={{ textDecoration: 'none' }}>🚀 Explore Courses</Link>
                            </div>
                        </div>

                        {/* Study Groups */}
                        <div className="card">
                            <h4 style={{ marginBottom: 'var(--space-lg)' }}>👥 Study Groups</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>JEE Aspirants 2026</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>234 members</div>
                                    </div>
                                    <button className="btn btn-sm btn-ghost" onClick={() => alert('Study group functionality coming soon!')}>Join</button>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>UPSC 2026 Batch</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>567 members</div>
                                    </div>
                                    <button className="btn btn-sm btn-ghost" onClick={() => alert('Study group functionality coming soon!')}>Join</button>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Full Stack Learners</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>389 members</div>
                                    </div>
                                    <button className="btn btn-sm btn-ghost" onClick={() => alert('Study group functionality coming soon!')}>Join</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div>
                        {/* Search & Sort */}
                        <div className="flex gap-md items-center" style={{ marginBottom: 'var(--space-xl)' }}>
                            <div className="search-bar" style={{ flex: 1 }}>
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search discussions..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Search discussions"
                                />
                            </div>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ maxWidth: '180px' }}
                                aria-label="Sort posts"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="likes">Most Liked</option>
                            </select>
                        </div>

                        {/* Pinned Indicator */}
                        <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-md)' }}>
                            <span className="badge badge-community">📌 Pinned</span>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Featured discussions from our community</span>
                        </div>

                        {/* Feed Posts */}
                        {filtered.length === 0 ? (
                            <div className="card text-center" style={{ padding: 'var(--space-3xl)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>👥</div>
                                <h3>No posts found</h3>
                                <p>Be the first to post something in this category!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                {filtered.map(post => (
                                    <div className="card" key={post.id} style={{ display: 'flex', flexDirection: 'column', padding: 'var(--space-lg)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                            <div className="avatar avatar-sm">{post.authorInitials}</div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{post.author}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(post.date).toLocaleDateString()} · <span className="badge badge-outline">{post.category}</span></div>
                                            </div>
                                        </div>
                                        <h3 style={{ marginBottom: 'var(--space-xs)' }}>{post.title}</h3>
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.content}</p>
                                        
                                        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                👍 {post.likes} Likes
                                            </button>
                                            <div>💬 {post.comments} Comments</div>
                                            <div>👁️ {post.views} Views</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CREATE POST MODAL */}
            {showCreateModal && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
                    <div className="modal modal-md" style={{ position: 'relative' }}>
                        <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
                        <div className="modal-header" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3>Create a New Post</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Share with the OCC Community</p>
                        </div>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Your Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your name"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Category</label>
                                <select
                                    className="form-select"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    style={{ width: '100%' }}
                                    required
                                >
                                    <option value="Success Story">🏆 Success Story</option>
                                    <option value="Study Help">📚 Study Help</option>
                                    <option value="Question">❓ Question</option>
                                    <option value="Resource">📦 Resource</option>
                                    <option value="Career">💼 Career Advice</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Post Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Summarize your post in a clear title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                                <label className="form-label required">Content</label>
                                <textarea
                                    className="form-textarea"
                                    rows="5"
                                    placeholder="Write your post content here..."
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-community w-full btn-lg" style={{ justifyContent: 'center' }}>Publish Post →</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}