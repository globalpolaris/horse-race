import React, { useState } from 'react';
import './App.css';
const axios = require('axios');

function App() {
  const [token, setToken] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('/user/login', {
      username: e.target.username.value,
      password: e.target.password.value,
    });
    console.log(data);
    setToken(data.refreshToken);
  };
  const refreshToken = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('/api/refreshtoken');
    console.log(data);
  };
  // axios
  //   .post('/user/login', {
  //     username: e.target.username.value,
  //     password: e.target.password.value,
  //   })
  //   .then(function (response) {
  //     console.log(response);
  //     // setToken((response) => response.data);
  //   })
  //   .catch((err) => console.error(err));

  return (
    <div className="App">
      <h1>JWT Token Test</h1>
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
    </div>
  );
}

export default App;
