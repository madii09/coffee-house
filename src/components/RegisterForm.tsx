import React, { useState } from 'react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | ''>('');

  const [emailError, setEmailError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStrongPassword = (value: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value);
  };

  const passwordError =
    password && !isStrongPassword(password)
      ? 'Use letters, numbers, a symbol, and at least 6 characters'
      : '';

  const handleCityChange = (value: string) => {
    if (/^[A-Za-z\s]*$/.test(value)) setCity(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setConfirmError('');
    setLoading(true);

    if (!isStrongPassword(password)) {
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setConfirmError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      setLoading(false);
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

    setLoading(false);

    if (success === 'exists') {
      setEmailError('This login is already taken');
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
      <div>
        <input
          placeholder='Email'
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
            setEmailError('');
          }}
        />
        {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
      </div>

      <div>
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
      </div>

      <div>
        <input
          type='password'
          placeholder='Confirm Password'
          value={confirm}
          onChange={(e) => {
            setConfirmError('');
            setConfirm(e.target.value);
          }}
        />
        {confirmError && <div style={{ color: 'red' }}>{confirmError}</div>}
      </div>

      <input
        placeholder='City'
        value={city}
        onChange={(e) => handleCityChange(e.target.value)}
      />

      <input
        placeholder='Street'
        value={street}
        onChange={(e) => setStreet(e.target.value)}
      />

      <input
        placeholder='House Number'
        value={houseNumber}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*$/.test(val)) {
            setHouseNumber(val === '' ? '' : Number(val));
          }
        }}
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

      <button type='submit' disabled={loading}>
        {loading ? <span className='loader'></span> : 'Register'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};
