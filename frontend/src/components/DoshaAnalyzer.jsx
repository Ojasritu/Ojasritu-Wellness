import React, { useState } from 'react';
import './DoshaAnalyzer.css';

const DoshaAnalyzer = () => {
  const [step, setStep] = useState('intro'); // intro, questionnaire, results
  const [language, setLanguage] = useState('hi');
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const questions = {
    vata: [
      { id: 'body_frame', hi: 'आपकी शारीरिक संरचना कैसी है?', en: 'How is your body frame?' },
      { id: 'skin_type', hi: 'आपकी त्वचा का प्रकार क्या है?', en: 'What is your skin type?' },
      { id: 'digestion', hi: 'आपका पाचन कैसा है?', en: 'How is your digestion?' },
    ],
    pitta: [
      { id: 'appetite', hi: 'आपकी भूख कैसी है?', en: 'How is your appetite?' },
      { id: 'body_temp', hi: 'क्या आप आसानी से गर्मी महसूस करते हैं?', en: 'Do you feel heat easily?' },
      { id: 'sweat', hi: 'क्या आप ज्यादा पसीना बहाते हैं?', en: 'Do you sweat more?' },
    ],
    kapha: [
      { id: 'weight', hi: 'आपका वजन कैसा है?', en: 'How is your weight?' },
      { id: 'energy', hi: 'आपकी ऊर्जा का स्तर कैसा है?', en: 'How is your energy level?' },
      { id: 'sleep', hi: 'आप कितनी अच्छी नींद लेते हैं?', en: 'How well do you sleep?' },
    ]
  };

  const doshaNames = {
    en: { vata: 'VATA', pitta: 'PITTA', kapha: 'KAPHA' },
    hi: { vata: 'वात', pitta: 'पित्त', kapha: 'कफ' }
  };

  const doshaDescriptions = {
    en: {
      vata: 'वात (Air & Space) - You are creative, energetic, and adaptable but can be anxious.',
      pitta: 'पित्त (Fire & Water) - You are focused, ambitious, and intelligent but can be intense.',
      kapha: 'कफ (Earth & Water) - You are calm, stable, and caring but can be slow.'
    },
    hi: {
      vata: 'वात (वायु और आकाश) - आप रचनात्मक, ऊर्जावान और अनुकूलनीय हैं लेकिन चिंतित हो सकते हैं।',
      pitta: 'पित्त (अग्नि और जल) - आप केंद्रित, महत्वाकांक्षी और बुद्धिमान हैं लेकिन तीव्र हो सकते हैं।',
      kapha: 'कफ (पृथ्वी और जल) - आप शांत, स्थिर और देखभाल करने वाले हैं लेकिन धीमे हो सकते हैं।'
    }
  };

  const handleQuestionAnswer = (questionId, score) => {
    setAnswers({
      ...answers,
      [questionId]: score
    });
  };

  const submitQuestionnaire = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/dosha-analyzer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          answers: answers,
          language: language
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.result);
        setStep('results');
      }
    } catch (error) {
      console.error('Error analyzing dosha:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderIntro = () => (
    <div className="dosha-intro">
      <h2 className="dosha-title">🧘 दोष विश्लेषण / Dosha Analysis</h2>
      <div className="dosha-card intro-card">
        <p className="intro-text">
          {language === 'hi'
            ? 'आयुर्वेद के अनुसार, प्रत्येक व्यक्ति तीन दोषों (वात, पित्त, कफ) का एक अनोखा मिश्रण है। अपने दोष को समझें और व्यक्तिगत स्वास्थ्य सलाह पाएं।'
            : 'According to Ayurveda, each person is a unique combination of three doshas (Vata, Pitta, Kapha). Understand your dosha and get personalized health advice.'}
        </p>
        <div className="dosha-overview">
          <div className="overview-item vata-card">
            <h4>वात / Vata</h4>
            <p>🌪️ Air & Space</p>
          </div>
          <div className="overview-item pitta-card">
            <h4>पित्त / Pitta</h4>
            <p>🔥 Fire & Water</p>
          </div>
          <div className="overview-item kapha-card">
            <h4>कफ / Kapha</h4>
            <p>🌍 Earth & Water</p>
          </div>
        </div>
        <button 
          className="dosha-start-btn"
          onClick={() => setStep('questionnaire')}
        >
          {language === 'hi' ? 'शुरू करें' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );

  const renderQuestionnaire = () => (
    <div className="dosha-questionnaire">
      <div className="questionnaire-header">
        <h2>{language === 'hi' ? 'प्रश्नावली' : 'Questionnaire'}</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(Object.keys(answers).length / 9) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="questions-container">
        {Object.entries(questions).map(([dosha, doshaQuestions]) => (
          <div key={dosha} className={`dosha-section ${dosha}-section`}>
            <h3 className="section-title">{doshaNames[language][dosha]}</h3>
            {doshaQuestions.map((q, idx) => (
              <div key={q.id} className="question-group">
                <label className="question-label">
                  {idx + 1}. {language === 'hi' ? q.hi : q.en}
                </label>
                <div className="answer-options">
                  {['कम', 'मध्यम', 'अधिक'].map((option, scoreIdx) => (
                    <button
                      key={scoreIdx}
                      className={`answer-btn ${answers[q.id] === scoreIdx ? 'selected' : ''}`}
                      onClick={() => handleQuestionAnswer(q.id, scoreIdx)}
                      data-score={scoreIdx}
                    >
                      {language === 'hi' ? option : ['Low', 'Medium', 'High'][scoreIdx]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="questionnaire-footer">
        <button 
          className="back-btn"
          onClick={() => setStep('intro')}
        >
          {language === 'hi' ? 'वापस' : 'Back'}
        </button>
        <button 
          className="submit-btn"
          onClick={submitQuestionnaire}
          disabled={Object.keys(answers).length < 9 || loading}
        >
          {loading ? '...' : (language === 'hi' ? 'विश्लेषण करें' : 'Analyze')}
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="dosha-results">
      <h2 className="results-title">
        {language === 'hi' ? 'आपका दोष परिणाम' : 'Your Dosha Results'}
      </h2>

      {results && (
        <>
          <div className="dosha-scores">
            {['vata', 'pitta', 'kapha'].map(dosha => (
              <div key={dosha} className={`score-card ${dosha}-card`}>
                <h3>{doshaNames[language][dosha]}</h3>
                <div className="score-value">
                  {results.scores[dosha]}%
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ width: `${results.scores[dosha]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="primary-dosha">
            <h3>{language === 'hi' ? 'आपका प्राथमिक दोष' : 'Your Primary Dosha'}</h3>
            <div className={`primary-dosha-card ${results.primary_dosha}-card`}>
              <h2>{doshaNames[language][results.primary_dosha]}</h2>
              <p className="dosha-description">
                {doshaDescriptions[language][results.primary_dosha]}
              </p>
            </div>
          </div>

          {results.recommendations && (
            <div className="recommendations">
              <h3>{language === 'hi' ? 'सिफारिशें' : 'Recommendations'}</h3>
              <ul className="recommendations-list">
                {results.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {results.recommended_products && results.recommended_products.length > 0 && (
            <div className="recommended-products">
              <h3>{language === 'hi' ? 'अनुशंसित उत्पाद' : 'Recommended Products'}</h3>
              <div className="products-grid">
                {results.recommended_products.map(product => (
                  <div key={product.id} className="product-card">
                    <h4>{product.name}</h4>
                    <p className="product-price">₹{product.price}</p>
                    <button className="add-to-cart-btn">
                      {language === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-footer">
            <button 
              className="restart-btn"
              onClick={() => {
                setStep('intro');
                setAnswers({});
                setResults(null);
              }}
            >
              {language === 'hi' ? 'फिर से शुरू करें' : 'Start Over'}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="dosha-analyzer-container">
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

      {step === 'intro' && renderIntro()}
      {step === 'questionnaire' && renderQuestionnaire()}
      {step === 'results' && renderResults()}
    </div>
  );
};

export default DoshaAnalyzer;
