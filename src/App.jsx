import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Menu from "./pages/Menu";
import CustomerLogin from "./pages/CustomerLogin";
import { CartProvider } from './context/CartContext';

function App() {
  

  return (
   <CartProvider>
      <Router>
        <Routes>
         <Route path="/" element={<CustomerLogin />} />
         <Route path="/menu" element={<Menu />} />
         <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </CartProvider> 

  )
}

export default App








