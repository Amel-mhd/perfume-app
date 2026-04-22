import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const questions = [
  {
    id: 1,
    question: 'Quelle ambiance vous attire le plus ?',
    options: [
      { label: '🌸 Floral & romantique', value: 'rose' },
      { label: '🌲 Boisé & mystérieux', value: 'woody' },
      { label: '🍋 Frais & pétillant', value: 'citrus' },
      { label: '🍬 Doux & gourmand', value: 'vanilla' },
    ]
  },
  {
    id: 2,
    question: 'Quel moment préférez-vous ?',
    options: [
      { label: '🌅 Matin ensoleillé', value: 'citrus' },
      { label: '🌙 Soirée élégante', value: 'musky' },
      { label: '🍂 Après-midi automnal', value: 'woody' },
      { label: '🌸 Printemps en fleurs', value: 'rose' },
    ]
  },
  {
    id: 3,
    question: 'Quel est votre style ?',
    options: [
      { label: '👑 Luxueux & raffiné', value: 'oud' },
      { label: '🤍 Minimaliste & épuré', value: 'musky' },
      { label: '🌿 Naturel & authentique', value: 'woody' },
      { label: '💫 Romantique & poétique', value: 'rose' },
    ]
  },
  {
    id: 4,
    question: 'Quelle sensation recherchez-vous ?',
    options: [
      { label: '✨ Légèreté & fraîcheur', value: 'citrus' },
      { label: '🔥 Chaleur & sensualité', value: 'vanilla' },
      { label: '🌊 Profondeur & caractère', value: 'oud' },
      { label: '🕊️ Douceur & sérénité', value: 'musky' },
    ]
  },
];

const ACCORD_MAP = {
  rose: ['rose', 'floral', 'white floral'],
  woody: ['woody', 'wood', 'earthy', 'aromatic'],
  citrus: ['citrus', 'fresh', 'fresh spicy'],
  vanilla: ['vanilla', 'gourmand', 'sweet'],
  musky: ['musky', 'powdery', 'soft spicy'],
  oud: ['oud', 'amber', 'warm spicy', 'balsamic'],
};

function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = async (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const frequency = {};
      newAnswers.forEach((a) => {
        frequency[a] = (frequency[a] || 0) + 1;
      });
      const dominant = Object.keys(frequency).reduce((a, b) =>
        frequency[a] > frequency[b] ? a : b
      );

      try {
        setLoading(true);
        const keywords = ACCORD_MAP[dominant] || [dominant];

        const allData = await api({ route: '/products/search?q=', method: 'GET' });

        const scored = allData.map(p => {
          let score = 0;
          const accords = p['Main Accords'] || [];
          const notes = p['General Notes'] || [];
          keywords.forEach(kw => {
            if (accords.some(a => a.toLowerCase().includes(kw))) score += 2;
            if (notes.some(n => n.toLowerCase().includes(kw))) score += 1;
          });
          return { ...p, score };
        });

        const top = scored
          .filter(p => p.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);

        setResults(top.length > 0 ? top : allData.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
  };

  const progress = (currentQuestion / questions.length) * 100;

  if (loading) return <div className="loading">Analyse de vos préférences...</div>;

  return (
    <div className="quiz-page">
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />

      {!results ? (
        <div className="quiz-card">
          <p className="quiz-tagline">Guide olfactif</p>
          <h1 className="quiz-title">Quel est votre parfum ?</h1>

          <div className="quiz-progress">
            <div className="quiz-progress__bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="quiz-step">{currentQuestion + 1} / {questions.length}</p>

          <h2 className="quiz-question">
            {questions[currentQuestion].question}
          </h2>

          <div className="quiz-options">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.value}
                className="quiz-option"
                onClick={() => handleAnswer(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <p className="quiz-tagline">Résultats</p>
          <h1 className="quiz-title">Vos fragrances idéales</h1>
          <p className="quiz-subtitle">Sélectionnées spécialement pour vous</p>

          <div className="grid" style={{ marginTop: '48px' }}>
            {results.map((product, index) => (
              <div
                key={index}
                className="product-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/product/${encodeURIComponent(product.Name)}`)}
              >
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
            ))}
          </div>

          <div className="quiz-results__actions">
            <button className="quiz-restart" onClick={restart}>
              Recommencer le quiz
            </button>
            <button className="quiz-catalogue" onClick={() => navigate('/catalogue')}>
              Voir tout le catalogue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;