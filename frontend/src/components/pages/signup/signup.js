
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './components/navbar/topbarLogin';
import styles from './components/styles/signup.module.css';

function Signup(){
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [responseMessage, setResponseMessage] = useState(null);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const res = await fetch('http://localhost/JustWeed/backend/includes/create-user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email" : mail, "username" : username, "passoword" : password}),
                credentials: 'include',
            });
            const data = await res.json();

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
                </form>
                {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
            </div>

        </div>

    );
}

export default Signup;