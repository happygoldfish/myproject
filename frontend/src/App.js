import axios from 'axios';
import React from 'react';

class App extends React.Component {
  state = {
    details: [],
    editingId: null,
    editUsername: '',
    editEmail: '',
    newUsername: '',
    newEmail: '',
    newPassword: '',
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = () => {
    axios.get('http://localhost:8000/react/users/')
      .then(res => {
        this.setState({ details: res.data });
      })
      .catch(err => console.error(err));
  }

  handleCreate = (e) => {
    e.preventDefault();

    const newData = {
      username: this.state.newUsername,
      email: this.state.newEmail,
      password: this.state.newPassword,
    };

    axios.post('http://localhost:8000/react/users/', newData)
      .then(res => {
        this.setState({
          details: [...this.state.details, res.data],
          newUsername: '',
          newEmail: '',
          newPassword: ''
        });
      })
      .catch(err => {
        if (err.response) {
          console.error("Valideringsfel vid registrering:", err.response.data);
        } else {
          console.error(err);
        }
      });
  }

  handleDelete = (id) => {
    axios.delete(`http://localhost:8000/react/users/${id}/`)
      .then(() => {
        this.setState({
          details: this.state.details.filter(item => item.id !== id)
        });
      })
      .catch(err => console.error(err));
  }

  startEdit = (output) => {
    this.setState({
      editingId: output.id,
      editUsername: output.username,
      editEmail: output.email
    });
  }

  handleUpdate = (id) => {
    const updatedData = {
      username: this.state.editUsername,
      email: this.state.editEmail
    };

    axios.put(`http://localhost:8000/react/users/${id}/`, updatedData)
      .then(res => {
        const updatedDetails = this.state.details.map(item =>
          item.id === id ? res.data : item
        );

        this.setState({
          details: updatedDetails,
          editingId: null,
          editUsername: '',
          editEmail: ''
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { details, editingId, editUsername, editEmail, newUsername, newEmail, newPassword } = this.state;

    return (
      <div>

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
      </div>
    );
  }
}

export default App;