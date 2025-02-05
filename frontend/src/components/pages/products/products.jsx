import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../navbar/topbar';
import styles from '../../styles/signup.module.css';

function Products() {
  const location = useLocation();
  const { email, username } = location.state || {};
  const [products, setProducts] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      console.log(email, username)
      try {
        const res = await fetch("http://localhost:3000/products", {
          method: "GET",
          credentials: 'include'
        });
        const data = await res.json();
        if (res.status != 200) {
          navigate("/");
        }
        setProducts(data);
      } catch (error) {
        console.error('Errore durante la richiesta:');
      }
    };
    fetchProduct();
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();


  };

  return (
    <div className={styles.page}>
      <TopBar username={username} email={email} />
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
            </div>) : <h2> {products.data} </h2>}
        </div>
      </div>
    </div>
  );
}

export default Products;
