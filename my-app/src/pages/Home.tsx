import '../styles/main.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FavoritesSlider from '../components/FavoritesSlider';

const Home = () => {
  return (
    <>
      <Header />

      <main>
        {/* HERO SECTION */}
        <section id='enjoy' className='enjoy'>
          <div className='container'>
            <video
              autoPlay
              muted
              loop
              playsInline
              className='enjoy__video'
              poster='/assets/images/img-hero.jpg'
            >
              <source src='/assets/videos/video.mp4' type='video/mp4' />
            </video>

            <div className='enjoy__content'>
              <h1>
                <span className='highlight'>Enjoy</span> premium coffee at our
                charming cafe
              </h1>
              <p>
                With its inviting atmosphere and delicious coffee options, the
                Coffee House Resource is a popular destination for coffee lovers
                and those seeking a warm and inviting space to enjoy their
                favorite beverage.
              </p>
              <button className='btn' data-menu-link>
                Menu
              </button>
            </div>
          </div>
        </section>

        {/* FAVOURITES SECTION */}
        <section id='favourites' className='favourites'>
          <h2>
            Choose your <span className='highlight'>favorite</span> coffee
          </h2>

          <FavoritesSlider />
          {/* <div className='carousel container'>
            <button className='carousel__arrow carousel__arrow--left'>
              <img src='/assets/icons/Vector-left.png' alt='Vector left' />
            </button>

            <div className='carousel__track'></div>

            <button className='carousel__arrow carousel__arrow--right'>
              <img src='/assets/icons/Vector-right.png' alt='Vector right' />
            </button>
          </div>

          <div className='text'>
            <span className='name'></span>
            <p className='desc'></p>
            <div className='price'></div>
          </div>

          <div className='carousel__progress'></div> */}
        </section>

        {/* ABOUT SECTION */}
        <section id='about' className='about container'>
          <h2>
            Resource is
            <span className='highlight'> the perfect and cozy place </span>
            where you can enjoy a variety of hot beverages, relax, catch up with
            friends, or get some work done.
          </h2>

          <div className='about__images'>
            <div className='about__column'>
              <img
                src='/assets/images/about-1.jpg'
                alt='about 1'
                className='img-1'
              />
              <div className='about__images-small'>
                <img
                  src='/assets/images/about-2.jpg'
                  alt='about 2'
                  className='img-4'
                />
              </div>
            </div>

            <div className='about__column'>
              <img
                src='/assets/images/about-3.jpg'
                alt='about 3'
                className='img-2'
              />
              <img
                src='/assets/images/about-4.jpg'
                alt='about 4'
                className='img-3'
              />
            </div>
          </div>
        </section>

        {/* MOBILE APP SECTION */}
        <section id='mobile-app' className='mobile-app container'>
          <div className='text-mobile'>
            <h2>
              <span className='highlight'>Download</span> our apps to start
              ordering
            </h2>
            <p>
              Download the Resource app today and experience the comfort of
              ordering your favorite coffee from wherever you are.
            </p>

            <div className='btn-mobile'>
              <button>
                <img src='/assets/icons/apple-dark.svg' alt='apple' />
                <span className='text'>
                  <span>Available on</span>
                  <strong>App Store</strong>
                </span>
              </button>

              <button>
                <img src='/assets/icons/google-dark.svg' alt='google' />
                <span className='text'>
                  <span>Available on</span>
                  <strong>Google Play</strong>
                </span>
              </button>
            </div>
          </div>

          <div className='img-mobile'>
            <img src='/assets/images/mobile-screens.png' alt='mobile-app' />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
