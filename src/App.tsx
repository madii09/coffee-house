import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import './styles/main.scss';
import { Toaster } from 'react-hot-toast';
import { AuthPage } from './pages/AuthPage';

const App = () => {
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </>
  );
};

export default App;
