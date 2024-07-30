// Inventory.js
import React, { useState, useEffect } from 'react';
import './Inventory.css'; // Include your CSS file

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [prices] = useState({
    // Your predefined prices
  });

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('inventory')) || [];
    setProducts(savedProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (selectedProduct && productQuantity) {
      setProducts([...products, { name: selectedProduct, quantity: parseInt(productQuantity) }]);
      setSelectedProduct('');
      setProductQuantity('');
    } else {
      alert('Veuillez entrer le nom du produit et la quantité');
    }
  };

  return (
    <div className="Inventory">
      <h1>Inventaire CathyStore</h1>
      <form onSubmit={handleAddProduct}>
        <label>
          Nom du produit:
          <input
            type="text"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          />
        </label>
        <label>
          Quantité:
          <input
            type="number"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            min="1"
            required
          />
        </label>
        <button type="submit">Ajouter</button>
      </form>

      <h2>Inventaire</h2>
      <table>
        <thead>
          <tr>
            <th>Nom du produit</th>
            <th>Quantité</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{(product.quantity * (prices[product.name] || 0)).toFixed(2)} F</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
