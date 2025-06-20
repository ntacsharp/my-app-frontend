"use client"

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Failed to fetch'));
  }, []);
  return (
    <div style={{ padding: 50 }}>
      <h1>Frontend</h1>
      <p>API response: {message}</p>
    </div>
  );
}
