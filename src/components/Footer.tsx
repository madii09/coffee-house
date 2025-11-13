import '../styles/_footer.scss';
const Footer = () => {
  return (
    <footer id='contacts' className='footer container'>
      <div className='footer__container'>
        <div className='footer-content'>
          <h2>
            Sip, Savor, Smile.
            <p className='highlight'>It’s coffee time!</p>
          </h2>
          <div className='footer-icons'>
            <a
              href='https://twitter.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src='/assets/icons/icon-twitter.svg' alt='Twitter' />
            </a>
            <a
              href='https://www.instagram.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src='/assets/icons/instagram.svg' alt='Instagram' />
            </a>
            <a
              href='https://www.facebook.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src='/assets/icons/facebook.svg' alt='Facebook' />
            </a>
          </div>
        </div>

        <div className='contacts'>
          <h3>Contact us</h3>
          <ul>
            <li>
              <a
                href='https://www.google.com/maps'
                target='_blank'
                rel='noopener noreferrer'
              >
                <img src='/assets/icons/location.svg' alt='location' /> 8558
                Green Rd., LA
              </a>
            </li>
            <li>
              <a href='tel:+16035550123'>
                <img src='/assets/icons/phone.svg' alt='phone' /> +1 (603)
                555-0123
              </a>
            </li>
            <li>
              <img src='/assets/icons/clock.svg' alt='clock' /> Mon-Sat: 9:00 AM
              – 23:00 PM
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
