import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaSearch } from "react-icons/fa";
import styles from './topbar.module.css';

const TopBar = ({ mail, username, onSearch }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchEditable, setIsSearchEditable] = useState(false); 
    const [searchValue, setSearchValue] = useState("JustWeed");
    const inputRef = useRef(null); 

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (onSearch) {
                onSearch(searchValue); 
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
        setIsSearchEditable(!isSearchEditable); 
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={styles.topbar}>
            <FaBars className={styles.littlebutton} />
            <input
                ref={inputRef} 
                className={styles.button}
                value={searchValue}
                readOnly={!isSearchEditable} 
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} 
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
