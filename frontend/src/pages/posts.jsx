import axios from '../api';
import React from 'react';

class App extends React.Component {
    state = {
        // Users
        details: [],
        editingId: null,
        editUsername: '',
        editEmail: '',
        newUsername: '',
        newEmail: '',
        newPassword: '',

        // Auth
        currentUser: null,
        loginUsername: '',
        loginPassword: '',
        loginError: '',

        // Posts
        posts: [],
        editingPostId: null,
        editPostTitle: '',
        editPostBody: '',
        editPostSlug: '',
        editPostBanner: '',
        editPostBannerFile: null,

        newPostTitle: '',
        newPostBody: '',
        newPostSlug: '',
        newPostBanner: '',
    };

    componentDidMount() {
        axios.get('http://localhost:8000/react/csrf/')
            .then(() => this.fetchSession())
            .catch(err => console.error(err));
        this.fetchPostData();
        this.fetchUserData();
    }

    // -------------------
    // Auth
    // -------------------
    fetchSession = () => {
        axios.get('http://localhost:8000/react/session/')
            .then(res => this.setState({ currentUser: res.data?.username ? res.data : null }))
            .catch(err => console.error(err));
    };

    handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/react/login/', {
            username: this.state.loginUsername,
            password: this.state.loginPassword,
        })
            .then(res => {
                this.setState({ currentUser: res.data, loginUsername: '', loginPassword: '', loginError: '' });
            })
            .catch(err => {
                this.setState({ loginError: err.response?.data?.detail || 'Login failed' });
            });
    };

    handleLogout = () => {
        axios.post('http://localhost:8000/react/logout/')
            .then(() => this.setState({ currentUser: null }))
            .catch(err => console.error(err));
    };

    // -------------------
    // Posts
    // -------------------
    fetchUserData = () => {
        axios.get('http://localhost:8000/react/users/')
            .then(res => {
                this.setState({ details: res.data });
            })
            .catch(err => console.error(err));
    };
    fetchPostData = () => {
        axios.get('http://localhost:8000/react/posts/')
            .then(res => {
                const posts = Array.isArray(res.data) ? res.data : (res.data.results || []);
                this.setState({ posts });
            })
            .catch(err => {
                console.error('Error fetching posts:', err.response?.status, err.response?.data || err.message);
            });
    };

    handleCreatePost = (e) => {
        e.preventDefault();

        const { newPostTitle, newPostBody, newPostSlug, newPostBanner, newPostBannerFile } = this.state;

        let payload;
        if (newPostBannerFile) {
            payload = new FormData();
            payload.append('title', newPostTitle);
            payload.append('body', newPostBody);
            payload.append('slug', newPostSlug);
            payload.append('banner', newPostBannerFile);
        } else {
            payload = {
                title: newPostTitle,
                body: newPostBody,
                slug: newPostSlug,
                banner: newPostBanner,
            };
        }

        axios.post('http://localhost:8000/react/posts/', payload)
            .then(res => {
                this.setState(prev => ({
                    posts: [...prev.posts, res.data],
                    newPostTitle: '',
                    newPostBody: '',
                    newPostSlug: '',
                    newPostBanner: '',
                    newPostBannerFile: null,
                }));
            })
            .catch(err => {
                if (err.response) {
                    console.error('Valideringsfel vid skapande av post:', err.response.data);
                } else {
                    console.error(err);
                }
            });
    };

    handleDeletePost = (id) => {
        axios.delete(`http://localhost:8000/react/posts/${id}/`)
            .then(() => {
                this.setState(prev => ({
                    posts: prev.posts.filter(post => post.id !== id)
                }));
            })
            .catch(err => console.error(err));
    };

    startEditPost = (post) => {
        this.setState({
            editingPostId: post.id,
            editPostTitle: post.title || '',
            editPostBody: post.body || '',
            editPostSlug: post.slug || '',
            editPostBanner: post.banner || '',
            editPostBannerFile: null,
        });
    };

    handleUpdatePost = (id) => {
        const { editPostTitle, editPostBody, editPostSlug, editPostBanner, editPostBannerFile } = this.state;

        let payload;
        if (editPostBannerFile) {
            payload = new FormData();
            payload.append('title', editPostTitle);
            payload.append('body', editPostBody);
            payload.append('slug', editPostSlug);
            payload.append('banner', editPostBannerFile);
        } else {
            payload = {
                title: editPostTitle,
                body: editPostBody,
                slug: editPostSlug,
                banner: editPostBanner,
            };
        }

        axios.put(`http://localhost:8000/react/posts/${id}/`, payload)
            .then(res => {
                this.setState(prev => ({
                    posts: prev.posts.map(post => (post.id === id ? res.data : post)),
                    editingPostId: null,
                    editPostTitle: '',
                    editPostBody: '',
                    editPostSlug: '',
                    editPostBanner: '',
                    editPostBannerFile: null,
                }));
            })
            .catch(err => {
                console.error('Update post error:', err.response?.data || err.message);
            });
    };

    render() {
        const {
            details, posts, editingPostId,
            editPostTitle, editPostBody, editPostSlug, editPostBanner, editPostBannerFile,
            newPostTitle, newPostBody, newPostSlug, newPostBannerFile,
            currentUser, loginUsername, loginPassword, loginError
        } = this.state;

        return (

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
                <header>Data from django</header>
                <hr />

                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    {currentUser ? (
                        <p>
                            Inloggad som <strong>{currentUser.username}</strong>
                            <button onClick={this.handleLogout} style={{ marginLeft: '10px' }}>Logga ut</button>
                        </p>
                    ) : (
                        <form onSubmit={this.handleLogin}>
                            <h3>Logga in</h3>
                            <input
                                aria-label="login-username"
                                type="text"
                                placeholder="Username"
                                value={loginUsername}
                                onChange={(e) => this.setState({ loginUsername: e.target.value })}
                                required
                                style={{ padding: '5px', marginRight: '10px' }}
                            />
                            <input
                                aria-label="login-password"
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => this.setState({ loginPassword: e.target.value })}
                                required
                                style={{ padding: '5px', marginRight: '10px' }}
                            />
                            <button type="submit">Logga in</button>
                            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                        </form>
                    )}
                </div>

                <h3>Add Post</h3>
                {currentUser ? (
                    <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #28a745', borderRadius: '5px' }}>
                        <h3>Lägg till nytt inlägg</h3>
                        <form onSubmit={this.handleCreatePost}>
                            <div style={{ marginBottom: '10px' }}>
                                <input
                                    aria-label="title"
                                    type="text"
                                    placeholder="Title"
                                    value={newPostTitle}
                                    onChange={(e) => this.setState({ newPostTitle: e.target.value })}
                                    required
                                    style={{ padding: '5px', width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <textarea
                                    aria-label="body"
                                    placeholder="Body"
                                    value={newPostBody}
                                    onChange={(e) => this.setState({ newPostBody: e.target.value })}
                                    required
                                    rows={4}
                                    style={{ padding: '5px', width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <input
                                    aria-label="slug"
                                    type="text"
                                    placeholder="Slug"
                                    value={newPostSlug}
                                    onChange={(e) => this.setState({ newPostSlug: e.target.value })}
                                    style={{ padding: '5px', width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label>
                                    Banner:{' '}
                                    <input
                                        aria-label="banner"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => this.setState({ newPostBannerFile: e.target.files[0] || null })}
                                    />
                                </label>
                                {newPostBannerFile && (
                                    <img
                                        src={URL.createObjectURL(newPostBannerFile)}
                                        alt="Förhandsvisning av banner"
                                        style={{ display: 'block', maxWidth: '100%', maxHeight: '150px', height: 'auto', marginTop: '10px' }}
                                    />
                                )}
                            </div>

                            <button aria-label="Skapa inlägg" type="submit" style={{ padding: '7px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Skapa inlägg
                            </button>
                        </form>
                    </div>
                ) : (
                    <p>Du måste vara inloggad för att skapa ett inlägg.</p>
                )}

                <h3>Posts</h3>
                {Array.isArray(posts) ? (
                    posts.map((post) => (
                        <div key={post.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                            {editingPostId === post.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editPostTitle}
                                        onChange={(e) => this.setState({ editPostTitle: e.target.value })}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <textarea
                                        value={editPostBody}
                                        onChange={(e) => this.setState({ editPostBody: e.target.value })}
                                        rows={4}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <input
                                        type="text"
                                        value={editPostSlug}
                                        onChange={(e) => this.setState({ editPostSlug: e.target.value })}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <div style={{ marginBottom: '10px' }}>
                                        <label>
                                            Banner:{' '}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => this.setState({ editPostBannerFile: e.target.files[0] || null })}
                                            />
                                        </label>
                                        {(editPostBannerFile || editPostBanner) && (
                                            <img
                                                src={editPostBannerFile ? URL.createObjectURL(editPostBannerFile) : editPostBanner}
                                                alt="Förhandsvisning av banner"
                                                style={{ display: 'block', maxWidth: '100%', maxHeight: '150px', height: 'auto', marginTop: '10px' }}
                                            />
                                        )}
                                    </div>

                                    <button onClick={() => this.handleUpdatePost(post.id)}>Spara</button>
                                    <button onClick={() => this.setState({ editingPostId: null })} style={{ marginLeft: '10px' }}>
                                        Avbryt
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h2>{post.title}</h2>
                                    <p><strong>Body:</strong> {post.body}</p>
                                    <p><strong>Slug:</strong> {post.slug}</p>
                                    <p><strong>Date created:</strong> {post.date_created}</p>
                                    {post.banner && (
                                        <p>
                                            <strong>Banner:</strong><br />
                                            <img src={post.banner} alt={`Banner för ${post.title}`} style={{ maxWidth: '100%', maxHeight: '300px', height: 'auto' }} />
                                        </p>
                                    )}
                                    <p><strong>Author:</strong> {post.author}</p>
                                    {(() => {
                                        const authorUser = details.find(user => user.username === post.author);
                                        return authorUser?.profile_image ? (
                                            <img
                                                src={authorUser.profile_image}
                                                alt={`${post.author} profilbild`}
                                                style={{ display: 'block', maxWidth: '100px', maxHeight: '100px', height: 'auto', marginBottom: '10px' }}
                                            />
                                        ) : null;
                                    })()}

                                    {currentUser?.username === post.author && (
                                        <>
                                            <button onClick={() => this.startEditPost(post)}>Redigera</button>
                                            <button aria-label="Ta bort Post" onClick={() => this.handleDeletePost(post.id)} style={{ marginLeft: '10px', color: 'red' }}>
                                                Ta bort Post
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Ingen postdata tillgänglig eller felaktigt format.</p>
                )}
            </div>
        );
    }
}

export default App;