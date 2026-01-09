import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// We are importing the CSS in App.jsx, so we don't strictly need it here,
// but if you have a global index.css, import it here.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
