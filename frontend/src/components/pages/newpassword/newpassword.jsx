import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbarLogin';
import styles from '../../styles/login.module.css';
import Loader from '../../loader/loader';
// import crypto from 'crypto-js';
import CryptoJS from 'crypto-js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function NewPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [rPassword, setRpassword] = useState('');
    // const [hash, setHash] = useState('');
    // const crypto = require('crypto-js');
    const params = new URLSearchParams(location.search);
    const [responseMessage, setResponseMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rPassword === password) {
            const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
            const token = params.get("token");
            try {
                const res = await fetch(`http://localhost:3000/newpassword`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "token": token, "password": hashedPassword }),
                    credentials: 'include'
                });
                const responseData = await res.json();
                setResponseMessage(responseData);

            } catch (error) {
                console.error('Errore durante la richiesta:', error);
            }
            finally {
                await sleep(3000);
                navigate('/')
            }
        } else { setResponseMessage("le password non coincidono...") }
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <h1 className={styles.title} > Password dimenticata </h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        new password:
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        repeat new password:
                        <input
                            type="password"
                            className={styles.input}
                            value={rPassword}
                            onChange={(e) => setRpassword(e.target.value)}
                            required
                        />
                    </label>
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.button}>change password</button>
                    </div>
                </form>
                {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
            </div>
        </div>

    );
}

export default NewPassword;