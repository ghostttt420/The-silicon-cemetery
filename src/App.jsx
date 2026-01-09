import React, { useState, useEffect } from 'react';
import './App.css';

// Initial dummy data so it's not empty
const INITIAL_GRAVES = [
  {
    id: 1,
    name: "iPhone 6s",
    cause: "Battery Bloat",
    eulogy: "You lived 2 years at 1% battery. You were a soldier.",
    respects: 420,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Knock-off AirPods",
    cause: "Washed in Jeans",
    eulogy: "One side stopped working a week after I bought you. Good riddance.",
    respects: 69,
    image: "https://images.unsplash.com/photo-1572569028738-411a1971d6c9?auto=format&fit=crop&w=400&q=80"
  }
];

export default function App() {
  const [graves, setGraves] = useState(() => {
    // Load from local storage or use initial data
    const saved = localStorage.getItem('silicon-cemetery');
    return saved ? JSON.parse(saved) : INITIAL_GRAVES;
  });

  const [showModal, setShowModal] = useState(false);
  const [newGrave, setNewGrave] = useState({ name: '', cause: '', eulogy: '', image: '' });

  // Save to local storage whenever graves change
  useEffect(() => {
    localStorage.setItem('silicon-cemetery', JSON.stringify(graves));
  }, [graves]);

  const handleRespect = (id) => {
    setGraves(graves.map(grave => 
      grave.id === id ? { ...grave, respects: grave.respects + 1 } : grave
    ));
    // Optional: Add a subtle vibration if on mobile
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleBurial = (e) => {
    e.preventDefault();
    const grave = {
      id: Date.now(),
      ...newGrave,
      respects: 0,
      // Default image if they don't provide one
      image: newGrave.image || "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=400&q=80"
    };
    setGraves([grave, ...graves]);
    setShowModal(false);
    setNewGrave({ name: '', cause: '', eulogy: '', image: '' });
  };

  return (
    <div className="app-container">
      <header>
        <h1>The Silicon Cemetery 🪦</h1>
        <div className="subtitle">Where gadgets go to disconnect... forever.</div>
      </header>

      <div className="cemetery-grid">
        {graves.map(grave => (
          <div key={grave.id} className="tombstone">
            <img src={grave.image} alt={grave.name} className="gadget-img" />
            <div className="rip-header">RIP {grave.name}</div>
            <div className="cause-of-death">💀 Cause: {grave.cause}</div>
            <p className="eulogy">"{grave.eulogy}"</p>
            <button 
              className="pay-respects-btn"
              onClick={() => handleRespect(grave.id)}
            >
              Press F to Pay Respects ({grave.respects})
            </button>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="add-grave-btn" onClick={() => setShowModal(true)}>+</button>

      {/* Burial Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="burial-form" onClick={e => e.stopPropagation()}>
            <h2>⚰️ New Burial</h2>
            <input 
              placeholder="Gadget Name (e.g. Dell Laptop)" 
              value={newGrave.name}
              onChange={e => setNewGrave({...newGrave, name: e.target.value})}
            />
            <select 
              value={newGrave.cause}
              onChange={e => setNewGrave({...newGrave, cause: e.target.value})}
            >
              <option value="">Select Cause of Death...</option>
              <option value="Gravity Test Failed">Gravity Test Failed (Dropped)</option>
              <option value="Water Damage (Toilet)">Water Damage (Toilet)</option>
              <option value="Battery Bloat">Battery Bloat</option>
              <option value="Planned Obsolescence">Planned Obsolescence</option>
              <option value="Rage Quit (Smashed)">Rage Quit (Smashed)</option>
              <option value="Unknown">Just... Stopped.</option>
            </select>
            <textarea 
              placeholder="Eulogy (Keep it sad...)" 
              rows="3"
              value={newGrave.eulogy}
              onChange={e => setNewGrave({...newGrave, eulogy: e.target.value})}
            />
            <input 
              placeholder="Image URL (optional)" 
              value={newGrave.image}
              onChange={e => setNewGrave({...newGrave, image: e.target.value})}
            />
            <button className="pay-respects-btn" onClick={handleBurial} style={{backgroundColor: '#ffd700', color: 'black'}}>
              Lower the Casket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

