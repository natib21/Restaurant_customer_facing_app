import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Menu from '../pages/Menu';
import CustomerLogin from '../pages/CustomerLogin';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerLogin />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}