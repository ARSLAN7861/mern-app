import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [createdUser, setCreatedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then(res => res.text())
      .then(data => setMsg(data));

    fetch(`${API_BASE}/api/data`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  const fetchAllUsers = async () => {
    const res = await fetch(`${API_BASE}/api/users`);
    const data = await res.json();
    setAllUsers(data);
    setShowUsers(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setCreatedUser(data.user);
    setForm({ name: '', email: '' });
    setShowUsers(false); // Hide old list after submission
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>MERN App</h1>
      <p>{msg}</p>

      {user && (
        <div>
          <h2>Static User Info:</h2>
          <p>Name: {user.name}</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      <hr />
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        /><br /><br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        /><br /><br />
        <button type="submit">Add User</button>
      </form>

      {createdUser && (
        <div>
          <h3>User Created:</h3>
          <p>{createdUser.name} ({createdUser.email})</p>
        </div>
      )}

      <hr />
      <h2>Get All Users</h2>
      <button onClick={fetchAllUsers}>Show All Users</button>

      {showUsers && (
        <ul>
          {allUsers.map((u, idx) => (
            <li key={idx}>{u.name} — {u.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
