import { useState, useMemo, useEffect, useContext } from "react";
import axios from "axios";
import Footer from "../features/menu/components/Footer.jsx";
import Header from "../features/menu/components/Header";
import Main from "../features/menu/components/Main.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { getPublicMenuUrl } from "../url/url.js";



export default function Menu() {
 const token = localStorage.getItem("sessionToken");
 const [menu, setMenu] =  useState([]);
 const [restaurant, setRestaurant] =useState("")

    useEffect(()=> {
      async function getMenu() {
  const menuRes = await axios.get(
        getPublicMenuUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      if (menuRes.status ===200) {

        const menu = menuRes.data;
        console.log("menu data", menu.data.menus)
        console.log("restaurnat", menu.restaurant
)
          // const restaurant = menu?.restaurant || "Menu";
          setMenu(menu.data.menus)
          setRestaurant(menu.restaurant)


      }
    }
      getMenu()
     
    },[])

  const {cartItems,  totalItems} = useContext(CartContext)
  // const menus = useMemo(() => state?.data?.menus || [], [state]);



  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);


  function onSearchChange (value) {
    setSearchValue(value);

  }

  const filteredMenus = useMemo(() => {
    return menu.filter((menu) =>
      menu.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [menu, searchValue]);


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header - Sticky */}
      <Header restaurantName={restaurant} totalItems={totalItems}  onSearchChange={onSearchChange} />

       
       <Main menus={filteredMenus} />

      {/* Sticky Footer */}
      {totalItems > 0 && (
        <Footer />
      )}
    </div>
  );
}
