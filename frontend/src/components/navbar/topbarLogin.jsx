import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './topbarLogin.module.css';

const TopBar = () => {
    const navigate = useNavigate();

    const logoClick = () => {
        navigate('/');
    };

    return (
        <div className={styles.topbar}>
            <button className={styles.button} onClick={logoClick}>JustWeed</button> {/*da cambiare in div*/}
        </div>
    );
};

export default TopBar;