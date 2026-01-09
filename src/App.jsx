import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase'; 
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  arrayUnion // NEW: Needed for adding items to arrays
} from 'firebase/firestore';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=400&q=80";

// NEW: The items you can throw on graves
const OFFERINGS = ["🤡", "🔋", "🗑️", "🕯️", "💐", "💩"];

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
  const [graves, setGraves] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]); 
  
  const [showModal, setShowModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); 
  const [newGrave, setNewGrave] = useState({ name: '', cause: '', eulogy: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);
  
  const [crashedGraveId, setCrashedGraveId] = useState(null);
  const [fixStatus, setFixStatus] = useState("");

  // NEW: Night Mode State
  const [isHaunted, setIsHaunted] = useState(false);

  useEffect(() => {
    // 1. Check for Real Night Time (12 AM - 3 AM)
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 3) {
      setIsHaunted(true);
    }

    // 2. Database Listener
    const q = query(collection(db, "graves"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gravesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGraves(gravesData);
      
      const topGraves = [...gravesData].sort((a, b) => b.respects - a.respects).slice(0, 3);
      setLeaderboard(topGraves);
    });

    return () => unsubscribe();
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = isHaunted ? 0.5 : 0.9; // Speak slower if haunted
      utterance.pitch = isHaunted ? 0.1 : 0.6; // Deep demon voice if haunted
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) { 
        alert("File too big! Firestore hates large files.");
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

  const attemptFix = (id) => {
    if (crashedGraveId === id) return;
    let step = 0;
    const interval = setInterval(() => {
      setFixStatus(`${FIX_ATTEMPTS[Math.floor(Math.random() * FIX_ATTEMPTS.length)]}`);
      step++;
      if (step > 4) {
        clearInterval(interval);
        setFixStatus("");
        setCrashedGraveId(id);
        speak("System failure. You cannot fix what is broken.");
      }
    }, 800);
  };

   // NEW: Native Share Feature
  const handleShare = (grave) => {
    const shareData = {
      title: `RIP ${grave.name}`,
      text: `⚰️ Please join me in mourning ${grave.name}. It died of ${grave.cause}. Leave an offering here:`,
      url: window.location.href // Shares the current URL
    };

    // Use the native Android share menu if available
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback for laptops
      navigator.clipboard.writeText(window.location.href);
      speak("Link copied. Spread the sadness.");
      alert("Link copied to clipboard!");
    }
  };

  const handleRespect = async (id, currentRespects) => {
    const graveRef = doc(db, "graves", id);
    await updateDoc(graveRef, {
      respects: currentRespects + 1
    });
    if (navigator.vibrate) navigator.vibrate(50);
  };

    // UPDATED: Now supports infinite trash spam
  const handleOffering = async (id, item) => {
    const graveRef = doc(db, "graves", id);
    
    // We attach a random ID so Firestore treats every click as unique
    const uniqueTrash = { 
      emoji: item, 
      id: Date.now() + Math.random() 
    };

    await updateDoc(graveRef, {
      offerings: arrayUnion(uniqueTrash) 
    });

    if (navigator.vibrate) navigator.vibrate(20);
    
    // Feedback logic
    if (item === "💩") speak("Disgusting.");
    if (item === "🤡") speak("Honk.");
  };


  const channelSpirit = (e) => {
    e.preventDefault();
    const randomMsg = GHOST_MESSAGES[Math.floor(Math.random() * GHOST_MESSAGES.length)];
    setNewGrave({ ...newGrave, eulogy: randomMsg });
    speak("The spirit speaks.");
  };

  const handleBurial = async (e) => {
    e.preventDefault();
    speak(`Burying ${newGrave.name}.`);

    const randomSin = TECH_SINS[Math.floor(Math.random() * TECH_SINS.length)];

    await addDoc(collection(db, "graves"), {
      name: newGrave.name,
      cause: newGrave.cause,
      eulogy: newGrave.eulogy,
      image: newGrave.image || DEFAULT_IMAGE,
      sin: randomSin,
      respects: 0,
      offerings: [], // Start with empty offerings
      timestamp: Date.now()
    });
    
    setShowModal(false);
    setNewGrave({ name: '', cause: '', eulogy: '', image: null });
    setPreviewImage(null);
  };

  return (
    <div className={`app-container ${isHaunted ? 'haunted-mode' : ''}`}>
      
      {/* DEV TOGGLE: So you can see night mode even during the day */}
      <button className="toggle-night-btn" onClick={() => setIsHaunted(!isHaunted)}>
        {isHaunted ? "☀️ Day" : "🌙 Night"}
      </button>

      {/* HAUNTED GHOSTS LAYER */}
      {isHaunted && (
        <div className="ghost-container">
          <div className="floating-ghost" style={{top: '20%', animationDuration: '12s'}}>👻</div>
          <div className="floating-ghost" style={{top: '50%', animationDuration: '8s', animationDelay: '2s'}}>💀</div>
          <div className="floating-ghost" style={{top: '80%', animationDuration: '15s', animationDelay: '5s'}}>🕸️</div>
        </div>
      )}

      <header style={{textAlign: 'center'}}>
        <h1>SILICON CEMETERY ☠️</h1>
        <div className="subtitle">GLOBAL SERVER OF DEAD TECH</div>
      </header>
      
      <button 
        className="leaderboard-btn" 
        onClick={() => setShowLeaderboard(true)}
      >
        🏆 High Council of Trash
      </button>

      {fixStatus && (
        <div className="fix-overlay">
          🔧 {fixStatus}
        </div>
      )}

      <div className="cemetery-grid">
        {graves.map(grave => (
          <div key={grave.id} className="tombstone">
            {crashedGraveId === grave.id && (
              <div className="bsod-overlay" onClick={() => setCrashedGraveId(null)}>
                <div className="bsod-title">WINDOWS_DIED</div>
                <p>A problem has been detected and your hope has been shut down.</p>
                <br/>
                <p>{BSOD_ERRORS[Math.floor(Math.random() * BSOD_ERRORS.length)]}</p>
              </div>
            )}

            <img src={grave.image} alt="Dead gadget" className="gadget-img" />
            <div className="rip-header">{grave.name}</div>
            <div style={{marginBottom:'10px'}}>
              <div className="cause-tag">💀 {grave.cause || "Unknown"}</div>
              <div className="sin-tag">😈 {grave.sin}</div>
            </div>
            <blockquote className="eulogy">"{grave.eulogy}"</blockquote>
            
                    {/* UPDATED TRASH DISPLAY */}
            <div className="trash-pile">
              {grave.offerings && grave.offerings.map((item, index) => {
                // Check if it's the old format (string) or new format (object)
                const emojiToShow = typeof item === 'object' ? item.emoji : item;
                const uniqueKey = typeof item === 'object' ? item.id : index;
                
                return (
                  <span key={uniqueKey} className="trash-item">
                    {emojiToShow}
                  </span>
                );
              })}
              
              {(!grave.offerings || grave.offerings.length === 0) && (
                <span style={{opacity:0.5, fontSize:'0.8rem'}}>No offerings yet...</span>
              )}
            </div>


            {/* NEW: Vandalism Bar */}
            <div className="offering-bar">
              {OFFERINGS.map(emoji => (
                <button 
                  key={emoji} 
                  className="offering-btn" 
                  onClick={() => handleOffering(grave.id, emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div style={{marginTop: '15px'}}>
              <button 
                className="pay-respects-btn"
                onClick={() => handleRespect(grave.id, grave.respects)}
              >
                F ({grave.respects})
              </button>
   <button 
                  className="pay-respects-btn"
                  style={{width: '60px', background: '#fff', color: '#000'}} 
                  onClick={() => handleShare(grave)}
                >
                  📢
                </button>
              </div>
              <button className="fix-btn" onClick={() => attemptFix(grave.id)}>
                🔧 Attempt Resurrection
              </button>
            </div>
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

      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="leaderboard-modal" onClick={e => e.stopPropagation()}>
             <h2>🏆 THE HIGH COUNCIL 🏆</h2>
             <div className="leaderboard-list">
               {leaderboard.map((grave, index) => (
                 <div key={grave.id} className="leaderboard-item">
                   <div className="rank">#{index + 1}</div>
                   <img src={grave.image} className="leaderboard-img" />
                   <div className="leaderboard-info">
                     <div className="leaderboard-name">{grave.name}</div>
                     <div className="leaderboard-respects">{grave.respects} Respects Paid</div>
                   </div>
                 </div>
               ))}
             </div>
             <button className="close-btn" onClick={() => setShowLeaderboard(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}