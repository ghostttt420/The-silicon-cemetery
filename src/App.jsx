import React, { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=400&q=80";

const GHOST_MESSAGES = [
  "I saw your browser history. I chose death.",
  "You bought a cheap case. I felt every impact.",
  "Haunting your Wi-Fi forever now.",
  "My battery didn't die, it committed sudoku.",
  "I was worth more than your car.",
  "Don't pretend you miss me.",
  "404: Soul Not Found."
];

const ROBOTIC_PRAYERS = [
  "Rest in pieces.",
  "Uploading soul to the cloud.",
  "Pressing F massively.",
  "Sadness buffer overflow.",
  "Respects paid."
];

export default function App() {
  const [graves, setGraves] = useState(() => {
    try {
      const saved = localStorage.getItem('silicon-cemetery-v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [newGrave, setNewGrave] = useState({ name: '', cause: '', eulogy: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('silicon-cemetery-v2', JSON.stringify(graves));
    } catch (e) {
      alert("Storage full! That last image was too thicc for the browser memory.");
    }
  }, [graves]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; 
      utterance.pitch = 0.6; // Deeper robotic voice
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 2MB limit check roughly
      if (file.size > 2000000) {
        alert("File too big! Please keep it under 2MB or the ghost will be heavy.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Show preview
        setNewGrave({ ...newGrave, image: reader.result }); // Save string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRespect = (id) => {
    setGraves(graves.map(grave => 
      grave.id === id ? { ...grave, respects: grave.respects + 1 } : grave
    ));
    const randomPhrase = ROBOTIC_PRAYERS[Math.floor(Math.random() * ROBOTIC_PRAYERS.length)];
    speak(randomPhrase);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const channelSpirit = (e) => {
    e.preventDefault();
    const randomMsg = GHOST_MESSAGES[Math.floor(Math.random() * GHOST_MESSAGES.length)];
    setNewGrave({ ...newGrave, eulogy: randomMsg });
    speak("I have words.");
  };

  const handleBurial = (e) => {
    e.preventDefault();
    speak(`Burying ${newGrave.name}. Goodbye.`);

    const grave = {
      id: Date.now(),
      ...newGrave,
      respects: 0,
      image: newGrave.image || DEFAULT_IMAGE // Use uploaded or default
    };
    
    setGraves([grave, ...graves]);
    setShowModal(false);
    setNewGrave({ name: '', cause: '', eulogy: '', image: null });
    setPreviewImage(null);
  };

  return (
    <div className="app-container">
      <header style={{textAlign: 'center'}}>
        <h1>TOON GRAVEYARD ☠️</h1>
        <div className="subtitle">WHERE TECH GOES TO DIE</div>
      </header>

      <div className="cemetery-grid">
        {graves.length === 0 && <p style={{textAlign:'center', width:'100%'}}>No deaths yet. You must take good care of your stuff. Boring.</p>}
        
        {graves.map(grave => (
          <div key={grave.id} className="tombstone">
            <img src={grave.image} alt="Dead gadget" className="gadget-img" />
            <div className="rip-header">{grave.name}</div>
            <div className="cause-tag">💀 {grave.cause || "Unknown Causes"}</div>
            
            <blockquote className="eulogy">
              "{grave.eulogy}"
            </blockquote>

            <button 
              className="pay-respects-btn"
              onClick={() => handleRespect(grave.id)}
            >
              F ({grave.respects})
            </button>
          </div>
        ))}
      </div>

      <button className="add-grave-btn" onClick={() => setShowModal(true)}>+</button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="burial-form" onClick={e => e.stopPropagation()}>
            <h2 style={{margin:0, textTransform: 'uppercase'}}>⚰️ New Victim</h2>
            
            <input 
              placeholder="Device Name (e.g. Broken Controller)" 
              value={newGrave.name}
              onChange={e => setNewGrave({...newGrave, name: e.target.value})}
            />
            
            <select 
              value={newGrave.cause}
              onChange={e => setNewGrave({...newGrave, cause: e.target.value})}
            >
              <option value="">Select Cause of Death...</option>
              <option value="Smashed in Gamer Rage">Smashed in Gamer Rage</option>
              <option value="Water Damage">Water Damage</option>
              <option value="Just Gave Up">Just Gave Up</option>
              <option value="Exploded">Exploded</option>
            </select>
            
            <div style={{display:'flex', gap: '5px'}}>
              <textarea 
                style={{flex: 1}}
                placeholder="Eulogy..." 
                rows="2"
                value={newGrave.eulogy}
                onChange={e => setNewGrave({...newGrave, eulogy: e.target.value})}
              />
              <button className="spirit-btn" onClick={channelSpirit}>👻</button>
            </div>

            {/* NEW IMAGE UPLOAD UI */}
            <label className="file-upload-label">
              {previewImage ? (
                <img src={previewImage} style={{height: '50px', borderRadius: '5px'}} alt="preview"/>
              ) : (
                <span>📸 Upload Photo of the Body (Optional)</span>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{display: 'none'}} 
              />
            </label>
            
            <button className="bury-btn" onClick={handleBurial}>
              DIG THE HOLE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
