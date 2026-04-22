import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`favorites_${user.email}`);
    if (stored) setFavorites(JSON.parse(stored));
  }, [user]);

  const removeFavorite = (productName) => {
    const updated = favorites.filter(p => p.Name !== productName);
    setFavorites(updated);
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updated));
  };

  if (!user) {
    return (
      <div className="page">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <h1 className="page__title">Favoris</h1>
        <p className="page__subtitle">Vos fragrances préférées</p>
        <div className="favorites__empty">
          <p className="favorites__empty-text">
            Connectez-vous pour accéder à vos favoris
          </p>
          <button className="catalogue__btn" onClick={() => navigate('/login')}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="orb orb--1" />
      <div className="orb orb--2" />

      <h1 className="page__title">Favoris</h1>
      <p className="page__subtitle">
        {favorites.length} fragrance{favorites.length !== 1 ? 's' : ''} sauvegardée{favorites.length !== 1 ? 's' : ''}
      </p>

      {favorites.length === 0 ? (
        <div className="favorites__empty">
          <p className="favorites__empty-text">
            Vous n'avez pas encore de favoris
          </p>
          <button className="catalogue__btn" onClick={() => navigate('/catalogue')}>
            Explorer le catalogue
          </button>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((product, index) => (
            <div key={index} className="favorites__item">
              <ProductCard
                product={product}
                onClick={() => navigate(`/product/${encodeURIComponent(product.Name)}`)}
              />
              <button
                className="favorites__remove"
                onClick={() => removeFavorite(product.Name)}
              >
                Retirer des favoris
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;