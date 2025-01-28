import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbar';

function Confirm(req,res) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    
    useEffect (() => {
        const fetchConfirm = async ()=>{
            const token = params.get("token");
            const email = params.get("email");
          try {
            const res = await fetch(`http://localhost:3000/confirm?token=${token}&email=${email}`, {
              method: "GET",
          });
          const data = await res.json();
          // console.log(data)
        //   setProducts(data);
          } catch (error) {
              console.error('Errore durante la richiesta:');
          }
        };
        fetchConfirm();
      },[])

}

export default Confirm; 