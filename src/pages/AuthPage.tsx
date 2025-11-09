import { useState } from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { LoginForm } from '../components/LoginForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const AuthPage = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <>
      <Header />
      <div className='auth-page'>
        <div className='tabs'>
          <button
            onClick={() => setTab('login')}
            className={tab === 'login' ? 'active' : ''}
          >
            Login
          </button>
          <button
            onClick={() => setTab('register')}
            className={tab === 'register' ? 'active' : ''}
          >
            Register
          </button>
        </div>

        <div className='tab-content'>
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
      <Footer />
    </>
  );
};
