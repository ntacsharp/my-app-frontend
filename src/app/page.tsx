"use client"

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://192.168.122.190:32337/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Failed to fetch' + err.message));
  }, []);
  return (
    <div style={{ padding: 50 }}>
      <h1>Frontend</h1>
      <p>API response: {message}</p>
    </div>
  );
}
