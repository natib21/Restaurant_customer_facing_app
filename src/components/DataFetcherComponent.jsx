// DataFetcherComponent.jsx
import { getPublicMenuUrl } from '../url/url';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from './Spinner';
import { useStartSession } from '../hooks/useStartSession';

function DataFetcherComponent() {

  const navigate = useNavigate();
  const [dataParam, setDataParam] = useState(null);
  const [sParam, setSParam] = useState(null);
  const [sessionToken, setSessionToken] = useState(localStorage.getItem("sessionToken")); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    source: "guest",
  });

  // 1. customerLogin is updated to include the customer creation step
  const customerLogin = useCallback(async (tokenOverride) => {
    const token = tokenOverride || localStorage.getItem("sessionToken");

    if (!token) {
        console.error("No session token found for customer login.");
        setLoading(false);
        return;
    }

    try {
      const body = formData;
      console.log("Customer Creation Body:", body);
      
      // STEP 1: CREATE/UPDATE CUSTOMER 
      // const createRes = await axios.post(
      //   createCustomerUrl,
      //   body,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // console.log("Create Customer Response:", createRes.data);


      // 🚀 STEP 2: FETCH MENU 🚀
      const menuRes = await axios.get(
        getPublicMenuUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      
      console.log("Menu Response:", menuRes.data);
      navigate("/menu", { state: menuRes.data });
      
    } catch(error) {
      console.error("Error during customer creation/menu fetch:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [navigate, formData]); // **Dependencies updated to include formData and createCustomerUrl**

  // Use the custom hook for startSession
  const startSession = useStartSession(dataParam, sParam, customerLogin, setLoading, setSessionToken);

  // --- Effect 1: Process Query Params ---
  useEffect(() => {
    const processQueryParams = () => {
      const queryString = window.location.search;
      const params = new URLSearchParams(queryString);
      
      const rawData = params.get('data');
      const rawSignature = params.get('s');

      if (rawData && rawSignature) {
        setDataParam(rawData);
        setSParam(rawSignature);
      }
    };
    
    processQueryParams();
  }, []);

  
  // --- Effect 2: Automatically Start Session if Params Exist ---
  useEffect(() => {
    
    const runAutoSession = async () => {
        // If data/s params exist and we don't have a token, start session and login
        if (dataParam && sParam && !sessionToken) {
            await startSession(true);
        }
    };

    runAutoSession();
    
  }, [dataParam, sParam, sessionToken, startSession]); 

  
  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (dataParam && sParam) {
        // Start session, which automatically calls customerLogin after
        await startSession(true);
    } else {
        // If no URL params, try to use existing token to log in/create customer
        await customerLogin();
    }
  };

  // --- Component Rendering (Improved UI: Better contrast for inputs and banner) ---
  return (
    // <div className='min-h-screen bg-amber-50 flex items-center justify-center p-4'>
      
    //   <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-amber-200'>
        
    //     <h2 className='text-3xl font-extrabold text-amber-700 mb-4 text-center tracking-tight'>
    //       ✨ Welcome, Guest!
    //     </h2>

    //     <div className='bg-amber-100 border-2 border-amber-300 rounded-lg p-4 mb-6 shadow-inner'>
    //       <p className='text-amber-900 font-bold text-center text-base leading-relaxed'>
    //         Please fill out the form to view the menu and place your order, dear guest! 🍽️
    //       </p>
    //     </div>
        
    //     {loading ? (
    //       <div className='flex justify-center py-12'>
    //         <Spinner />
    //         <p className='ml-3 text-amber-600 font-semibold'>Processing...</p>
    //       </div>
    //     ) : (
    //       <form onSubmit={handleSubmit} className="space-y-6">
            
    //         <div>
    //           <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
    //             Full Name
    //           </label>
    //           <input
    //             type="text"
    //             name="fullName"
    //             id="fullName"
    //             placeholder="Enter your full name"
    //             value={formData.fullName}
    //             onChange={handleChange}
    //             required
    //             className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 bg-white"
    //           />
    //         </div>

    //         <div>
    //           <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
    //             Phone Number
    //           </label>
    //           <input
    //             type="tel" 
    //             name="phone"
    //             id="phone"
    //             placeholder="e.g., 555-1234"
    //             value={formData.phone}
    //             onChange={handleChange}
    //             required
    //             className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 bg-white"
    //           />
    //         </div>

    //         <div>
    //           <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
    //             Source
    //           </label>
    //           <select
    //             name="source"
    //             id="source"
    //             value={formData.source}
    //             onChange={handleChange}
    //             className="block w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition duration-150"
    //           >
    //             <option value="guest">Guest</option>
    //             <option value="registered">Registered</option>
    //             <option value="referral">Referral</option>
    //           </select>
    //         </div>

    //         <button
    //           type="submit"
    //           className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-bold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200 ease-in-out transform hover:scale-[1.01]"
    //         >
    //           Continue
    //         </button>
            
    //       </form>
    //     )}

    //   </div>
    // </div>
    <div className="min-h-screen  flex items-center justify-center p-4">

  <div className="w-full max-w-md bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-amber-400 shadow-2xl p-4 sm:p-6 backdrop-blur-sm rounded-2xl md:rounded-3xl lg:rounded-3xl">

    {/* Decorative Glow */}
    <div className="absolute inset-x-0 -top-10 mx-auto w-40 h-40 rounded-full blur-3xl"></div>

    <h2 className="text-2xl font-bold text-stone-200 mb-4 text-center drop-shadow-sm">
      🍽️ Welcome!
    </h2>

    <p className="text-center text-stone-400 font-medium rounded-lg p-3 mb-8 shadow-inner">
      Please Enter your details to view the menu & order.
    </p>

    {loading ? (
      <div className="flex flex-col justify-center items-center py-12 space-y-3">
        <Spinner />
        {/* <p className="text-amber-600 font-semibold text-lg animate-pulse">
          Preparing your experience...
        </p> */}
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* FULL NAME */}
        <div>
          <label className="block text-sm font-semibold text-stone-400 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="e.g., John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={`block w-full px-4 py-3
            ${formData.fullName.trim() === "" ? "bg-stone-300" : "bg-stone-100"}
            text-stone-900 placeholder-gray-500
            border-2 border-gray-300 rounded-lg shadow-sm
            focus:ring-2 focus:ring-amber-500 focus:border-amber-500
            transition duration-150`}

          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-semibold text-stone-400 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="e.g., +251 912 345 678"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`block w-full px-4 py-3
            ${formData.fullName.trim() === "" ? "bg-stone-300" : "bg-stone-100"}
            text-stone-900 placeholder-gray-500
            border-2 border-gray-300 rounded-lg shadow-sm
            focus:ring-2 focus:ring-amber-500 focus:border-amber-500
            transition duration-150`}

          />
        </div>

        {/* SOURCE */}
        <div>
          <label className="block text-sm font-semibold text-stone-400 mb-1">
            How did you arrive here?
          </label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`block w-full px-4 py-3
            ${formData.fullName.trim() === "" ? "bg-stone-300" : "bg-stone-100"}
            text-stone-900 placeholder-gray-500
            border-2 border-gray-300 rounded-lg shadow-sm
            focus:ring-2 focus:ring-amber-500 focus:border-amber-500
            transition duration-150`}

          >
            <option value="guest">Guest</option>
            <option value="registered">Registered</option>
            <option value="referral">Referral</option>
          </select>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-3/4 sm:w-auto bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-2 px-2 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 uppercase tracking-wide text-sm sm:text-base shrink-0"
        >
          Continue to Menu →
        </button>

      </form>
    )}

  </div>

</div>


  );
}

export default DataFetcherComponent;