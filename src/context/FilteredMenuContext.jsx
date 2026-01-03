import { createContext, useMemo, useState } from "react"
import { useFetchMenu } from "../hooks/useFetchMenu";

const FilteredMenuContext = createContext()

function FilteredMenuProvider({children}) {
    const [searchValue, setSearchValue] = useState("");
   const {menu,isLoading,error, restaurant} = useFetchMenu();

      const filteredMenus = useMemo(() => {
    return (menu || []).filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [menu, searchValue]);
    
   return <FilteredMenuContext.Provider  value={{ filteredMenus, menu, searchValue, setSearchValue, isLoading, error, restaurant }}> 
    {children}
   </FilteredMenuContext.Provider>
}

export {FilteredMenuContext, FilteredMenuProvider}