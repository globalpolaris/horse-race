import React, { useState, useEffect } from 'react';
import './App.css';
const axios = require('axios');

function App() {
  const username = localStorage.getItem('username') || 'Guest';
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(username);
  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.headers.post['X-CSRF-TOKEN'] = 'test';
    };
    fetchData();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.username.value);
    axios
      .post('/user/login', {
        username: e.target.username.value,
        password: e.target.password.value,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem('username', res.data.username);
          setLoggedIn(true);
          setUser(res.data.username);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const refreshToken = (e) => {
    e.preventDefault();
    axios
      .post('/api/refreshtoken')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setUser('Guest');
        localStorage.removeItem('username');
      });
  };
  const logout = (e) => {
    axios
      .post('/user/logout')
      .then((res) => {
        console.log(res);
        localStorage.removeItem('username');
        setLoggedIn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <h1>JWT Token Test</h1>
      <h3>Hello, {user}</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="username" />
        <br />
        <input type="password" name="password" placeholder="password" />
        <br />
        <input type="submit" value="Login" />
      </form>
      <form onSubmit={refreshToken}>
        <input type="submit" value="Get New Access Token" />
      </form>
      {loggedIn ? (
        <form onSubmit={logout}>
          <input type="submit" value="Logout" />
        </form>
      ) : null}
    </div>
  );
}

export default App;
