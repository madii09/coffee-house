import { Link } from 'react-router-dom';
import '../styles/_header.scss';

const Header = () => {
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
            <span className='cart-count'>0</span>
          </Link>

          <Link to='/menu' className='header__menu active'>
            <span>Menu</span>
            <img src='/assets/icons/coffee-cup.png' alt='Coffee Cup' />
          </Link>
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
