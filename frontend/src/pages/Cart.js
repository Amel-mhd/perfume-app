import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!user) {
    return (
      <div className="page">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <h1 className="page__title">Panier</h1>
        <p className="page__subtitle">Vos articles sélectionnés</p>
        <div className="favorites__empty">
          <p className="favorites__empty-text">
            Connectez-vous pour accéder à votre panier
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

      <h1 className="page__title">Panier</h1>
      <p className="page__subtitle">
        {cart.length} article{cart.length !== 1 ? 's' : ''}
      </p>

      {cart.length === 0 ? (
        <div className="favorites__empty">
          <p className="favorites__empty-text">Votre panier est vide</p>
          <button className="catalogue__btn" onClick={() => navigate('/catalogue')}>
            Explorer le catalogue
          </button>
        </div>
      ) : (
        <div className="cart">
          <div className="cart__items">
            {cart.map((item, index) => (
              <div key={index} className="cart__item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart__item-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="cart__item-info">
                  <p className="cart__item-brand">{item.brand}</p>
                  <h3 className="cart__item-name">{item.name}</h3>
                  <p className="cart__item-price">{item.price} €</p>
                </div>
                <div className="cart__item-actions">
                  <div className="cart__qty">
                    <button
                      className="cart__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="cart__qty-num">{item.quantity}</span>
                    <button
                      className="cart__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart__item-subtotal">
                    {(item.price * item.quantity).toFixed(2)} €
                  </p>
                  <button
                    className="cart__item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart__summary">
            <div className="cart__summary-line">
              <span>Sous-total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="cart__summary-line">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>
            <div className="cart__summary-total">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <button className="cart__checkout">
              Commander
            </button>
            <button className="cart__clear" onClick={clearCart}>
              Vider le panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;