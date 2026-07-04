import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CommunityPage() {
    const { AppState } = useAppContext();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setPosts(AppState.getCommunityPosts());
    }, [AppState]);

    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="container">
                    <h1>OCC <span className="text-gradient">Community</span></h1>
                    <p>Join a thriving community of learners. Share success stories, resources, and grow together.</p>
                    <Link to="/portal" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-lg)' }}>Join the Discussion →</Link>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="community-posts">
                        {posts.map(post => (
                            <div className="community-post-card" key={post.id}>
                                <div className="post-header">
                                    <div className="post-author">
                                        <div className="post-avatar">{post.authorAvatar}</div>
                                        <div>
                                            <strong>{post.authorName}</strong>
                                            <span className="text-xs text-muted">{new Date(post.postedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className="badge badge-outline">{post.category}</span>
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.content.substring(0, 200)}</p>
                                <div className="post-tags">
                                    {post.tags.map((t, i) => (
                                        <span key={i} className="badge badge-outline">#{t}</span>
                                    ))}
                                </div>
                                <div className="post-stats">
                                    <span>❤️ {post.likes}</span>
                                    <span>💬 {post.comments}</span>
                                    <span>👁️ {post.views}</span>
                                    {post.pinned && <span className="badge badge-amber">📌 Pinned</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}