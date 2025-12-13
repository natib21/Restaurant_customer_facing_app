import { getPublicMenuUrl, createCustomerUrl } from '../url/url';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from './Spinner';
import { useStartSession } from '../hooks/useStartSession';
import LoginForm from './LoginForm';

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
      


       const createRes = await axios.post(
        createCustomerUrl,    
        body,                  
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Create Customer Response:", createRes.data);


      // //  STEP 2: FETCH MENU 
      // const menuRes = await axios.get(
      //   getPublicMenuUrl,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     }
      //   }
      // );
      
      // console.log("Menu Response:", menuRes.data);
      navigate("/menu");
      
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

  
  return (
        <LoginForm
            loading={loading}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
         />

  );
}

export default DataFetcherComponent;     