import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import './styles/main.scss';
import { Toaster } from 'react-hot-toast';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/cart' element={<Cart />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
