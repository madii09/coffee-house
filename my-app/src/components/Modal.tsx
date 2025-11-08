import React from 'react';
import '../styles/_modal.scss';
import type { MenuItem } from '../types/types';

interface ModalProps {
  item: MenuItem;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
  return (
    <div className='modal' id='item-modal' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-body'>
          <img
            id='modal-img'
            src={item.image ?? '/placeholder.png'}
            alt={item.name}
          />
          <div className='modal-info'>
            <h2 id='modal-name'>{item.name}</h2>
            <p id='modal-desc' className='description'>
              {item.description}
            </p>

            <div className='modal-section'>
              <h4>Size</h4>
              <div id='size-options' className='options'>
                {/* You can render item.sizes here later */}
              </div>
            </div>

            <div className='modal-section'>
              <h4>Additives</h4>
              <div id='additive-options' className='options'>
                {/* You can render item.additives here later */}
              </div>
            </div>

            <div className='price-section'>
              <span>Total: </span>
              <span>
                $
                <span id='modal-price'>{item.discountPrice ?? item.price}</span>
              </span>
            </div>

            <hr />

            <div className='discount'>
              <p>
                The cost is not final. Download our mobile app to see the final
                price and place your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
