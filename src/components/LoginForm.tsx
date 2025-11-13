import React, { useState } from 'react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(loginInput, password);
    if (!success) {
      setError('Invalid login or password');
      return;
    }

    navigate('/menu');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder='Login'
        value={loginInput}
        onChange={(e) => setLoginInput(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit'>Sign In</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};
