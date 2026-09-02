import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Menu from "./pages/Menu";
import Landing from "./pages/Landing";
import { CartProvider } from "./context/CartContext";
import Rcart from "./pages/Rcart";
import HeaderAll from "./components/HeaderAll";
import BottomNavBar from "./components/BottomNavBar";
import { FilteredMenuProvider } from "./context/FilteredMenuContext";
import Order from "./pages/Order";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import Bill from "./pages/Bill";
import Favorites from "./pages/Favorites";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import { CustomerProvider } from "./context/CustomerContext";

function App() {
  return (
    <CustomerProvider>
      <CartProvider>
        <Router>
          <FilteredMenuProvider>
            <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a]">
              <HeaderAll />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/qr" element={<Landing />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Rcart />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/orders/:orderId" element={<OrderDetails />} />
                  <Route path="/order/:orderId" element={<OrderDetails />} />
                  <Route path="/tracking" element={<OrderDetails />} />
                  <Route path="/tracking/:orderId" element={<OrderDetails />} />
                  <Route path="/history" element={<OrderHistory />} />
                  <Route path="/bill" element={<Bill />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="*"
                    element={
                      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-[#efeeeb] text-[#005136] rounded-2xl flex items-center justify-center mb-3">
                          <span className="material-symbols-outlined text-[32px]">error</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#1a1c1a] mb-1">Page Not Found</h2>
                        <p className="text-xs text-[#3f4943] mb-4">
                          The requested page does not exist.
                        </p>
                        <a
                          href="/menu"
                          className="px-4 py-2 bg-[#005136] text-white font-semibold text-xs rounded-xl"
                        >
                          Go to Menu
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </div>
              <BottomNavBar />
            </div>
          </FilteredMenuProvider>
        </Router>
      </CartProvider>
    </CustomerProvider>
  );
}

export default App;
