import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [nombre, setNombre] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3001/api/users');
    setUsers(res.data);
  };

  const crearUsuario = async () => {
    if (!nombre) return;
    await axios.post('http://localhost:3001/api/users', { nombre });
    setNombre('');
    fetchUsers();
  };

  const eliminarUsuario = async (id) => {
    await axios.delete(`http://localhost:3001/api/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>CRUD Usuarios</h1>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <button onClick={crearUsuario}>Agregar</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.nombre} <button onClick={() => eliminarUsuario(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
