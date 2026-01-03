import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilteredMenuContext } from "../context/FilteredMenuContext";
import Spinner from "./Spinner";

export default function DataFetcherComponent() {
  const navigate = useNavigate();
  const { isLoading, error } = useContext(FilteredMenuContext);

  useEffect(() => {
    // If session is done loading and there is no error, go to menu
    if (!isLoading && !error) {
      navigate("/menu");
    }
  }, [isLoading, error, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="p-6 border border-red-500 rounded-lg bg-gray-800 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <Spinner />
      <p className="mt-4 text-amber-400 animate-pulse">Initializing Session...</p>
    </div>
  );
}