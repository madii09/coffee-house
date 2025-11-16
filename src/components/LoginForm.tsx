import React, { useState } from 'react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(loginInput, password);

    setLoading(false);

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

      <button type='submit' disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};
