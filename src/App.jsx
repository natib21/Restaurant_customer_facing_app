import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Menu from "./pages/Menu";
import Landing from "./pages/Landing";
import { CartProvider } from './context/CartContext';
import Rcart from './pages/Rcart';

function App() {
  

  return (
   <CartProvider>
      <Router>
        <Routes>
         <Route path="/" element={<Landing />} />
         <Route path="/menu" element={<Menu />} />
         <Route path='/cart' element={<Rcart/>}/>
         <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </CartProvider> 

  )
}

export default App








