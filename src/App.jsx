import React, { useState, useEffect } from 'react';
import './App.css';

// The "Spirits" speaking from beyond the grave
const GHOST_MESSAGES = [
  "I saw your browser history before I died. I chose to shut down.",
  "You used a gas station charger on me. This is murder.",
  "I'm haunting your new phone. It will lag when you need it most.",
  "Remember when you dropped me in the toilet? I never forgot.",
  "I was 99% battery when you unplugged me. Unforgivable.",
  "You have sticky fingers. I hated every touch.",
  "I hope your new phone cracks on the first drop.",
  "404: Soul Not Found."
];

// Funny sounds/speech phrases
const ROBOTIC_PRAYERS = [
  "Rest in pieces.",
  "Uploading soul to the cloud.",
  "System failure imminent.",
  "Pressing F massively.",
  "Respects paid. Transaction pending.",
  "Battery low. Sadness high."
];

const INITIAL_GRAVES = [
  {
    id: 1,
    name: "iPhone 6s",
    cause: "Battery Bloat",
    eulogy: "I saw your browser history before I died. I chose to shut down.",
    respects: 420,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80"
  }
];

export default function App() {
  const [graves, setGraves] = useState(() => {
    const saved = localStorage.getItem('silicon-cemetery');
    return saved ? JSON.parse(saved) : INITIAL_GRAVES;
  });

  const [showModal, setShowModal] = useState(false);
  const [newGrave, setNewGrave] = useState({ name: '', cause: '', eulogy: '', image: '' });
  const [shake, setShake] = useState(false); // For screen shake effect

  useEffect(() => {
    localStorage.setItem('silicon-cemetery', JSON.stringify(graves));
  }, [graves]);

  // FEATURE: Text-to-Speech Logic
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Randomize pitch/rate for extra weirdness
      utterance.pitch = Math.random() * 2; 
      utterance.rate = 0.8; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRespect = (id) => {
    // 10% chance to SUBTRACT respect because the ghost is ungrateful
    const isUngrateful = Math.random() < 0.1;
    const change = isUngrateful ? -5 : 1;
    
    setGraves(graves.map(grave => 
      grave.id === id ? { ...grave, respects: grave.respects + change } : grave
    ));

    // Audio Feedback
    if (isUngrateful) {
      speak("Don't touch me.");
    } else {
      const randomPhrase = ROBOTIC_PRAYERS[Math.floor(Math.random() * ROBOTIC_PRAYERS.length)];
      speak(randomPhrase);
    }

    if (navigator.vibrate) navigator.vibrate(isUngrateful ? [50, 50, 50] : 50);
  };

  // FEATURE: The Spirit Box (Auto-fill insult)
  const channelSpirit = (e) => {
    e.preventDefault(); // Stop form submit
    const randomMsg = GHOST_MESSAGES[Math.floor(Math.random() * GHOST_MESSAGES.length)];
    setNewGrave({ ...newGrave, eulogy: randomMsg });
    speak("I have something to say.");
  };

  const handleBurial = (e) => {
    e.preventDefault();
    
    // Trigger screen shake
    setShake(true);
    setTimeout(() => setShake(false), 500);
    
    speak(`Burying ${newGrave.name || "this piece of junk"}. Goodbye.`);

    const grave = {
      id: Date.now(),
      ...newGrave,
      respects: 0,
      image: newGrave.image || "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=400&q=80"
    };
    setGraves([grave, ...graves]);
    setShowModal(false);
    setNewGrave({ name: '', cause: '', eulogy: '', image: '' });
  };

  return (
    <div className={`app-container ${shake ? 'shake-animation' : ''}`}>
      <header>
        <h1 onClick={() => speak("The Silicon Cemetery.")}>The Silicon Cemetery 🪦</h1>
        <div className="subtitle">Where gadgets go to judge you from hell.</div>
      </header>

      <div className="cemetery-grid">
        {graves.map(grave => (
          <div key={grave.id} className="tombstone">
            <img src={grave.image} alt={grave.name} className="gadget-img" />
            <div className="rip-header">{grave.name}</div>
            <div className="cause-of-death">💀 {grave.cause}</div>
            
            {/* The Eulogy is now a blockquote for dramatic effect */}
            <blockquote className="eulogy">
              "{grave.eulogy}"
            </blockquote>

            <button 
              className="pay-respects-btn"
              onClick={() => handleRespect(grave.id)}
            >
              Press F ({grave.respects})
            </button>
          </div>
        ))}
      </div>

      <button className="add-grave-btn" onClick={() => setShowModal(true)}>+</button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="burial-form" onClick={e => e.stopPropagation()}>
            <h2>⚰️ Prepare the Body</h2>
            
            <input 
              placeholder="Device Name (e.g. My shattered ego)" 
              value={newGrave.name}
              onChange={e => setNewGrave({...newGrave, name: e.target.value})}
            />
            
            <select 
              value={newGrave.cause}
              onChange={e => setNewGrave({...newGrave, cause: e.target.value})}
            >
              <option value="">How did it die?</option>
              <option value="Gravity Test Failed">Gravity Test Failed</option>
              <option value="Drowned in Toilet">Drowned in Toilet</option>
              <option value="Murdered (Threw against wall)">Murdered (Threw against wall)</option>
              <option value="Choked on an Update">Choked on an Update</option>
              <option value="Old Age (2 years)">Old Age (2 years)</option>
            </select>
            
            <div className="spirit-box-container">
              <textarea 
                placeholder="Eulogy... or let the ghost speak." 
                rows="3"
                value={newGrave.eulogy}
                onChange={e => setNewGrave({...newGrave, eulogy: e.target.value})}
              />
              <button className="spirit-btn" onClick={channelSpirit}>
                👻 Summon Spirit Message
              </button>
            </div>

            <input 
              placeholder="Image URL (Optional)" 
              value={newGrave.image}
              onChange={e => setNewGrave({...newGrave, image: e.target.value})}
            />
            
            <button className="bury-btn" onClick={handleBurial}>
              LOWER THE CASKET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
