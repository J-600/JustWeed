// src/components/pages/products/products.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbar';

function Products() {
  const [mail, setMail] = useState('');
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState('');
  const navigate = useNavigate();

  useEffect (() => {
    const fetchProduct = async ()=>{
      try {
        const res = await fetch("http://localhost:3000/products", {
          method: "GET",
      });
      const data = await res.json();
      // console.log(data)
      setProducts(data);
      } catch (error) {
          console.error('Errore durante la richiesta:');
      }
    };
    fetchProduct();
  },[])

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    
  };

  return (
  <div className='layout'>
    <TopBar username={"asd"} mail={"asd@sd"}/>
    <div className='main'>
      <div className='content'>
        {Array.isArray(products) && products.length > 0 ? (
          <div>
          {
            products.map((product, index) => (
              <label>{product.name} - {product.description}</label>

              )
            )
          }
          </div>): <h2> {products.data} </h2>}
      </div>
    </div>
  </div>
  ) ;
}

export default Products;  // Make sure the component is named 'Products'
