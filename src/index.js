import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Prova entrambi i percorsi per vedere quale funziona
//import 'antd/dist/antd.css';  // Percorso classico
// import 'antd/dist/antd.min.css';  // Percorso alternativo
import 'antd/dist/reset.css';  // Nuovo percorso (se applicabile)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
