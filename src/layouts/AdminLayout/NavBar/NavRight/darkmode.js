import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Pour les icônes du soleil et de la lune
import './darkmode.css'; // Votre fichier CSS pour les styles spécifiques

const ThemeSwitch = () => {
  // État pour savoir si le mode sombre est activé
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fonction pour basculer le mode sombre
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode); // Appliquer ou supprimer la classe
  };

  return (
    <div className="mobile-position">
      <nav className="navigation">
        <div className="theme-switch-wrapper">
          <label className="theme-switch">
            <input
              type="checkbox"
              checked={isDarkMode} // L'état contrôle l'état de la case à cocher
              onChange={toggleTheme} // L'action qui bascule le thème
            />
            <div className="mode-container py-1">
              {/* Utilisation d'icônes React */}
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </div>
          </label>
        </div>
      </nav>
    </div>
  );
};

export default ThemeSwitch;
