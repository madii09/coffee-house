import React from 'react';
import type { MenuItem } from '../types/types';

interface Props {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

const MenuCard: React.FC<Props> = ({ item, onClick }) => {
  // Ensure price and discount are always numbers
  const price = Number(item.price ?? 0);
  const discount = item.discountPrice ? Number(item.discountPrice) : null;

  return (
    <div className='menu-card' onClick={() => onClick(item)}>
      <img src={item.image ?? '/placeholder.png'} alt={item.name} />
      <div className='menu-info'>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className='prices'>
          {discount && discount < price ? (
            <>
              <span className='original-price line-through text-gray-500'>
                ${price.toFixed(2)}
              </span>
              <span className='discount-price text-red-600 font-semibold'>
                ${discount.toFixed(2)}
              </span>
            </>
          ) : (
            <span className='price font-semibold'>${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
