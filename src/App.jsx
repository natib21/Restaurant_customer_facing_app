import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Menu from "./pages/Menu";
import Landing from "./pages/Landing";
import { CartProvider } from './context/CartContext';
import Rcart from './pages/Rcart';
import HeaderAll from './components/HeaderAll';
import { FilteredMenuProvider } from './context/FilteredMenuContext';
import Order from './pages/Order';

function App() {
  return (
    <CartProvider>
      <Router>
        <FilteredMenuProvider>
          <HeaderAll />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/menu" element={<Menu />} />
            <Route path='/cart' element={<Rcart/>}/>
            <Route path='/order' element={<Order/>}/>
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </FilteredMenuProvider>
      </Router>
    </CartProvider> 
  );
}

export default App;