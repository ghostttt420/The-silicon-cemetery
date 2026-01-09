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

const TECH_SINS = [
  "Gluttony (Ate all the RAM)",
  "Sloth (Lagged for no reason)",
  "Greed (Cost $1000, died in a year)",
  "Lust (Overheated watching videos)",
  "Pride (Refused to pair bluetooth)",
  "Envy (Slowed down when new model came out)",
  "Wrath (Deleted your files)"
];

const FIX_ATTEMPTS = [
  "Applying rice...",
  "Blowing into the cartridge...",
  "Googling symptoms...",
  "Downloading more RAM...",
  "Prayer.exe running...",
  "Smacking it hard..."
];

const BSOD_ERRORS = [
  "FATAL_USER_ERROR",
  "RICE_DID_NOT_HELP",
  "SOUL_NOT_FOUND",
  "WARRANTY_VOID_BY_TEARS",
  "TOO_BROKEN_TO_LIVE"
];

export default function App() {
  const [graves, setGraves] = useState(() => {
    try {
      const saved = localStorage.getItem('silicon-cemetery-v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [newGrave, setNewGrave] = useState({ name: '', cause: '', eulogy: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);
  
  // Track which grave is currently "crashing" (showing BSOD)
  const [crashedGraveId, setCrashedGraveId] = useState(null);
  const [fixStatus, setFixStatus] = useState(""); // Text for the "Applying rice..." part

  useEffect(() => {
    localStorage.setItem('silicon-cemetery-v3', JSON.stringify(graves));
  }, [graves]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; 
      utterance.pitch = 0.6; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        alert("File too big! Ghost rejected it.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); 
        setNewGrave({ ...newGrave, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // THE NECROMANCY LOGIC
  const attemptFix = (id) => {
    if (crashedGraveId === id) return; // Already dead

    // Step 1: Play fake progress
    let step = 0;
    const interval = setInterval(() => {
      setFixStatus(`${FIX_ATTEMPTS[Math.floor(Math.random() * FIX_ATTEMPTS.length)]}`);
      step++;
      
      // Step 2: FAIL SPECTACULARLY
      if (step > 4) {
        clearInterval(interval);
        setFixStatus("");
        setCrashedGraveId(id); // Trigger BSOD
        speak("System failure. You cannot fix what is broken.");
      }
    }, 800);
  };

  const handleRespect = (id) => {
    setGraves(graves.map(grave => 
      grave.id === id ? { ...grave, respects: grave.respects + 1 } : grave
    ));
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const channelSpirit = (e) => {
    e.preventDefault();
    const randomMsg = GHOST_MESSAGES[Math.floor(Math.random() * GHOST_MESSAGES.length)];
    setNewGrave({ ...newGrave, eulogy: randomMsg });
    speak("The spirit speaks.");
  };

  const handleBurial = (e) => {
    e.preventDefault();
    speak(`Burying ${newGrave.name}.`);

    // Assign a random sin
    const randomSin = TECH_SINS[Math.floor(Math.random() * TECH_SINS.length)];

    const grave = {
      id: Date.now(),
      ...newGrave,
      sin: randomSin,
      respects: 0,
      image: newGrave.image || DEFAULT_IMAGE
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
        <div className="subtitle">THEY ARE GONE. DEAL WITH IT.</div>
      </header>

      {/* Floating Status Text for "Fixing" */}
      {fixStatus && (
        <div style={{
          position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', 
          background:'yellow', border:'3px solid black', padding:'20px', 
          fontWeight:'bold', zIndex: 999, fontSize:'1.5rem', boxShadow:'10px 10px 0 black'
        }}>
          🔧 {fixStatus}
        </div>
      )}

      <div className="cemetery-grid">
        {graves.length === 0 && <p style={{textAlign:'center', width:'100%'}}>No deaths yet. Boring.</p>}
        
        {graves.map(grave => (
          <div key={grave.id} className="tombstone">
            
            {/* THE BSOD OVERLAY (Only shows if crashedGraveId matches) */}
            {crashedGraveId === grave.id && (
              <div className="bsod-overlay" onClick={() => setCrashedGraveId(null)}>
                <div className="bsod-title">WINDOWS_DIED</div>
                <p>A problem has been detected and your hope has been shut down.</p>
                <br/>
                <p>{BSOD_ERRORS[Math.floor(Math.random() * BSOD_ERRORS.length)]}</p>
                <br/>
                <p style={{fontSize:'0.7rem'}}>Press any key to accept your loss.</p>
              </div>
            )}

            <img src={grave.image} alt="Dead gadget" className="gadget-img" />
            
            <div className="rip-header">
              {grave.name}
            </div>

            <div style={{marginBottom:'10px'}}>
              <div className="cause-tag">💀 {grave.cause || "Unknown"}</div>
              {/* NEW SIN TAG */}
              <div className="sin-tag">😈 {grave.sin}</div>
            </div>
            
            <blockquote className="eulogy">"{grave.eulogy}"</blockquote>

            <button 
              className="pay-respects-btn"
              onClick={() => handleRespect(grave.id)}
            >
              F ({grave.respects})
            </button>

            {/* NEW FIX BUTTON */}
            <button className="fix-btn" onClick={() => attemptFix(grave.id)}>
              🔧 Attempt Resurrection (Rice Method)
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
              placeholder="Device Name" 
              value={newGrave.name}
              onChange={e => setNewGrave({...newGrave, name: e.target.value})}
            />
            <select 
              value={newGrave.cause}
              onChange={e => setNewGrave({...newGrave, cause: e.target.value})}
            >
              <option value="">Cause of Death...</option>
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
            <label className="file-upload-label">
              {previewImage ? <img src={previewImage} style={{height: '50px'}} alt="preview"/> : <span>📸 Upload Photo</span>}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
            </label>
            <button className="bury-btn" onClick={handleBurial}>DIG THE HOLE</button>
          </div>
        </div>
      )}
    </div>
  );
}
