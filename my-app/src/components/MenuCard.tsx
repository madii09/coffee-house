import React from 'react';
import type { MenuItem } from '../types/types';

interface MenuCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  isLoggedIn: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onClick, isLoggedIn }) => {
  const price = Number(item.price ?? 0);
  const discount = item.discountPrice ? Number(item.discountPrice) : null;

  const displayPrice =
    isLoggedIn && discount && discount < price ? discount : price;
  const showOriginalPrice = isLoggedIn && discount && discount < price;

  return (
    <div className='menu-card' onClick={() => onClick(item)}>
      <img src={item.image ?? '/placeholder.png'} alt={item.name} />
      <div className='menu-info'>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className='prices'>
          {showOriginalPrice && (
            <span className='original-price line-through text-gray-500'>
              ${price.toFixed(2)}
            </span>
          )}
          <span
            className={`price ${
              showOriginalPrice
                ? 'discount-price text-red-600 font-semibold'
                : 'font-semibold'
            }`}
          >
            ${displayPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
