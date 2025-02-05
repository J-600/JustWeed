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
                    <div className="relative w-full pb-10">
                        <button
                            className="btn btn-sm bg-[#79a9ec] border-[#79a9ec] text-white hover:bg-[#5c81b6] hover:border-[#5c81b6] px-2 absolute left-0"
                            onClick={() => window.history.back()}
                        >
                            ⬅
                        </button>
                        <h1 className="text-4xl font-bold text-center" style={{ textShadow: '0 0 10px rgb(121, 169, 236), 0 0 20px rgb(121, 169, 236)' }}>
                            Password dimenticata
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label className="input input-bordered input-info bg-blue-200 flex items-center gap-2 text-black transition-colors duration-300 hover:bg-blue-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                            </svg>
                            <input type="email" className="grow" placeholder="Email"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <div className={styles.buttonContainer}>
                            <button type="submit" className="btn btn-wide bg-[#79a9ec] border-[#79a9ec] text-white hover:bg-[#5c81b6] hover:border-[#5c81b6]">Send email
                            </button>
                        </div>
                    </form>
                    {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
                </div>
            )}

        </div>
    );

}

export default ForgotPassword;