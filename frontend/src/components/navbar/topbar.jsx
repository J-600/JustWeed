import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaSearch } from "react-icons/fa";
import styles from './topbar.module.css';

const TopBar = ({ mail, username, onSearch }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchEditable, setIsSearchEditable] = useState(false); // Stato per la modalità della barra di ricerca
    const [searchValue, setSearchValue] = useState("JustWeed"); // Stato per il valore della barra di ricerca
    const inputRef = useRef(null); // Riferimento all'input

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value); // Aggiorna il valore dell'input
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            // Quando viene premuto Invio
            if (onSearch) {
                onSearch(searchValue); // Esegue la ricerca con il valore corrente
            }
            enableSearchEdit()
            console.log(`Ricerca effettuata per: ${searchValue}`);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const enableSearchEdit = () => {
        if (isSearchEditable){
            setSearchValue("JustWeed");
        }
        setIsSearchEditable(!isSearchEditable); // Abilita la modifica
        if (inputRef.current) {
            inputRef.current.focus(); // Porta il focus sull'input
        }
    };

    return (
        <div className={styles.topbar}>
            <FaBars className={styles.littlebutton} />
            <input
                ref={inputRef} // Assegna il riferimento all'input
                className={styles.button}
                value={searchValue}
                readOnly={!isSearchEditable} // Rende l'input modificabile solo se isSearchEditable è true
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} // Gestore per rilevare Invio
            />
            <FaSearch onClick={enableSearchEdit} className={styles.littlebutton} />
            <FaUser onClick={toggleSidebar} className={styles.littlebutton} />

            {isSidebarOpen && (
                <div className={styles.sidebar}>
                    <ul className={styles.sidebarOptions}>
                        <li onClick={() => navigate('/account-info')}>Informazioni Account</li>
                        <li onClick={() => navigate('/recent-purchases')}>Acquisti Recenti</li>
                        <li onClick={() => navigate('/payment-methods')}>Modalità di Pagamento</li>
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
};

export default TopBar;
