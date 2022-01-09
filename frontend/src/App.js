import React, { useState, useEffect } from 'react';
import './App.css';
const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const res = await axios.post('/api/refreshtoken');
          console.log(res);
          localStorage.setItem('accessToken', res.data.accessToken);
          instance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${res.data.accessToken}`;
          return instance(originalConfig);
        } catch (e) {
          return Promise.reject(e.response.data);
        }
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const username = localStorage.getItem('username') || 'Guest';
  const [loggedIn, setLoggedIn] = useState(false);
  const [horse, setHorse] = useState(false);
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
          localStorage.setItem('accessToken', res.data.accessToken);
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
        localStorage.setItem('accessToken', res.data.accessToken);
      })
      .catch((err) => {
        console.log(err);
        setUser('Guest');
        localStorage.removeItem('accessToken');
      });
  };
  const logout = (e) => {
    axios
      .post('/user/logout')
      .then((res) => {
        console.log(res);
        localStorage.setItem('username', 'Guest');
        localStorage.removeItem('accessToken');
        setLoggedIn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHorse = (e) => {
    e.preventDefault();

    instance
      .get('/api/horse', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        console.log(res);
        setHorse(true);
      })
      .catch((err) => {
        setHorse(false);
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

      <form onSubmit={getHorse}>
        <input type="submit" value="Get Horse" />
      </form>
      {horse ? <h1>Horse</h1> : <h1>Not auth</h1>}
    </div>
  );
}

export default App;
