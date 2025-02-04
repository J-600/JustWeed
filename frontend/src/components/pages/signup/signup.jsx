import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbarLogin';
import styles from '../../styles/signup.module.css';
import CryptoJS from 'crypto-js';


function Signup(){
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    // const [hash, setHash] = useState('');
    // const crypto = require('crypto-js');
    const [responseMessage, setResponseMessage] = useState(null);
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        try{
            // setHash(CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex))
            // console.log(hash);   
            const res = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email" : mail, "username" : username, "password" : hashedPassword}),
                credentials: 'include',
            });
            const data = await res.json();
            // console.log(data)
            setResponseMessage(data);
        } catch (error){
            console.log("errore durante la richiesta:", error)
            setResponseMessage("errore");
        }
    };
    return (
        <div className = {styles.page} >
            <TopBar></TopBar>
            <div className = {styles.container}>
                <h1 className = {styles.title} > Sign up </h1>
                <form onSubmit = {handleSubmit} >
                    <label>
                        email:
                        <input 
                            type = "email" 
                            className = {styles.input} 
                            value = {mail}
                            onChange = {(e) => setMail(e.target.value)}
                            required/>
                        
                    </label>
                    
                    <br/>
                    <label>
                        username:
                        <input 
                            type = "text"
                            className = {styles.input}
                            value = {username}
                            onChange = {(e) => setUsername(e.target.value)}
                            required/>
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input 
                            type = "password"
                            className = {styles.input}
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}/>
                    </label>
                    <br/>
                    <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.button}>Signup</button>
                              </div>
                </form>
                {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
            </div>

        </div>

    );
}

export default Signup;