import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbarLogin';
import styles from '../../styles/signup.module.css';
import CryptoJS from 'crypto-js';


function Signup() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    // const [hash, setHash] = useState('');
    // const crypto = require('crypto-js');
    const [responseMessage, setResponseMessage] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        try {
            // setHash(CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex))
            // console.log(hash);   
            const res = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "email": mail, "username": username, "password": hashedPassword }),
                credentials: 'include',
            });
            const data = await res.json();
            // console.log(data)
            setResponseMessage(data);
        } catch (error) {
            console.log("errore durante la richiesta:", error)
            setResponseMessage("errore");
        }
    };
    return (
        <div className={styles.page} >
            <TopBar></TopBar>
            <div className={styles.container}>
                <h1 className="text-4xl font-bold text-center pb-10" style={{ textShadow: '0 0 10px rgb(121, 169, 236), 0 0 20px rgb(121, 169, 236)' }}>
                    Sign up
                </h1>
                <form onSubmit={handleSubmit} >
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
                    <label className="input input-bordered input-info bg-blue-200 flex items-center gap-2 text-black transition-colors duration-300 hover:bg-blue-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" className="grow" placeholder="Username" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required />
                    </label>
                    <br />
                    <label className="input input-bordered input-info bg-blue-200 flex items-center gap-2 text-black transition-colors duration-300 hover:bg-blue-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd" />
                        </svg>
                        <input
                            type="password" className="grow"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <br />
                    <div className={styles.buttonContainer}>
                    <button type="submit" className="btn btn-wide bg-[#79a9ec] border-[#79a9ec] text-white hover:bg-[#5c81b6] hover:border-[#5c81b6]">
      Signup
    </button>
                    </div>
                </form>
                {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
            </div>

        </div>

    );
}

export default Signup;