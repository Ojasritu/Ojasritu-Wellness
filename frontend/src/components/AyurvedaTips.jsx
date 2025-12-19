import React, { useState, useEffect } from 'react';
import './AyurvedaTips.css';

const AyurvedaTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('hi');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tipType, setTipType] = useState('all');

  useEffect(() => {
    fetchTips();
  }, [language, tipType]);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/ayurveda-tips/?language=${language}&type=${tipType}`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setTips(data.tips);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTip = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length);
  };

  const currentTip = tips[currentIndex];

  const tipTypeOptions = [
    { value: 'all', label: language === 'hi' ? 'सभी' : 'All' },
    { value: 'diet', label: language === 'hi' ? 'आहार' : 'Diet' },
    { value: 'lifestyle', label: language === 'hi' ? 'जीवनशैली' : 'Lifestyle' },
    { value: 'dosha', label: language === 'hi' ? 'दोष' : 'Dosha' },
    { value: 'seasonal', label: language === 'hi' ? 'मौसमी' : 'Seasonal' },
  ];

  return (
    <div className="ayurveda-tips-container">
      <div className="tips-header">
        <h1 className="tips-title">🌿 आयुर्वेद टिप्स / Ayurveda Tips</h1>
        <p className="tips-subtitle">
          {language === 'hi'
            ? 'प्रतिदिन आयुर्वेद के साथ स्वस्थ रहें'
            : 'Stay healthy with Ayurveda every day'}
        </p>
      </div>

      {/* Language & Type Selector */}
      <div className="tips-controls">
        <div className="language-selector">
          <button
            className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
            onClick={() => setLanguage('hi')}
          >
            हिंदी
          </button>
          <button
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
        </div>

        <div className="type-selector">
          {tipTypeOptions.map((option) => (
            <button
              key={option.value}
              className={`type-btn ${tipType === option.value ? 'active' : ''}`}
              onClick={() => setTipType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Carousel */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
        </div>
      ) : tips.length > 0 ? (
        <div className="tips-carousel">
          <div className="carousel-content">
            <div className="tip-card">
              {/* Tip Title */}
              <div className="tip-header">
                <h2 className="tip-title">{currentTip.title}</h2>
                <span className="tip-category">{currentTip.category}</span>
              </div>

              {/* Slok (Sanskrit Verse) */}
              {currentTip.slok && (
                <div className="slok-section">
                  <p className="slok-text">॥ {currentTip.slok} ॥</p>
                  {currentTip.slok_meaning && (
                    <p className="slok-meaning">
                      {language === 'hi' ? 'अर्थ: ' : 'Meaning: '}
                      {currentTip.slok_meaning}
                    </p>
                  )}
                </div>
              )}

              {/* Tip Description */}
              <div className="tip-description">
                <p>{currentTip.description}</p>
              </div>

              {/* Benefits */}
              {currentTip.benefits && currentTip.benefits.length > 0 && (
                <div className="benefits-section">
                  <h4>{language === 'hi' ? 'लाभ' : 'Benefits'}</h4>
                  <ul className="benefits-list">
                    {currentTip.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to Implement */}
              {currentTip.how_to_implement && (
                <div className="implementation-section">
                  <h4>{language === 'hi' ? 'कैसे करें' : 'How to Implement'}</h4>
                  <ol className="implementation-list">
                    {currentTip.how_to_implement.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Recommended Dosha */}
              {currentTip.recommended_for_doshas && (
                <div className="dosha-section">
                  <h4>{language === 'hi' ? 'किसके लिए अनुशंसित' : 'Recommended for'}</h4>
                  <div className="dosha-badges">
                    {currentTip.recommended_for_doshas.map((dosha) => (
                      <span key={dosha} className={`dosha-badge ${dosha}`}>
                        {dosha.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cautions */}
              {currentTip.cautions && (
                <div className="cautions-section">
                  <h4>⚠️ {language === 'hi' ? 'सावधानियां' : 'Cautions'}</h4>
                  <p className="cautions-text">{currentTip.cautions}</p>
                </div>
              )}
            </div>

            {/* Carousel Controls */}
            <div className="carousel-controls">
              <button
                className="nav-btn prev-btn"
                onClick={prevTip}
                title={language === 'hi' ? 'पिछला' : 'Previous'}
              >
                ❮
              </button>

              <div className="carousel-indicators">
                {tips.map((_, idx) => (
                  <button
                    key={idx}
                    className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to tip ${idx + 1}`}
                  ></button>
                ))}
              </div>

              <button
                className="nav-btn next-btn"
                onClick={nextTip}
                title={language === 'hi' ? 'अगला' : 'Next'}
              >
                ❯
              </button>
            </div>

            {/* Tip Counter */}
            <div className="tip-counter">
              {currentIndex + 1} / {tips.length}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-tips">
          <p>{language === 'hi' ? 'कोई टिप्स उपलब्ध नहीं' : 'No tips available'}</p>
        </div>
      )}

      {/* Tips Grid View */}
      {tips.length > 0 && (
        <div className="tips-grid-section">
          <h3 className="grid-title">
            {language === 'hi' ? 'सभी टिप्स' : 'All Tips'}
          </h3>
          <div className="tips-grid">
            {tips.map((tip, idx) => (
              <div
                key={idx}
                className={`grid-tip-card ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              >
                <h4>{tip.title}</h4>
                <span className="grid-category">{tip.category}</span>
                <p className="grid-description">
                  {tip.description.substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AyurvedaTips;
