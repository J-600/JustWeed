import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbarLogin';
import styles from '../../styles/confirm.module.css';
import Loader from '../../loader/loader';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchConfirm = async () => {
      const token = params.get("token");
      let responseData;
      try {
        const res = await fetch(`http://localhost:3000/confirm?token=${token}`, {
          method: "GET",
          credentials: 'include'
        });
        responseData = await res.json();
        setData(responseData);

        if (responseData.message) {
          setEmail(responseData.email);
          setUsername(responseData.username);
        }
      } catch (error) {
        console.error('Errore durante la richiesta:', error);
      } finally {
        setLoading(false);

        if (responseData?.message) {
          await sleep(3000);
          navigate('/products', { state: { email: responseData.email, username: responseData.username } });
        }
      }
    };
    fetchConfirm();
  }, []);

  return (
    <div className={styles.page}>
      <TopBar />
      <div className={styles.container}>
        {loading ? (
          <div className='loaderContainer'>
            <Loader />
          </div>
        ) : (
          <>
            <h1 className={styles.titlePrimary}>{data?.data}</h1>
            <br />
          </>
        )}
      </div>
    </div>
  );
}

export default Confirm;
