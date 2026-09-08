import axios from '../api';
import React from 'react';


class App extends React.Component {
    state = {
        // Users
        details: [],
        deleteError: '',
        createError: '',
        editingId: null,
        editUsername: '',
        editEmail: '',
        editFirstName: '',
        editLastName: '',
        editBio: '',
        editProfileImage: '',
        editProfileImageFile: null,
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

        newPostTitle: '',
        newPostBody: '',
        newPostSlug: '',
        newPostBanner: '',
        newPostAuthor: '',
    };

    componentDidMount() {
        axios.get('http://localhost:8000/react/csrf/')
            .then(() => this.fetchSession())
            .catch(err => console.error(err));
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
    // Users
    // -------------------
    fetchUserData = () => {
        axios.get('http://localhost:8000/react/users/')
            .then(res => {
                this.setState({ details: res.data });
            })
            .catch(err => console.error(err));
    };

    handleCreate = (e) => {
        e.preventDefault();

        const newData = {
            username: this.state.newUsername,
            email: this.state.newEmail,
            password: this.state.newPassword,
        };

        axios.post('http://localhost:8000/react/users/', newData)
            .then(res => {
                this.setState(prev => ({
                    details: [...prev.details, res.data],
                    newUsername: '',
                    newEmail: '',
                    newPassword: '',
                    createError: '',
                }));
            })
            .catch(err => {
                if (err.response) {
                    console.error('Valideringsfel vid registrering:', err.response.data);
                    const errors = err.response.data;
                    const message = Object.entries(errors)
                        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                        .join(' | ');
                    this.setState({ createError: message || 'Kunde inte skapa användaren.' });
                } else {
                    console.error(err);
                    this.setState({ createError: 'Kunde inte skapa användaren.' });
                }
            });
    };

    handleDelete = (id) => {
        axios.delete(`http://localhost:8000/react/users/${id}/`)
            .then(() => {
                this.setState({ deleteError: '' });
                this.fetchUserData();
            })
            .catch(err => {
                const detail = err.response?.data?.detail || err.response?.data || err.message;
                this.setState({ deleteError: String(detail) });
                console.error('Delete user error:', detail);
            });
    };

    startEdit = (output) => {
        this.setState({
            editingId: output.id,
            editUsername: output.username,
            editEmail: output.email,
            editFirstName: output.first_name || '',
            editLastName: output.last_name || '',
            editBio: output.bio || '',
            editProfileImage: output.profile_image || '',
            editProfileImageFile: null,
        });
    };

    handleUpdate = (id) => {
        const { editUsername, editEmail, editFirstName, editLastName, editBio, editProfileImageFile } = this.state;

        let payload;
        if (editProfileImageFile) {
            payload = new FormData();
            payload.append('username', editUsername);
            payload.append('email', editEmail);
            payload.append('first_name', editFirstName);
            payload.append('last_name', editLastName);
            payload.append('bio', editBio);
            payload.append('profile_image', editProfileImageFile);
        } else {
            payload = {
                username: editUsername,
                email: editEmail,
                first_name: editFirstName,
                last_name: editLastName,
                bio: editBio,
            };
        }

        axios.put(`http://localhost:8000/react/users/${id}/`, payload)
            .then(res => {
                this.setState(prev => ({
                    details: prev.details.map(item => (item.id === id ? res.data : item)),
                    editingId: null,
                    editUsername: '',
                    editEmail: '',
                    editFirstName: '',
                    editLastName: '',
                    editBio: '',
                    editProfileImage: '',
                    editProfileImageFile: null,
                }));
            })
            .catch(err => console.error(err));
    };

    render() {
        const {
            // Users
            details, deleteError, createError, editingId, editUsername, editEmail,
            editFirstName, editLastName, editBio, editProfileImage, editProfileImageFile,
            newUsername, newEmail, newPassword,
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

                <h3>Add User</h3>
                <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #007bff', borderRadius: '5px' }}>
                    <h3>Lägg till ny användare</h3>
                    <form onSubmit={this.handleCreate}>
                        <div style={{ marginBottom: '10px' }}>
                            <input
                                aria-label="username"
                                type="text"
                                placeholder="Användarnamn"
                                value={newUsername}
                                onChange={(e) => this.setState({ newUsername: e.target.value })}
                                required
                                style={{ padding: '5px', width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <input
                                aria-label="email"
                                type="email"
                                placeholder="E-post"
                                value={newEmail}
                                onChange={(e) => this.setState({ newEmail: e.target.value })}
                                required
                                style={{ padding: '5px', width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <input
                                aria-label="password"
                                type="password"
                                placeholder="Lösenord"
                                value={newPassword}
                                onChange={(e) => this.setState({ newPassword: e.target.value })}
                                required
                                style={{ padding: '5px', width: '100%' }}
                            />
                        </div>
                        {createError && (
                            <p style={{ color: 'red' }}>{createError}</p>
                        )}
                        <button aria-label="submit" type="submit" style={{ padding: '7px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Submit
                        </button>
                    </form>
                </div>

                <h3>Users</h3>
                {deleteError && (
                    <p style={{ color: 'red' }}>Delete failed: {deleteError}</p>
                )}
                {Array.isArray(details) ? (
                    details.map((output) => (
                        <div key={output.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                            {editingId === output.id ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Användarnamn"
                                        value={editUsername}
                                        onChange={(e) => this.setState({ editUsername: e.target.value })}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="E-post"
                                        value={editEmail}
                                        onChange={(e) => this.setState({ editEmail: e.target.value })}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Förnamn"
                                        value={editFirstName}
                                        onChange={(e) => this.setState({ editFirstName: e.target.value })}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Efternamn"
                                        value={editLastName}
                                        onChange={(e) => this.setState({ editLastName: e.target.value })}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <textarea
                                        placeholder="Bio"
                                        value={editBio}
                                        onChange={(e) => this.setState({ editBio: e.target.value })}
                                        rows={3}
                                        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                                    />
                                    <div style={{ marginBottom: '10px' }}>
                                        <label>
                                            Profilbild:{' '}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => this.setState({ editProfileImageFile: e.target.files[0] || null })}
                                            />
                                        </label>
                                        {(editProfileImageFile || editProfileImage) && (
                                            <img
                                                src={editProfileImageFile ? URL.createObjectURL(editProfileImageFile) : editProfileImage}
                                                alt="Förhandsvisning av profilbild"
                                                style={{ display: 'block', maxWidth: '100%', maxHeight: '150px', height: 'auto', marginTop: '10px' }}
                                            />
                                        )}
                                    </div>
                                    <button onClick={() => this.handleUpdate(output.id)}>Spara</button>
                                    <button onClick={() => this.setState({ editingId: null })}>Avbryt</button>
                                </div>
                            ) : (
                                <div>
                                    <h2>{output.username}</h2>
                                    <p>{output.email}</p>
                                    {(output.first_name || output.last_name) && (
                                        <p><strong>Namn:</strong> {output.first_name} {output.last_name}</p>
                                    )}
                                    {output.bio && <p><strong>Bio:</strong> {output.bio}</p>}
                                    {output.profile_image && (
                                        <img src={output.profile_image} alt={`${output.username} profilbild`} style={{ display: 'block', maxWidth: '100%', maxHeight: '150px', height: 'auto', marginBottom: '10px' }} />
                                    )}
                                    <div>
                                        {currentUser?.username === output.username && (
                                            <button onClick={() => this.startEdit(output)}>Redigera</button>
                                        )}
                                        {(currentUser?.username === output.username || currentUser?.is_staff) && (
                                            <button aria-label="Ta bort Användare" onClick={() => this.handleDelete(output.id)} style={{ marginLeft: '10px', color: 'red' }}>
                                                Ta bort Användare
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Ingen data tillgänglig eller felaktigt format.</p>
                )}
            </div>
        );
    }
}

export default App;