import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './components/navbar/topbarLogin';
import styles from './components/styles/login.module.css';


function App() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const [hash, setHash] = useState('');
  const crypto = require('crypto');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setHash(crypto.createHash('sha1').update(password).digest('hex'))
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "username": mail, "password": hash }),
        credentials: 'include',
      });

      // console.log(mail,password);

      const data = await res.json();

      try {
        if (data.email == null) {
          throw new Error("error");
        }
        const email = data.email;
        const username = data.username;
        setResponseMessage("login riuscito");
        navigate('/products', { state: { email, username } });
      } catch (error) {
        setResponseMessage(data);
      }

    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setResponseMessage('Errore durante la richiesta');
    }
  };

  return (
    <div className={styles.page}>
      <TopBar></TopBar>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            username o mail:
            <input
              type="text"
              className={styles.input}
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            password:
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button}>Login</button>
          </div>
        </form>

        {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
        <div className={styles.bottomContainer}>
          <div className={styles.forgotPassword}>
            <a href='/forgotpassword'> forgot password?</a>
          </div>
          <div className={styles.newAcc}>
            <a href='/signup'> sign up</a>
          </div>
        </div>




      </div>
    </div>
  );
}

export default App;
