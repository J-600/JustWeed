import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Usa useNavigate da react-router-dom
import styles from './components/styles/login.module.css'; // Assicurati che il percorso sia corretto
import './App.css';

function App() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate(); // Usa useNavigate per la navigazione in React

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail, password }),
        credentials: 'include', // Aggiungi i cookie nella richiesta
      });

      const data = await res.json();

      if (data.message) {
        setResponseMessage('Login riuscito');

        console.log(data);

        // Assumiamo che i dati dello studente siano disponibili in data.data[0]
        const email = data.data[0].email;
        const username = data.data[0].username;

        // Reindirizza alla pagina dello studente
        navigate('/home', { state: { email, username } });
      } else {
        setResponseMessage(data.message || 'Errore nel login');
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setResponseMessage('Errore durante la richiesta');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Mail:
            <input
              type="email"
              className={styles.input}
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Password:
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
      </div>
    </div>
  );
}

export default App;
