import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import './ProductCard.css';

function ProductCard({ product, onClick }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`favorites_${user.email}`);
    if (stored) {
      const favs = JSON.parse(stored);
      setIsFav(favs.some(p => p.Name === product.Name));
    }
  }, [user, product.Name]);

  const toggleFav = (e) => {
    e.stopPropagation();
    if (!user) {
      addToast('Connectez-vous pour ajouter aux favoris', 'error');
      return;
    }
    const stored = localStorage.getItem(`favorites_${user.email}`);
    const favs = stored ? JSON.parse(stored) : [];
    let updated;
    if (isFav) {
      updated = favs.filter(p => p.Name !== product.Name);
      addToast(`${product.Name} retiré des favoris`);
    } else {
      updated = [...favs, product];
      addToast(`${product.Name} ajouté aux favoris ♡`);
    }
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updated));
    setIsFav(!isFav);
  };

  return (
    <div className="product-card" onClick={onClick}>
      <button className="product-card__fav" onClick={toggleFav}>
        {isFav ? '♥' : '♡'}
      </button>

      {product['Image URL'] ? (
        <img
          src={product['Image URL']}
          alt={product.Name}
          className="product-card__image"
          onError={(e) => {
            e.target.src = product['Image Fallbacks']?.[0] || '';
          }}
        />
      ) : (
        <div className="product-card__no-image">✦</div>
      )}
      <div className="product-card__body">
        <p className="product-card__brand">{product.Brand}</p>
        <h3 className="product-card__name">{product.Name}</h3>
        <p className="product-card__price">
          {product.Price ? `${product.Price} €` : ''}
        </p>
        <div className="product-card__notes">
          {product['General Notes']?.slice(0, 3).map((note, i) => (
            <span key={i} className="product-card__note">{note}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;