import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './topbar.module.css';

export default function Topbar({ username, mail}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuHeight] = useState('80vh'); // Altezza fissa impostata qui
  const sidebarRef = useRef(null);
  const userButtonRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Topbar */}
      <div className={styles.topbar}>
        <FaBars className={styles.littlebutton} />
        <div className={styles.centerButton}>JustWeed</div>
        <FaUser
          ref={userButtonRef}
          className={`${styles.littlebutton} ${isSidebarOpen ? styles.activeButton : ''}`}
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`} 
        style={{ height: isSidebarOpen ? menuHeight : '0' }}
      >
        <div className={styles.sidebarContent}>
          <ul className={styles.sidebarOptions}>
            <li onClick={() => navigate('/account-info')}>Informazioni Account</li>
            <li onClick={() => navigate('/recent-purchases')}>Acquisti Recenti</li>
            <li onClick={() => navigate('/payment-methods')}>Modalità di Pagamento</li>
            {/* Aggiungi altri elementi qui se necessario */}
          </ul>
          <button 
            className={styles.weederButton} 
            onClick={() => navigate('/become-weeder')}
          >
            Diventa uno Weeder
          </button>
        </div>
      </div>
    </div>
  );
}