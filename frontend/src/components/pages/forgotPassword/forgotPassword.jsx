import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbarLogin';
import styles from '../../styles/login.module.css';
import Loader from '../../loader/loader';



function ForgotPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mail, setMail] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/forgotpassword", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "email": mail }),
                credentials: 'include'
            });
            const data = await res.json();
            setResponseMessage(data);
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
            setResponseMessage('Errore durante la richiesta');
        }
    }

    return (

        <div className={styles.page}>
            <TopBar></TopBar>
            {loading ? (
                <div className='loaderContainer'>
                    <Loader />
                </div>
            ) : (
                <div className={styles.container}>

                    <h1 className={styles.title} > Password dimenticata </h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            mail:
                            <input
                                type="email"
                                className={styles.input}
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.button}>Send Email</button>
                        </div>
                    </form>
                    {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
                </div>
            )}

        </div>
    );

}

export default ForgotPassword;