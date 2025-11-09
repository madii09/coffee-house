import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    const success = await register({
      login,
      password,
      confirmPassword: confirm,
      city,
      street,
      houseNumber: houseNumber === '' ? undefined : houseNumber,
      paymentMethod,
    });

    if (success === 'exists') {
      setError('This login is already taken');
      return;
    }

    if (!success) {
      setError('Registration failed');
      return;
    }

    navigate('/menu');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder='Login'
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type='password'
        placeholder='Confirm Password'
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <input
        placeholder='City'
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        placeholder='Street'
        value={street}
        onChange={(e) => setStreet(e.target.value)}
      />
      <input
        type='number'
        placeholder='House Number'
        value={houseNumber}
        onChange={(e) => setHouseNumber(Number(e.target.value))}
      />

      <div>
        <label>
          <input
            type='radio'
            name='paymentMethod'
            value='cash'
            checked={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
          />
          Cash
        </label>

        <label>
          <input
            type='radio'
            name='paymentMethod'
            value='card'
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          Card
        </label>
      </div>

      <button type='submit'>Register</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};
