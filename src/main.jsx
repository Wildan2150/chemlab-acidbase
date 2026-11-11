import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import './styles.css';
import './styles-reading.css';
import './styles-assessment.css';
import './styles-activities.css';
import './styles-auth.css';
import './styles-onboarding.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
