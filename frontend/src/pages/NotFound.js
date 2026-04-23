import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="notfound">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />

      <div className="notfound__content">
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">Page introuvable</h1>
        <p className="notfound__text">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="notfound__actions">
          <Link to="/" className="hero__btn hero__btn--primary">
            Retour à l'accueil
          </Link>
          <Link to="/catalogue" className="hero__btn hero__btn--secondary">
            Explorer le catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;