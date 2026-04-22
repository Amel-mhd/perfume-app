import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const favCount = user
    ? JSON.parse(localStorage.getItem(`favorites_${user.email}`) || '[]').length
    : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Aura
      </Link>

      <ul className="navbar__links">
        <li><Link to="/" className="navbar__link">Accueil</Link></li>
        <li><Link to="/catalogue" className="navbar__link">Catalogue</Link></li>
        <li><Link to="/quiz" className="navbar__link">Quiz</Link></li>
      </ul>

      <div className="navbar__actions">

        {user && (
          <Link to="/favorites" className="navbar__icon">
            ♡
            {favCount > 0 && (
              <span className="navbar__badge">{favCount}</span>
            )}
          </Link>
        )}

        <Link to="/cart" className="navbar__icon">
          🛒
          {cart.length > 0 && (
            <span className="navbar__badge">{cart.length}</span>
          )}
        </Link>

        {user ? (
          <div className="navbar__user">
            <span className="navbar__username">{user.username}</span>
            <button className="navbar__logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="navbar__auth">
            <Link to="/login" className="navbar__btn">Connexion</Link>
            <Link to="/register" className="navbar__btn navbar__btn--primary">
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;