import { sessionUrl } from './url/url'
import { createCustomerUrl } from './url/url'
import { getPublicMenuUrl } from './url/url'

import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {

  return (
    <>
      <div className='bg-amber-300 text-black'>

       <DataFetcherComponent/>
       
      </div>
      
    </>
  )
}

export default App





function DataFetcherComponent() {
  const [dataParam, setDataParam] = useState(null);
  const [sParam, setSParam] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    source: "guest", // default value
  });

  // useEffect runs once after the component mounts
  useEffect(() => {
    
    const processQueryParams = () => {
      const queryString = window.location.search;

      if (!queryString) {
        setError("No query parameters found in the URL.");
        setLoading(false);
        return;
      }

      // Use URLSearchParams to easily extract keys
      const params = new URLSearchParams(queryString);
      
      const rawData = params.get('data');
      const rawSignature = params.get('s');

      if (!rawData || !rawSignature) {
        setError("Missing 'data' or 's' parameter in the URL.");
      } else {
        // Save the raw, unparsed values to state
        setDataParam(rawData);
        setSParam(rawSignature);
      }
      
      setLoading(false);
    };

    
    

    
    processQueryParams();
    // startSession()
  }, []);

  useEffect(()=>{

     console.log("sessionToken: " , sessionToken)

  }, [sessionToken])

async function startSession() {
  try {
    const res = await axios.post(
      `${sessionUrl}data=${dataParam}&s=${sParam}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", res.data);

    if (res.data.status === "success") {
      const token = res.data.data.sessionToken;

      // 👉 Store in state
      setSessionToken(token);

      // 👉 Store in localStorage
      localStorage.setItem("sessionToken", token);

      customerLogin()

      
    }

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

async function customerLogin () {

  const token = localStorage.getItem("sessionToken");

const body = formData;

     
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

     if (createRes.data.status === "success") {
      const token = localStorage.getItem("sessionToken");
      const menuRes = await axios.get(
        getPublicMenuUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      )

      
     


      console.log("Create Customer Response:", createRes.data);
      console.log("menu Res:", menuRes.data)
     }
    }


  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
     startSession()
  };

  // --- Component Rendering ---
  return (
    <>
    <div>
     
      
      {loading ? (
        <p>Loading⏳...</p>
      ) : error ? (
        <p className='text-red-500'>🚨 Error: **{error}**</p>
      ) : (dataParam && sParam) ? (
        <form
      className="border border-amber-100 py-1.5 p-4 space-y-3"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <select
        name="source"
        value={formData.source}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="guest">Guest</option>
        <option value="registered">Registered</option>
        <option value="referral">Referral</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
      ) : (
        <p>No valid parameters could be processed.</p>
      )}
    </div>

    {/* <button className='bg-amber-950 rounded-2xl text-white' onClick={()=> startSession()}>
      Start Session
    </button> */}

  
    </>


  );
}



