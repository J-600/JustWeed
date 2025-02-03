import React, { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './topbar.module.css';

export default function Topbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.topbar}>
      <FaBars 
        className={`${styles.littlebutton} ${styles.leftIcon}`}
        onClick={() => {/* Add any left menu functionality */}}
      />
      <div className={styles.centerButton}>JustWeed</div>
      <FaUser
        className={`${styles.littlebutton} ${styles.rightIcon}`}
        onClick={toggleSidebar}
      />

      {isSidebarOpen && (
        <div className={styles.sidebar}>
          <ul className={styles.sidebarOptions}>
            <li onClick={() => navigate('/account-info')}>
              Informazioni Account
            </li>
            <li onClick={() => navigate('/recent-purchases')}>
              Acquisti Recenti
            </li>
            <li onClick={() => navigate('/payment-methods')}>
              Modalità di Pagamento
            </li>
          </ul>
          <button
            className={styles.weederButton}
            onClick={() => navigate('/become-weeder')}
          >
            Diventa uno Weeder
          </button>
        </div>
      )}
    </div>
  );
}