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
          localStorage.removeItem('accessToken');
          localStorage.setItem('username', 'Guest');
          alert('You have been logged out');
          document.location.reload();
          return Promise.reject(e.response.data);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
