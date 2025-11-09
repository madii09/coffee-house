import { Link, useNavigate } from 'react-router-dom';
import '../styles/_header.scss';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/useCart';
import { FiLogOut } from 'react-icons/fi'; // <- import logout icon

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleAuthClick = () => {
    if (currentUser) {
      logout();
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
          <ul className='nav__list'>
            <li>
              <a href='#favourites'>Favourite coffee</a>
            </li>
            <li>
              <a href='#about'>About</a>
            </li>
            <li>
              <a href='#mobile-app'>Mobile app</a>
            </li>
            <li>
              <a href='#contacts'>Contact us</a>
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
            {currentUser ? <FiLogOut size={20} /> : 'Sign In / Sign Up'}
          </button>
        </div>

        <button className='menu-btn' aria-label='Open menu'>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
