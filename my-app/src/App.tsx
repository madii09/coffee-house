import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import './styles/main.scss';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <CartProvider>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </CartProvider>
  );
};

export default App;
