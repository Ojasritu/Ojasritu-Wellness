import React, { useState } from 'react'

const demoVideos = [
  {
    id: 1,
    title: { en: 'Intro to Ayurveda', hi: 'आयुर्वेद परिचय' },
    sources: { en: '/videos/ayurveda-en.mp4', hi: '/videos/ayurveda-hi.mp4' },
  },
  {
    id: 2,
    title: { en: 'Herbal Remedies', hi: 'हर्बल उपचार' },
    sources: { en: '/videos/herbal-en.mp4', hi: '/videos/herbal-hi.mp4' },
  },
]

export default function VideoGallery() {
  const [lang, setLang] = useState('en')
  const [selected, setSelected] = useState(demoVideos[0])

  return (
    <section className="video-gallery container">
      <div className="vg-header">
        <h2>Videos</h2>
        <div>
          <label htmlFor="lang">Language: </label>
          <select id="lang" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </div>

      <div className="vg-body">
        <div className="vg-player">
          <video controls width="100%" key={selected.id}>
            <source src={selected.sources[lang]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <aside className="vg-list">
          {demoVideos.map((v) => (
            <button key={v.id} className={v.id === selected.id ? 'active' : ''} onClick={() => setSelected(v)}>
              {v.title[lang]}
            </button>
          ))}
        </aside>
      </div>
    </section>
  )
}
