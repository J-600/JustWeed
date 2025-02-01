import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbarLogin';
import styles from '../../styles/confirm.module.css';
import Loader from '../../loader/loader';

function Confirm(req,res) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null)
    
    useEffect (() => {
        const fetchConfirm = async ()=>{
            const token = params.get("token");
            const email = params.get("email");
          try {
            const res = await fetch(`http://localhost:3000/confirm?token=${token}&email=${email}`, {
              method: "GET",
          });
          const responseData = await res.json();
          setData(responseData);
          } catch (error) {
              console.error('Errore durante la richiesta:');
          }
          finally{
            setLoading(false);
          }
        };
        fetchConfirm();
      },[])

    //   if (loading) {
    //     return <div className='loaderContainer'><Loader /></div>;
    // }
      return (
      <div className = {styles.page} >
         <TopBar></TopBar>
          <div className = {styles.container}>
            {loading ? (
              <div className='loaderContainer'><Loader /></div>) :
              (
                <>
                <h1 className = {styles.titlePrimary}> {data} </h1> <br></br>
                </>
                
              )}
            
          </div>
        </div>
      );

}

export default Confirm; 