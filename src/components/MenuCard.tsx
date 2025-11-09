import React from 'react';
import type { MenuItem } from '../types/types';

interface MenuCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  isLoggedIn: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onClick, isLoggedIn }) => {
  const price = Number(item.price ?? 0);
  const discountPrice = item.discountPrice ? Number(item.discountPrice) : null;

  const showDiscount =
    isLoggedIn && discountPrice !== null && discountPrice < price;

  return (
    <div className='menu-card' onClick={() => onClick(item)}>
      <img src={item.image ?? '/placeholder.png'} alt={item.name} />
      <div className='menu-info'>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className='prices'>
          {showDiscount && (
            <span className='original-price line-through text-gray-500 mr-2'>
              ${price.toFixed(2)}
            </span>
          )}
          <span
            className={`price font-semibold ${
              showDiscount ? 'text-red-600' : ''
            }`}
          >
            ${showDiscount ? discountPrice!.toFixed(2) : price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
