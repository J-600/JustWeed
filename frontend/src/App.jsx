import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './components/navbar/topbarLogin';
import styles from './components/styles/login.module.css';
import Loader from './components/loader/loader';
import CryptoJS from 'crypto-js';


function App() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const [islogged, setIslogged] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/products', {
          credentials: 'include',
        });

        if (res.ok) {
          const sessionRes = await fetch('http://localhost:3000/session', {
            credentials: 'include',
          });

          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            navigate('/products', {
              state: {
                email: sessionData.email,
                username: sessionData.username
              }
            });
            
          }
          
        }
        setIslogged(true)
      } catch (error) {
        console.log('Not authenticated');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    // console.log("Hashed Password:", hashedPassword)

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "username": mail, "password": hashedPassword }),
        credentials: 'include',
      });

      // console.log(mail,password);

      const data = await res.json()
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
  if (islogged === null) {
    return (<div className={styles.page}><TopBar></TopBar><div className='loaderContainer'>
      <Loader />
    </div></div>);
  }

  return (
    <div className={styles.page}>
      <TopBar></TopBar>
      <div className={styles.container}>
        <h1 className="text-4xl font-bold text-center pb-10" style={{ textShadow: '0 0 10px rgb(121, 169, 236), 0 0 20px rgb(121, 169, 236)' }}>
          Login
        </h1>


        <form onSubmit={handleSubmit}>
          <label className="input input-bordered input-info bg-blue-200 flex items-center gap-2 text-black transition-colors duration-300 hover:bg-blue-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="black"
              className="h-4 w-4 opacity-70">
              <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" className="grow" placeholder="Username o mail"
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
              fill="black"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd" />
            </svg>
            <input type="password" className="grow focus:outline-none" placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </label>
          <br />
          <div className={styles.buttonContainer}>
            <button type="submit" className="btn btn-wide bg-[#79a9ec] border-[#79a9ec] text-white hover:bg-[#5c81b6] hover:border-[#5c81b6]">
              Login
            </button>
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
