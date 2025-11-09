import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/_menu.scss';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import { fetchMenuItems, fetchMenuItemById } from '../services/api';
import type { MenuItem } from '../types/types';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState<'coffee' | 'tea' | 'dessert'>(
    'coffee'
  );
  const [items, setItems] = useState<MenuItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchMenuItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch menu items', err);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const filtered = items.filter((it) => it.category === category);
  const visibleItems = filtered.slice(0, visibleCount);

  const handleCardClick = async (item: MenuItem) => {
    try {
      setModalLoading(true);
      const fullItem = await fetchMenuItemById(Number(item.id));
      setSelectedItem(fullItem);
    } catch (err) {
      console.error('Failed to fetch item details', err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className='menu container'>
        <section className='menu-text'>
          <h1 className='main-title'>
            Behind each of our cups hides an{' '}
            <span className='highlight'>amazing surprise</span>
          </h1>
        </section>

        <section className='menu-section'>
          <div className='menu-nav'>
            {['coffee', 'tea', 'dessert'].map((cat) => (
              <button
                key={cat}
                className={`menu-btn ${category === cat ? 'active' : ''}`}
                onClick={() => {
                  setCategory(cat as 'coffee' | 'tea' | 'dessert');
                  setVisibleCount(4);
                }}
              >
                <img src={`/assets/icons/${cat}.png`} alt={cat} />
                {cat[0].toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading menu...</p>
          ) : (
            <div id='menu-items' className='menu-items'>
              {visibleItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onClick={handleCardClick}
                  isLoggedIn={!!currentUser}
                />
              ))}
            </div>
          )}

          {filtered.length > visibleCount && (
            <button
              id='loadMoreBtn'
              className='load-more-btn'
              onClick={() => setVisibleCount((prev) => prev + 4)}
            >
              Load More
            </button>
          )}
        </section>

        {modalLoading && <p className='text-center'>Loading details...</p>}

        {selectedItem && (
          <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </main>

      <Footer />
    </>
  );
};

export default Menu;
