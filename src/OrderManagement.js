// OrderManagement.js
import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const savedCompletedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
    setOrders(savedOrders);
    setCompletedOrders(savedCompletedOrders);
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
  }, [orders, completedOrders]);

  const handleCompleteOrder = (index) => {
    const order = orders[index];
    setCompletedOrders([...completedOrders, order]);
    setOrders(orders.filter((_, i) => i !== index));
  };

  const handleCancelOrder = (index) => {
    setOrders(orders.filter((_, i) => i !== index));
  };

  return (
    <div className="OrderManagement">
      <h1>Gestion des Commandes</h1>
      
      <h2>Commandes Reçues</h2>
      <table>
        <thead>
          <tr>
            <th>Nom du produit</th>
            <th>Quantité</th>
            <th>Nom du client</th>
            <th>Téléphone du client</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>{order.customerName}</td>
              <td>{order.customerPhone}</td>
              <td>
                <button onClick={() => handleCompleteOrder(index)}>Terminer</button>
                <button onClick={() => handleCancelOrder(index)}>Annuler</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Commandes Terminées</h2>
      <table>
        <thead>
          <tr>
            <th>Nom du produit</th>
            <th>Quantité</th>
            <th>Nom du client</th>
            <th>Téléphone du client</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>{order.customerName}</td>
              <td>{order.customerPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
