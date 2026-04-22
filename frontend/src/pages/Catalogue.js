import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api';

const PER_PAGE = 12;

const BRANDS = [
  'Toutes les marques',
  'Christian Dior',
  'Chanel',
  'Guerlain',
  'Hermès',
  'Lancôme',
  'Givenchy',
  'Giorgio Armani',
  'Yves Saint Laurent',
  'Paco Rabanne',
  'Versace',
  'El Nabil',
  'Henry Rose',
  'Juliet Rose',
  'Creed',
  'Amouroud',
  'ST. Rose',
];

const GENRES = ['Tous', 'men', 'women', 'unisex'];

const ACCORDS = [
  'Tous',
  'floral',
  'woody',
  'citrus',
  'musky',
  'amber',
  'vanilla',
  'fresh spicy',
  'warm spicy',
  'rose',
  'oud',
  'aromatic',
  'powdery',
  'gourmand',
];

function Catalogue() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeBrand, setActiveBrand] = useState('Toutes les marques');
  const [activeGenre, setActiveGenre] = useState('Tous');
  const [activeAccord, setActiveAccord] = useState('Tous');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  const fetchProducts = async (query = '') => {
    try {
      setLoading(true);
      setPage(1);
      const data = await api({
        route: `/products/search?q=${query || ''}`,
        method: 'GET',
      });
      setProducts(data);
      setActiveBrand('Toutes les marques');
      setActiveGenre('Tous');
      setActiveAccord('Tous');
      setSort('default');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (activeBrand !== 'Toutes les marques') {
      result = result.filter(p => p.Brand === activeBrand);
    }

    if (activeGenre !== 'Tous') {
      result = result.filter(p =>
        p.Gender?.toLowerCase() === activeGenre.toLowerCase()
      );
    }

    if (activeAccord !== 'Tous') {
      result = result.filter(p =>
        p['Main Accords']?.some(a =>
          a.toLowerCase().includes(activeAccord.toLowerCase())
        )
      );
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
  }, [activeBrand, activeGenre, activeAccord, sort, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const resetFilters = () => {
    setActiveBrand('Toutes les marques');
    setActiveGenre('Tous');
    setActiveAccord('Tous');
    setSort('default');
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasFilters = activeBrand !== 'Toutes les marques' ||
    activeGenre !== 'Tous' ||
    activeAccord !== 'Tous' ||
    sort !== 'default';

  return (
    <div className="page">
      <div className="orb orb--1" />
      <div className="orb orb--2" />

      <h1 className="page__title">Catalogue</h1>
      <p className="page__subtitle">Nos fragrances d'exception</p>

      <form className="catalogue__search" onSubmit={handleSearch}>
        <input
          className="catalogue__input"
          type="text"
          placeholder="Rechercher un parfum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="catalogue__btn" type="submit">
          Rechercher
        </button>
      </form>

      {/* FILTRES PAR MARQUE */}
      <div className="catalogue__section-label">Marque</div>
      <div className="catalogue__filters">
        {BRANDS.map(brand => (
          <button
            key={brand}
            className={`catalogue__filter ${activeBrand === brand ? 'catalogue__filter--active' : ''}`}
            onClick={() => setActiveBrand(brand)}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* FILTRES PAR GENRE */}
      <div className="catalogue__section-label">Genre</div>
      <div className="catalogue__filters">
        {GENRES.map(genre => (
          <button
            key={genre}
            className={`catalogue__filter ${activeGenre === genre ? 'catalogue__filter--active' : ''}`}
            onClick={() => setActiveGenre(genre)}
          >
            {genre === 'Tous' ? 'Tous' :
             genre === 'men' ? 'Homme' :
             genre === 'women' ? 'Femme' : 'Unisex'}
          </button>
        ))}
      </div>

      {/* FILTRES PAR ACCORD */}
      <div className="catalogue__section-label">Accord olfactif</div>
      <div className="catalogue__filters">
        {ACCORDS.map(accord => (
          <button
            key={accord}
            className={`catalogue__filter ${activeAccord === accord ? 'catalogue__filter--active' : ''}`}
            onClick={() => setActiveAccord(accord)}
          >
            {accord}
          </button>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="catalogue__toolbar">
        <div className="catalogue__toolbar-left">
          <p className="catalogue__count">
            {filtered.length} fragrance{filtered.length !== 1 ? 's' : ''}
            {activeBrand !== 'Toutes les marques' ? ` · ${activeBrand}` : ''}
            {activeGenre !== 'Tous' ? ` · ${activeGenre === 'men' ? 'Homme' : activeGenre === 'women' ? 'Femme' : 'Unisex'}` : ''}
            {activeAccord !== 'Tous' ? ` · ${activeAccord}` : ''}
          </p>
          {hasFilters && (
            <button className="catalogue__reset" onClick={resetFilters}>
              Réinitialiser les filtres ×
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

      {loading ? (
        <div className="loading">Chargement des fragrances...</div>
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
    </div>
  );
}

export default Catalogue;