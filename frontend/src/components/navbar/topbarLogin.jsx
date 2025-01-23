import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './topbarLogin.module.css';

const TopBar = () => {
    const navigate = useNavigate();


    return (
        <div className={styles.topbar}>
            <div className={styles.button}>JustWeed</div> {/*da cambiare in div*/}
        </div>
    );
};

export default TopBar;