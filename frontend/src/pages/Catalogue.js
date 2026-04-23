import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api';

const PER_PAGE = 12;

const BRANDS = [
  'Christian Dior', 'Chanel', 'Guerlain', 'Hermès', 'Lancôme',
  'Givenchy', 'Giorgio Armani', 'Yves Saint Laurent', 'Paco Rabanne',
  'Versace', 'El Nabil', 'Henry Rose', 'Juliet Rose', 'Creed',
  'Amouroud', 'ST. Rose',
];

const GENRES = ['men', 'women', 'unisex'];

const ACCORDS = [
  'floral', 'woody', 'citrus', 'musky', 'amber', 'vanilla',
  'fresh spicy', 'warm spicy', 'rose', 'oud', 'aromatic',
  'powdery', 'gourmand',
];

function Catalogue() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeBrands, setActiveBrands] = useState([]);
  const [activeGenres, setActiveGenres] = useState([]);
  const [activeAccords, setActiveAccords] = useState([]);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [showTop, setShowTop] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = async (query = '') => {
    try {
      setLoading(true);
      setPage(1);
      const data = await api({
        route: `/products/search?q=${query || ''}`,
        method: 'GET',
      });
      setProducts(data);
      setActiveBrands([]);
      setActiveGenres([]);
      setActiveAccords([]);
      setSort('default');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Recherche en temps réel
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Bouton retour en haut
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let result = [...products];

    if (activeBrands.length > 0) {
      result = result.filter(p => activeBrands.includes(p.Brand));
    }

    if (activeGenres.length > 0) {
      result = result.filter(p =>
        activeGenres.includes(p.Gender?.toLowerCase())
      );
    }

    if (activeAccords.length > 0) {
      result = result.filter(p =>
        activeAccords.some(acc =>
          p['Main Accords']?.some(a => a.toLowerCase().includes(acc))
        )
      );
    }

    if (minPrice !== '') {
      result = result.filter(p => parseFloat(p.Price || 0) >= parseFloat(minPrice));
    }

    if (maxPrice !== '') {
      result = result.filter(p => parseFloat(p.Price || 0) <= parseFloat(maxPrice));
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => parseFloat(a.Price || 0) - parseFloat(b.Price || 0));
    } else if (sort === 'price-desc') {
      result.sort((a, b) => parseFloat(b.Price || 0) - parseFloat(a.Price || 0));
    } else if (sort === 'rating') {
      result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    }

    setFiltered(result);
    setPage(1);
  }, [activeBrands, activeGenres, activeAccords, sort, products, minPrice, maxPrice]);

  const toggleBrand = (brand) => {
    setActiveBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleGenre = (genre) => {
    setActiveGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleAccord = (accord) => {
    setActiveAccords(prev =>
      prev.includes(accord) ? prev.filter(a => a !== accord) : [...prev, accord]
    );
  };

  const resetFilters = () => {
    setActiveBrands([]);
    setActiveGenres([]);
    setActiveAccords([]);
    setSort('default');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = activeBrands.length + activeGenres.length + activeAccords.length +
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  return (
    <div className="page">
      <div className="orb orb--1" />
      <div className="orb orb--2" />

      <h1 className="page__title">Catalogue</h1>
      <p className="page__subtitle">Nos fragrances d'exception</p>

      {/* RECHERCHE EN TEMPS RÉEL */}
      <form className="catalogue__search" onSubmit={(e) => e.preventDefault()}>
        <input
          className="catalogue__input"
          type="text"
          placeholder="Rechercher un parfum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="catalogue__btn"
            type="button"
            onClick={() => setSearch('')}
          >
            ×
          </button>
        )}
      </form>

      {/* TOOLBAR */}
      <div className="catalogue__toolbar">
        <div className="catalogue__toolbar-left">
          <button
            className={`catalogue__filter-btn ${showFilters ? 'catalogue__filter-btn--active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            ✦ Filtrer
            {activeCount > 0 && (
              <span className="catalogue__filter-count">{activeCount}</span>
            )}
          </button>
          <p className="catalogue__count">
            {filtered.length} fragrance{filtered.length !== 1 ? 's' : ''}
          </p>
          {activeCount > 0 && (
            <button className="catalogue__reset" onClick={resetFilters}>
              Réinitialiser ×
            </button>
          )}
        </div>
        <select
          className="catalogue__sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Tri par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Mieux notés</option>
        </select>
      </div>

      {/* PANNEAU FILTRES */}
      {showFilters && (
        <div className="catalogue__panel">
          <div className="catalogue__panel-section">
            <p className="catalogue__panel-title">Marque</p>
            <div className="catalogue__panel-options">
              {BRANDS.map(brand => (
                <button
                  key={brand}
                  className={`catalogue__chip ${activeBrands.includes(brand) ? 'catalogue__chip--active' : ''}`}
                  onClick={() => toggleBrand(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="catalogue__panel-section">
            <p className="catalogue__panel-title">Genre</p>
            <div className="catalogue__panel-options">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  className={`catalogue__chip ${activeGenres.includes(genre) ? 'catalogue__chip--active' : ''}`}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre === 'men' ? 'Homme' : genre === 'women' ? 'Femme' : 'Unisex'}
                </button>
              ))}
            </div>
          </div>

          <div className="catalogue__panel-section">
            <p className="catalogue__panel-title">Accord olfactif</p>
            <div className="catalogue__panel-options">
              {ACCORDS.map(accord => (
                <button
                  key={accord}
                  className={`catalogue__chip ${activeAccords.includes(accord) ? 'catalogue__chip--active' : ''}`}
                  onClick={() => toggleAccord(accord)}
                >
                  {accord}
                </button>
              ))}
            </div>
          </div>

          <div className="catalogue__panel-section">
            <p className="catalogue__panel-title">Prix (€)</p>
            <div className="catalogue__price-range">
              <input
                className="catalogue__price-input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="catalogue__price-sep">—</span>
              <input
                className="catalogue__price-input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* SKELETON / GRILLE */}
      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton--image" />
              <div className="skeleton-card__body">
                <div className="skeleton skeleton--text skeleton--short" />
                <div className="skeleton skeleton--text" />
                <div className="skeleton skeleton--text skeleton--medium" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {paginated.length === 0 ? (
            <div className="favorites__empty">
              <p className="favorites__empty-text">Aucun parfum trouvé</p>
              <button className="catalogue__btn" onClick={resetFilters}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid">
              {paginated.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  onClick={() => navigate(`/product/${encodeURIComponent(product.Name)}`)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__btn"
                onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                disabled={page === 1}
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`pagination__num ${n === page ? 'pagination__num--active' : ''}`}
                  onClick={() => { setPage(n); window.scrollTo(0, 0); }}
                >
                  {n}
                </button>
              ))}
              <button
                className="pagination__btn"
                onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                disabled={page === totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      {/* BOUTON RETOUR EN HAUT */}
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

export default Catalogue;