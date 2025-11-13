import { Link, useNavigate } from 'react-router-dom';
import '../styles/_header.scss';
import { useAuthStore } from '../zustand/useAuthStore';
import { useCartStore } from '../zustand/useCartStore';
import { FiLogOut } from 'react-icons/fi';
import { GoSignIn } from 'react-icons/go';
import { useState } from 'react';

const Header = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };
  const totalItems = useCartStore((state) =>
    state.cart.reduce((sum, it) => sum + it.quantity, 0)
  );

  const handleAuthClick = () => {
    if (currentUser) {
      logout();
      clearCart();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('delivery_address');
      window.location.reload();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className='header'>
      <div className='container header__container'>
        <Link to='/' className='logo'>
          <img src='/assets/icons/logo.png' alt='CoffeeHouse Logo' />
        </Link>

        <nav className='nav'>
          <ul className={`nav__list ${menuOpen ? 'active' : ''}`}>
            <li>
              <a href='#favourites' onClick={handleNavClick}>
                Favourite coffee
              </a>
            </li>
            <li>
              <a href='#about' onClick={handleNavClick}>
                About
              </a>
            </li>
            <li>
              <a href='#mobile-app' onClick={handleNavClick}>
                Mobile app
              </a>
            </li>
            <li>
              <a href='#contacts' onClick={handleNavClick}>
                Contact us
              </a>
            </li>
            <li className='menu-link-mobile'>
              <Link to='/menu'>Menu</Link>
            </li>
          </ul>
        </nav>

        <div className='cart-menu'>
          <Link to='/cart' className='header__cart' aria-label='Cart'>
            <img src='/assets/icons/cart.svg' alt='Cart' />
            {totalItems > 0 && <span className='cart-count'>{totalItems}</span>}
          </Link>

          <Link to='/menu' className='header__menu active'>
            <span>Menu</span>
            <img src='/assets/icons/coffee-cup.png' alt='Coffee Cup' />
          </Link>

          <button
            className='auth-icon'
            onClick={handleAuthClick}
            title={currentUser ? 'Logout' : 'Sign In / Sign Up'}
          >
            {currentUser ? <FiLogOut size={20} /> : <GoSignIn size={22} />}
          </button>
        </div>

        <button
          className={`menu-btn ${menuOpen ? 'active' : ''}`}
          aria-label='Open menu'
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
