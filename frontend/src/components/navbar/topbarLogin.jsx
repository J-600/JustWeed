import React, { useState, useEffect } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './topbar.module.css';

export default function Topbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState('auto');
  const navigate = useNavigate();

  useEffect(() => {
    if (isSidebarOpen) {
      const button = document.getElementById('userButton');
      if (button) {
        const buttonRect = button.getBoundingClientRect();
        setMenuHeight(`calc(100vh - ${buttonRect.bottom + 15}px)`);  // Maggiore distanza dal pulsante
      }
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.topbar}>
      {/* Pulsante FaBars a sinistra con una distanza dai bordi */}
      <FaBars className={styles.littlebutton} />
      
      {/* Pulsante "JustWeed" al centro */}
      <div className={styles.centerButton}>JustWeed</div>

      {/* Pulsante FaUser a destra con una distanza dai bordi */}
      <FaUser
        id="userButton"
        className={`${styles.littlebutton} ${isSidebarOpen ? styles.activeButton : ''}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`} style={{ height: menuHeight }}>
        <ul className={styles.sidebarOptions}>
          <li onClick={() => navigate('/account-info')}>Informazioni Account</li>
          <li onClick={() => navigate('/recent-purchases')}>Acquisti Recenti</li>
          <li onClick={() => navigate('/payment-methods')}>Modalità di Pagamento</li>
        </ul>
        <button className={styles.weederButton} onClick={() => navigate('/become-weeder')}>
          Diventa uno Weeder
        </button>
      </div>
    </div>
  );
}
