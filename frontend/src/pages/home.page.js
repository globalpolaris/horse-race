import React, { useState, useEffect } from 'react';
import instance from '../adapters/axios';
import HorseButton from '../components/HorseButton.component';

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [coin, setCoin] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.username.value);
    instance
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
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const refreshToken = (e) => {
    e.preventDefault();
    instance
      .post('/api/refreshtoken')
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.accessToken);
      })
      .catch((err) => {
        console.log(err);
        localStorage.setItem('username', 'Guest');
        localStorage.removeItem('accessToken');
      });
  };
  const logout = (e) => {
    instance
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

  return (
    <div className="App">
      <h1>JWT Token Test</h1>
      <h3>Hello, {localStorage.getItem('username')}</h3>
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
        <div>
          <form onSubmit={logout}>
            <input type="submit" value="Logout" />
          </form>
          <h1>{coin} Coins</h1>
        </div>
      ) : null}
      <HorseButton />
    </div>
  );
};

export default Home;
