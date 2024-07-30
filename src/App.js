import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './Inventory';
import OrderManagement from './OrderManagement';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Inventaire</Link></li>
            <li><Link to="/orders">Gestion des commandes</Link></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
