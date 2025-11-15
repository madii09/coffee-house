import { Link, useNavigate } from 'react-router-dom';
import '../styles/_header.scss';
import { useAuthStore } from '../zustand/useAuthStore';
import { useCartStore } from '../zustand/useCartStore';
import { FiLogOut, FiUser, FiX } from 'react-icons/fi';
import { GoSignIn } from 'react-icons/go';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

  const handleNavClick = () => setMenuOpen(false);

  const totalItems = useCartStore((state) =>
    state.cart.reduce((sum, it) => sum + it.quantity, 0)
  );

  const handleLogout = () => {
    logout();
    clearCart();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('delivery_address');
    setProfileMenuOpen(false);
    navigate('/'); // redirect after logout
  };

  // Close profile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {currentUser ? (
            <div className='profile-wrapper' ref={profileRef}>
              <button
                className='auth-icon'
                onClick={toggleProfileMenu}
                title='Profile'
              >
                <FiUser size={20} />
              </button>

              {profileMenuOpen && (
                <div className='profile-dropdown'>
                  <button
                    className='close-btn'
                    onClick={() => setProfileMenuOpen(false)}
                    title='Close'
                  >
                    <FiX size={18} />
                  </button>
                  <p className='profile-name'>{currentUser.login || 'User'}</p>
                  <Link to='/orders' onClick={() => setProfileMenuOpen(false)}>
                    Order History
                  </Link>
                  <button onClick={handleLogout} className='logout-btn'>
                    Logout <FiLogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className='auth-icon'
              onClick={() => navigate('/auth')}
              title='Sign In / Sign Up'
            >
              <GoSignIn size={22} />
            </button>
          )}
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
