import React from 'react';
import { FaUser } from "react-icons/fa"; // Icona di un utente da FontAwesome
import { useNavigate } from 'react-router-dom';
import styles from './topbarLogin.module.css';

const TopBar = () => {
    const navigate = useNavigate();
    const logoClick = () => {
            navigate('/');
    }

    return (
        <div>
            <button className={styles.button} onClick={logoClick}>JustWeed</button>
        </div>
    );
};

export default TopBar;
