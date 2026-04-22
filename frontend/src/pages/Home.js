import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />

      <section className="hero">
        <div className="hero__content">
          <p className="hero__tagline">Maison de Parfums</p>
          <h1 className="hero__title">Aura</h1>
          <p className="hero__subtitle">
            Découvrez des fragrances d'exception,<br />
            créées pour révéler votre essence.
          </p>
          <div className="hero__actions">
            <Link to="/catalogue" className="hero__btn hero__btn--primary">
              Explorer le catalogue
            </Link>
            <Link to="/quiz" className="hero__btn hero__btn--secondary">
              Trouver mon parfum
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__circle">
            <div className="hero__circle-inner" />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <span className="feature__icon">✦</span>
          <h3 className="feature__title">Sélection d'exception</h3>
          <p className="feature__text">Des parfums soigneusement sélectionnés parmi les plus grandes maisons.</p>
        </div>
        <div className="feature">
          <span className="feature__icon">✦</span>
          <h3 className="feature__title">Quiz olfactif</h3>
          <p className="feature__text">Découvrez le parfum qui vous correspond grâce à notre guide personnalisé.</p>
        </div>
        <div className="feature">
          <span className="feature__icon">✦</span>
          <h3 className="feature__title">Livraison soignée</h3>
          <p className="feature__text">Chaque commande est emballée avec soin dans un écrin luxueux.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;