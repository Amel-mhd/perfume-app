import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';
import api from '../api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api({
          route: `/products/${id}`,
          method: 'GET',
        });
        setProduct(data);

        if (data['Main Accords']?.length > 0) {
          const accord = data['Main Accords'][0];
          const allProducts = await api({
            route: `/products/search?q=${accord}`,
            method: 'GET',
          });
          const filtered = allProducts
            .filter(p => p.Name !== data.Name)
            .slice(0, 4);
          setSimilar(filtered);
        }

        try {
          const reviewsData = await api({
            route: `/reviews/${encodeURIComponent(id)}`,
            method: 'GET',
          });
          setReviews(reviewsData);
        } catch (e) {
          setReviews([]);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      addToast('Connectez-vous pour ajouter au panier', 'error');
      return navigate('/login');
    }
    addToCart({
      id: product.Name,
      name: product.Name,
      brand: product.Brand,
      price: parseFloat(product.Price) || 120,
      image: product['Image URL'],
    });
    addToast(`${product.Name} ajouté au panier ✦`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async () => {
    setReviewError('');
    setReviewSuccess('');
    if (!comment.trim()) return setReviewError('Écrivez un commentaire');
    try {
      const newReview = await api({
        route: '/reviews',
        method: 'POST',
        data: { productName: product.Name, rating, comment },
        token,
      });
      setReviews(prev => [newReview, ...prev]);
      setComment('');
      setRating(5);
      setReviewSuccess('Avis publié !');
      addToast('Votre avis a été publié ✦');
    } catch (err) {
      setReviewError(err.message || 'Erreur');
      addToast('Erreur lors de la publication', 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api({ route: `/reviews/${reviewId}`, method: 'DELETE', token });
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      addToast('Avis supprimé');
    } catch (err) {
      addToast('Erreur lors de la suppression', 'error');
    }
  };

  if (loading) return (
    <div className="product-detail">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="product-detail__content">
        <div className="skeleton skeleton--image" style={{ height: 600 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
          <div className="skeleton skeleton--text skeleton--short" />
          <div className="skeleton skeleton--text" style={{ height: 40 }} />
          <div className="skeleton skeleton--text skeleton--medium" />
          <div className="skeleton skeleton--text" />
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

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
            {product.rating && (
              <span className="product-detail__meta-item">★ {product.rating}</span>
            )}
            {avgRating && (
              <span className="product-detail__meta-item">
                ★ {avgRating} ({reviews.length} avis)
              </span>
            )}
          </div>

          {(product.Longevity || product.Sillage) && (
            <div className="product-detail__meta" style={{ marginTop: 0 }}>
              {product.Longevity && (
                <span className="product-detail__meta-item">
                  Tenue : {product.Longevity}
                </span>
              )}
              {product.Sillage && (
                <span className="product-detail__meta-item">
                  Sillage : {product.Sillage}
                </span>
              )}
            </div>
          )}

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

          {product.Notes && (
            <div className="product-detail__notes">
              <p className="product-detail__notes-title">Pyramide olfactive</p>
              <div className="product-detail__pyramid">
                {product.Notes.Top?.length > 0 && (
                  <div className="product-detail__pyramid-row">
                    <span className="product-detail__pyramid-label">Tête</span>
                    <div className="product-detail__notes-list">
                      {product.Notes.Top.map((n, i) => (
                        <span key={i} className="product-detail__note">{n.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                {product.Notes.Middle?.length > 0 && (
                  <div className="product-detail__pyramid-row">
                    <span className="product-detail__pyramid-label">Cœur</span>
                    <div className="product-detail__notes-list">
                      {product.Notes.Middle.map((n, i) => (
                        <span key={i} className="product-detail__note">{n.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                {product.Notes.Base?.length > 0 && (
                  <div className="product-detail__pyramid-row">
                    <span className="product-detail__pyramid-label">Fond</span>
                    <div className="product-detail__notes-list">
                      {product.Notes.Base.map((n, i) => (
                        <span key={i} className="product-detail__note">{n.name}</span>
                      ))}
                    </div>
                  </div>
                )}
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
            <a
              href={product['Purchase URL']}
              target="_blank"
              rel="noreferrer"
              className="product-detail__buy"
            >
              Acheter en ligne →
            </a>
          )}
        </div>
      </div>

      {/* PARFUMS SIMILAIRES */}
      {similar.length > 0 && (
        <div className="product-detail__similar">
          <h2 className="product-detail__similar-title">Vous aimerez aussi</h2>
          <p className="product-detail__similar-subtitle">
            Fragrances aux accords similaires
          </p>
          <div className="grid">
            {similar.map((p, i) => (
              <ProductCard
                key={i}
                product={p}
                onClick={() => navigate(`/product/${encodeURIComponent(p.Name)}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* AVIS */}
      <div className="product-detail__reviews">
        <h2 className="product-detail__similar-title">Avis clients</h2>
        <p className="product-detail__similar-subtitle">
          {reviews.length} avis{avgRating ? ` · ★ ${avgRating} / 5` : ''}
        </p>

        {user ? (
          <div className="review__form">
            <h3 className="review__form-title">Laisser un avis</h3>
            {reviewError && <p className="auth-error">{reviewError}</p>}
            {reviewSuccess && <p className="auth-success">{reviewSuccess}</p>}
            <div className="review__stars-select">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={`review__star-btn ${n <= rating ? 'review__star-btn--active' : ''}`}
                  onClick={() => setRating(n)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="review__textarea"
              placeholder="Votre avis..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <button
              className="product-detail__btn"
              style={{ width: 'auto', padding: '14px 36px' }}
              onClick={handleReview}
            >
              Publier l'avis
            </button>
          </div>
        ) : (
          <p className="review__empty">
            <span
              style={{ color: '#D4AF6A', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Connectez-vous
            </span>{' '}
            pour laisser un avis
          </p>
        )}

        <div className="review__list">
          {reviews.length === 0 ? (
            <p className="review__empty">
              Aucun avis pour l'instant — soyez le premier !
            </p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review__item">
                <div className="review__header">
                  <div className="review__avatar">
                    {r.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="review__username">{r.username}</p>
                    <div className="review__stars">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span
                          key={n}
                          className={n <= r.rating ? 'review__star--filled' : 'review__star--empty'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="review__date">
                    {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  {user && r.userId === user.id && (
                    <button
                      className="review__delete"
                      onClick={() => handleDeleteReview(r._id)}
                    >
                      ×
                    </button>
                  )}
                </div>
                <p className="review__comment">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {showTop && (
        <button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default ProductDetail;