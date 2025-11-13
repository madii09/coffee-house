import React, { useEffect, useState } from 'react';
import '../styles/_menu.scss';
import type { MenuItem } from '../types/types';
import images from '../data/images.json';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../zustand/useAuthStore';
import { useCartStore } from '../zustand/useCartStore';
import type { CartItem } from '../zustand/useCartStore';

interface ModalProps {
  item: MenuItem;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAdditives, setSelectedAdditives] = useState<Set<number>>(
    new Set()
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [imageSrc, setImageSrc] = useState<string>('/placeholder.png');
  const [totalPriceOriginal, setTotalPriceOriginal] = useState<number>(0);

  const currentUser = useAuthStore((state) => state.currentUser);
  const addItem = useCartStore((state) => state.addItem);

  const navigate = useNavigate();

  useEffect(() => {
    const matched = images.find(
      (img) => img.name.toLowerCase() === item.name.toLowerCase()
    );
    setImageSrc(
      matched ? `/assets/images/${matched.image}` : '/placeholder.png'
    );
  }, [item]);

  useEffect(() => {
    if (item.sizes && item.sizes['s']) {
      setSelectedSize('s');
    } else {
      const firstSizeKey = item.sizes ? Object.keys(item.sizes)[0] : null;
      setSelectedSize(firstSizeKey);
    }
  }, [item]);

  useEffect(() => {
    if (!selectedSize || !item.sizes) return;

    const sizeData = item.sizes[selectedSize];
    if (!sizeData) return;

    const sizePrice = Number(sizeData.price ?? item.price ?? 0);
    const sizeDiscountPrice =
      currentUser && sizeData.discountPrice != null
        ? Number(sizeData.discountPrice)
        : sizePrice;

    let additivesPrice = 0;
    let additivesOriginalPrice = 0;

    Array.from(selectedAdditives).forEach((idx) => {
      const add = item.additives?.[idx];
      if (!add) return;

      const addPrice = Number(add.price);
      const addDiscountPrice =
        currentUser && add.discountPrice != null
          ? Number(add.discountPrice)
          : addPrice;

      additivesPrice += addDiscountPrice;
      additivesOriginalPrice += addPrice;
    });

    const originalTotal = sizePrice + additivesOriginalPrice;
    const discountedTotal = sizeDiscountPrice + additivesPrice;

    setTotalPriceOriginal(originalTotal);
    setTotalPrice(discountedTotal);
  }, [selectedSize, selectedAdditives, item, currentUser]);

  const toggleAdditive = (idx: number) => {
    setSelectedAdditives((prev) => {
      const newSet = new Set(prev);
      newSet.has(idx) ? newSet.delete(idx) : newSet.add(idx);
      return newSet;
    });
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    if (!selectedSize) return;

    const extras = Array.from(selectedAdditives).map((idx) => {
      const add = item.additives![idx];
      return {
        ...add,
        price: Number(add.price),
        discountPrice: add.discountPrice
          ? Number(add.discountPrice)
          : undefined,
      };
    });

    const sizePrice =
      selectedSize && item.sizes
        ? Number(item.sizes[selectedSize].price)
        : Number(item.price ?? 0);

    const extrasPrice = extras.reduce((sum, add) => sum + add.price, 0);

    const cartItem: CartItem = {
      id: Number(item.id),
      name: item.name,
      image: imageSrc,
      size: {
        key: selectedSize,
        label: selectedSize,
        price: sizePrice,
      },
      extras,
      quantity: 1,
      basePrice: totalPriceOriginal,
      totalPrice,
      discountPrice:
        currentUser && totalPrice < totalPriceOriginal ? totalPrice : undefined,
    };

    addItem(cartItem);
    navigate('/cart');
  };

  return (
    <div className='modal' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <button className='modal-close-btn' onClick={onClose}>
            &times;
          </button>
        </div>

        <div className='modal-body'>
          <img src={imageSrc} alt={item.name} />

          <div className='modal-info'>
            <h2>{item.name}</h2>
            <p className='description'>{item.description}</p>

            <div className='modal-section'>
              <h4>Size</h4>
              <div className='options'>
                {item.sizes &&
                  Object.entries(item.sizes).map(([key, size]) => (
                    <button
                      key={key}
                      className={selectedSize === key ? 'active' : ''}
                      onClick={() => setSelectedSize(key)}
                    >
                      <span className='number'>{key.toUpperCase()}</span>{' '}
                      {size.size}
                    </button>
                  ))}
              </div>
            </div>

            <div className='modal-section'>
              <h4>Additives</h4>
              <div className='options'>
                {item.additives?.map((add, idx) => (
                  <button
                    key={idx}
                    className={selectedAdditives.has(idx) ? 'active' : ''}
                    onClick={() => toggleAdditive(idx)}
                  >
                    {add.name}
                  </button>
                ))}
              </div>
            </div>

            <div className='price-section'>
              <span>Total: </span>
              <div>
                {currentUser && totalPrice < totalPriceOriginal ? (
                  <>
                    <span
                      style={{
                        textDecoration: 'line-through',
                        marginRight: '0.5rem',
                        color: '#888',
                      }}
                    >
                      ${totalPriceOriginal.toFixed(2)}
                    </span>
                    <span style={{ color: '#403F3D', fontWeight: 600 }}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>${totalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <button className='modal-add-to-cart' onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
