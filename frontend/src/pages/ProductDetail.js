import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api({
          route: `/products/${id}`,
          method: 'GET',
        });
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) return navigate('/login');
    addToCart({
      id: product.Name,
      name: product.Name,
      brand: product.Brand,
      price: parseFloat(product.Price) || 120,
      image: product['Image URL'],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!product) return null;

  return (
    <div className="product-detail">
      <div className="orb orb--1" />
      <div className="orb orb--2" />

      <button className="product-detail__back" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="product-detail__content">
        <div className="product-detail__image-zone">
          <img
            src={product['Image URL']}
            alt={product.Name}
            className="product-detail__image"
            onError={(e) => {
              e.target.src = product['Image Fallbacks']?.[0] || '';
            }}
          />
        </div>

        <div className="product-detail__info">
          <p className="product-detail__brand">{product.Brand}</p>
          <h1 className="product-detail__name">{product.Name}</h1>

          <div className="product-detail__meta">
            {product.OilType && (
              <span className="product-detail__meta-item">{product.OilType}</span>
            )}
            {product.Gender && (
              <span className="product-detail__meta-item">{product.Gender}</span>
            )}
            {product.Year && (
              <span className="product-detail__meta-item">{product.Year}</span>
            )}
          </div>

          {product['General Notes'] && (
            <div className="product-detail__notes">
              <p className="product-detail__notes-title">Notes olfactives</p>
              <div className="product-detail__notes-list">
                {product['General Notes'].map((note, i) => (
                  <span key={i} className="product-detail__note">{note}</span>
                ))}
              </div>
            </div>
          )}

          {product['Main Accords'] && (
            <div className="product-detail__accords">
              <p className="product-detail__notes-title">Accords principaux</p>
              <div className="product-detail__notes-list">
                {product['Main Accords'].map((accord, i) => (
                  <span key={i} className="product-detail__accord">{accord}</span>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail__price">
            {product.Price ? `${product.Price} €` : 'Prix sur demande'}
          </div>

          <button
            className={`product-detail__btn ${added ? 'product-detail__btn--added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? '✦ Ajouté au panier' : 'Ajouter au panier'}
          </button>

          {!user && (
            <p className="product-detail__login-hint">
              <span onClick={() => navigate('/login')}>Connectez-vous</span> pour ajouter au panier
            </p>
          )}

          {product['Purchase URL'] && (
            
              <a href={product['Purchase URL']}
              target="_blank"
              rel="noreferrer"
              className="product-detail__buy"
            >
              Acheter en ligne →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;