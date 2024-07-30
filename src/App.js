import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // Define prices for each item
  const prices = {
    'Savon ultra blanchissant': 12000,
    'Savon noir blanchissant naija': 10000,
    'Savon teint métissé dosé': 10000,
    'Savon teint marron clair': 10000,
    'Savon tomato blanchissant': 9000,
    'Gel douche blanchissant': 10000,
    'Gel douche blanchissant (petit)': 5000,
    'Gel douche terminator': 12000,
    'Lait ultra blanchissant': 15000,
    'Lait extra métissé': 10000,
    'Lait teint marron clair': 7000,
    'Kit visage blanchissant': 15000,
    'Kit visage métissé': 13000,
    'Gamme ultra blanchissant': 50000,
    'Gamme blanchissant': 40000,
    'Gamme métissé dosé': 26000,
    'Gamme métissé (simple)': 25000,
    'Gamme marron clair': 18000,
    'Mini gamme': 15000,
    'Gommage blanchissant': 5000,
    'Gommage café': 5000,
    'Gommage blanchissant nila': 5000,
    'Crème visage super blanchissant': 5000,
    'Crème métissée': 3000,
    'Savon visage blanchissant': 5000,
    'Savon visage acné': 5000,
    'Lotion visage blanchissant': 5000,
    'Booster super blanchissant': 10000,
    'Sérum Quinto': 10000,
    'Crème Quinto': 8000,
  };

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [selectedSupplierProduct, setSelectedSupplierProduct] = useState('');
  const [supplierOrderQuantity, setSupplierOrderQuantity] = useState('');

  // Fetch data from localStorage on initial render
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('inventory')) || [];
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const savedCompletedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
    const savedSupplierOrders = JSON.parse(localStorage.getItem('supplierOrders')) || [];
    setProducts(savedProducts);
    setOrders(savedOrders);
    setCompletedOrders(savedCompletedOrders);
    setSupplierOrders(savedSupplierOrders);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(products));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    localStorage.setItem('supplierOrders', JSON.stringify(supplierOrders));
  }, [products, orders, completedOrders, supplierOrders]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (selectedProduct && productQuantity) {
      setProducts([...products, { name: selectedProduct, quantity: parseInt(productQuantity) }]);
      setSelectedProduct('');
      setProductQuantity('');
    } else {
      alert('Veuillez entrer à la fois le nom du produit et la quantité');
    }
  };

  const handleReceiveOrder = (e) => {
    e.preventDefault();
    if (selectedOrderProduct && orderQuantity && customerName && customerPhone) {
      const productInStock = products.find(product => product.name === selectedOrderProduct);
      if (productInStock) {
        setOrders([...orders, { name: selectedOrderProduct, quantity: parseInt(orderQuantity), customerName, customerPhone }]);
        setSelectedOrderProduct('');
        setOrderQuantity('');
        setCustomerName('');
        setCustomerPhone('');
      } else {
        alert('L\'article n\'est pas en stock');
      }
    } else {
      alert('Veuillez entrer le nom du produit, la quantité, le nom du client et le numéro de téléphone');
    }
  };

  const handleCompleteOrder = (orderIndex) => {
    const order = orders[orderIndex];
    const updatedProducts = products.map(product => {
      if (product.name === order.name) {
        return { ...product, quantity: product.quantity - order.quantity };
      }
      return product;
    }).filter(product => product.quantity > 0);

    setProducts(updatedProducts);
    setCompletedOrders([...completedOrders, order]);
    setOrders(orders.filter((_, index) => index !== orderIndex));
  };

  const handleCancelOrder = (orderIndex) => {
    setOrders(orders.filter((_, index) => index !== orderIndex));
  };

  const handleAddSupplierOrder = (e) => {
    e.preventDefault();
    if (selectedSupplierProduct && supplierOrderQuantity) {
      setSupplierOrders([...supplierOrders, { name: selectedSupplierProduct, quantity: parseInt(supplierOrderQuantity) }]);
      setSelectedSupplierProduct('');
      setSupplierOrderQuantity('');
    } else {
      alert('Veuillez entrer à la fois le nom du produit et la quantité');
    }
  };

  const handleReceiveSupplierOrder = (orderIndex) => {
    const order = supplierOrders[orderIndex];
    const existingProduct = products.find(product => product.name === order.name);

    let updatedProducts;
    if (existingProduct) {
      updatedProducts = products.map(product => {
        if (product.name === order.name) {
          return { ...product, quantity: product.quantity + order.quantity };
        }
        return product;
      });
    } else {
      updatedProducts = [...products, { name: order.name, quantity: order.quantity }];
    }

    setProducts(updatedProducts);
    setSupplierOrders(supplierOrders.filter((_, index) => index !== orderIndex));
  };

  const handleCancelSupplierOrder = (orderIndex) => {
    setSupplierOrders(supplierOrders.filter((_, index) => index !== orderIndex));
  };

  const handleClearCompletedOrders = () => {
    setCompletedOrders([]);
  };

  // Format number to French notation
  const formatNumber = (number) => {
    return number.toLocaleString('fr-FR').replace(/,/g, '.');
  };

  // Calculate item value and total inventory value
  const calculateItemValue = (quantity, price) => quantity * price;
  const totalInventoryValue = products.reduce((total, product) => total + calculateItemValue(product.quantity, prices[product.name] || 0), 0);

  // Get unique product names from inventory for dropdown
  const productNames = Array.from(new Set(products.map(product => product.name)));

  return (
    <div className="App">
      <h1>Inventaire CathyStore</h1>
      
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleAddProduct}>
            <h2>Ajouter un produit</h2>
            <label>
              Nom du produit:
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">Sélectionnez un produit</option>
                {Object.keys(prices).map((product, index) => (
                  <option key={index} value={product}>{product}</option>
                ))}
              </select>
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

          <form onSubmit={handleReceiveOrder}>
            <h2>Recevoir la commande</h2>
            <label>
              Nom du produit:
              <select
                value={selectedOrderProduct}
                onChange={(e) => setSelectedOrderProduct(e.target.value)}
                required
              >
                <option value="">Sélectionnez un produit</option>
                {productNames.map((product, index) => (
                  <option key={index} value={product}>{product}</option>
                ))}
              </select>
            </label>
            <label>
              Quantité:
              <input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                min="1"
                required
              />
            </label>
            <label>
              Nom du client:
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </label>
            <label>
              Téléphone du client:
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </label>
            <button type="submit">Recevoir la commande</button>
          </form>

          <form onSubmit={handleAddSupplierOrder}>
            <h2>Commander auprès du fournisseur</h2>
            <label>
              Nom du produit:
              <select
                value={selectedSupplierProduct}
                onChange={(e) => setSelectedSupplierProduct(e.target.value)}
                required
              >
                <option value="">Sélectionnez un produit</option>
                {Object.keys(prices).map((product, index) => (
                  <option key={index} value={product}>{product}</option>
                ))}
              </select>
            </label>
            <label>
              Quantité:
              <input
                type="number"
                value={supplierOrderQuantity}
                onChange={(e) => setSupplierOrderQuantity(e.target.value)}
                min="1"
                required
              />
            </label>
            <button type="submit">Commander</button>
          </form>

          <button onClick={handleClearCompletedOrders}>Vider les commandes terminées</button>
        </div>

        <div className="table-container">
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
                  <td>{formatNumber(calculateItemValue(product.quantity, prices[product.name] || 0))} F</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Commandes client</h2>
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

          <h2>Commandes fournisseur</h2>
          <table>
            <thead>
              <tr>
                <th>Nom du produit</th>
                <th>Quantité</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {supplierOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <button onClick={() => handleReceiveSupplierOrder(index)}>Recevoir</button>
                    <button onClick={() => handleCancelSupplierOrder(index)}>Annuler</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Commandes terminées</h2>
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
      </div>

      <h2>Total de l'inventaire</h2>
      <p>{formatNumber(totalInventoryValue)} F</p>
    </div>
  );
};

export default App;
