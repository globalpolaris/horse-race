import React, { useState } from 'react';
import instance from '../adapters/axios';

export default function HorseButton() {
  const [horse, setHorse] = useState(false);
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
    <form onSubmit={getHorse}>
      <input type="submit" value="Get Horse" />
    </form>
  );
}
