import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './topbar.module.css';

export default function Topbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState('auto');
  const sidebarRef = useRef(null);
  const userButtonRef = useRef(null);
  const navigate = useNavigate();

  // Calcola dinamicamente l'altezza della sidebar
  useEffect(() => {
    const calculateSidebarHeight = () => {
      if (isSidebarOpen && userButtonRef.current && sidebarRef.current) {
        const buttonRect = userButtonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const topbarHeight = buttonRect.bottom + 20; // Altezza del topbar + margine
        
        // Calcola l'altezza disponibile sottraendo l'altezza del topbar
        const availableHeight = windowHeight - topbarHeight;
        
        // Usa il contenuto interno per determinare l'altezza effettiva
        const contentHeight = sidebarRef.current.scrollHeight;
        
        // Scegli tra altezza del contenuto e altezza disponibile
        const dynamicHeight = Math.min(contentHeight, availableHeight);
        
        setMenuHeight(`${Math.max(dynamicHeight, 200)}px`);
      } else {
        setMenuHeight('auto');
      }
    };

    calculateSidebarHeight();
    window.addEventListener('resize', calculateSidebarHeight);
    
    return () => {
      window.removeEventListener('resize', calculateSidebarHeight);
    };
  }, [isSidebarOpen]);

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
        style={{ 
          height: menuHeight,
          maxHeight: 'calc(100vh - 150px)' // Altezza massima dinamica
        }}
      >
        <div className={styles.sidebarContent}>
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
    </div>
  );
}