import axios from 'axios';
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
    this.fetchUserData();
    this.fetchPostData();
  }

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
          newPassword: ''
        }));
      })
      .catch(err => {
        if (err.response) {
          console.error('Valideringsfel vid registrering:', err.response.data);
        } else {
          console.error(err);
        }
      });
  };

  handleDelete = (id) => {
    axios.delete(`http://localhost:8000/react/users/${id}/`)
      .then(() => {
        this.setState(prev => ({
          details: prev.details.filter(item => item.id !== id)
        }));
      })
      .catch(err => console.error(err));
  };

  startEdit = (output) => {
    this.setState({
      editingId: output.id,
      editUsername: output.username,
      editEmail: output.email
    });
  };

  handleUpdate = (id) => {
    const updatedData = {
      username: this.state.editUsername,
      email: this.state.editEmail
    };

    axios.put(`http://localhost:8000/react/users/${id}/`, updatedData)
      .then(res => {
        this.setState(prev => ({
          details: prev.details.map(item => (item.id === id ? res.data : item)),
          editingId: null,
          editUsername: '',
          editEmail: ''
        }));
      })
      .catch(err => console.error(err));
  };

  // -------------------
  // Posts
  // -------------------
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

    const newPostData = {
      title: this.state.newPostTitle,
      body: this.state.newPostBody,
      slug: this.state.newPostSlug,
      banner: this.state.newPostBanner,
      author_id: this.state.newPostAuthor,
    };

    axios.post('http://localhost:8000/react/posts/', newPostData)
      .then(res => {
        this.setState(prev => ({
          posts: [...prev.posts, res.data],
          newPostTitle: '',
          newPostBody: '',
          newPostSlug: '',
          newPostBanner: '',
          newPostAuthor: '',
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
    });
  };

  handleUpdatePost = (id) => {
    const updatedPostData = {
      title: this.state.editPostTitle,
      body: this.state.editPostBody,
      slug: this.state.editPostSlug,
    };

    axios.put(`http://localhost:8000/react/posts/${id}/`, updatedPostData)
      .then(res => {
        this.setState(prev => ({
          posts: prev.posts.map(post => (post.id === id ? res.data : post)),
          editingPostId: null,
          editPostTitle: '',
          editPostBody: '',
          editPostSlug: '',
        }));
      })
      .catch(err => {
        console.error('Update post error:', err.response?.data || err.message);
      });
  };

  render() {
    const {
      // Users
      details, editingId, editUsername, editEmail, newUsername, newEmail, newPassword,
      // Posts
      posts, editingPostId,
      editPostTitle, editPostBody, editPostSlug,
      newPostTitle, newPostBody, newPostSlug, newPostBanner, newPostAuthor
    } = this.state;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <header>Data from django</header>
        <hr />

        <h3>Add User</h3>
        <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #007bff', borderRadius: '5px' }}>
          <h3>Lägg till ny användare</h3>
          <form onSubmit={this.handleCreate}>
            <div style={{ marginBottom: '10px' }}>
              <input
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
                type="password"
                placeholder="Lösenord"
                value={newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
                required
                style={{ padding: '5px', width: '100%' }}
              />
            </div>
            <button type="submit" style={{ padding: '7px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
              Skapa användare
            </button>
          </form>
        </div>

        <h3>Users</h3>
        {Array.isArray(details) ? (
          details.map((output) => (
            <div key={output.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
              {editingId === output.id ? (
                <div>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => this.setState({ editUsername: e.target.value })}
                  />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => this.setState({ editEmail: e.target.value })}
                  />
                  <button onClick={() => this.handleUpdate(output.id)}>Spara</button>
                  <button onClick={() => this.setState({ editingId: null })}>Avbryt</button>
                </div>
              ) : (
                <div>
                  <h2>{output.username}</h2>
                  <p>{output.email}</p>
                  <button onClick={() => this.startEdit(output)}>Redigera</button>
                  <button onClick={() => this.handleDelete(output.id)} style={{ marginLeft: '10px', color: 'red' }}>
                    Ta bort
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Ingen data tillgänglig eller felaktigt format.</p>
        )}

        <hr style={{ margin: '35px 0' }} />

        <h3>Add Post</h3>
        <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #28a745', borderRadius: '5px' }}>
          <h3>Lägg till nytt inlägg</h3>
          <form onSubmit={this.handleCreatePost}>
            <div style={{ marginBottom: '10px' }}>
              <input
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
                type="text"
                placeholder="Slug"
                value={newPostSlug}
                onChange={(e) => this.setState({ newPostSlug: e.target.value })}
                style={{ padding: '5px', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Banner (URL or path)"
                value={newPostBanner}
                onChange={(e) => this.setState({ newPostBanner: e.target.value })}
                style={{ padding: '5px', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Author"
                value={newPostAuthor}
                onChange={(e) => this.setState({ newPostAuthor: e.target.value })}
                style={{ padding: '5px', width: '100%' }}
              />
            </div>

            <button type="submit" style={{ padding: '7px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
              Skapa inlägg
            </button>
          </form>
        </div>

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
                  <p><strong>Banner:</strong> {post.banner}</p>
                  <p><strong>Author:</strong> {post.author}</p>

                  <button onClick={() => this.startEditPost(post)}>Redigera</button>
                  <button onClick={() => this.handleDeletePost(post.id)} style={{ marginLeft: '10px', color: 'red' }}>
                    Ta bort
                  </button>
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