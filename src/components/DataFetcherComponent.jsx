import { sessionUrl } from '../url/url'
import { createCustomerUrl } from '../url/url'
import { getPublicMenuUrl } from '../url/url'

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import axios from 'axios'
import Spinner from './Spinner'


function DataFetcherComponent() {

  const navigate = useNavigate()
  const [dataParam, setDataParam] = useState(null);
  const [sParam, setSParam] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    source: "guest", // default value
  });

 
  useEffect(() => {
    
    
    const processQueryParams = () => {
        setLoading(true)
      const queryString = window.location.search;

    
      // Use URLSearchParams to easily extract keys
      const params = new URLSearchParams(queryString);
      
      const rawData = params.get('data');
      const rawSignature = params.get('s');

     
        // Save the raw, unparsed values to state
        setDataParam(rawData);
        setSParam(rawSignature);
      
      
     setLoading(false);
    };

    
    

    
    processQueryParams();
  }, []);

  useEffect(()=>{

     console.log("sessionToken: " , sessionToken)

  }, [sessionToken])

async function startSession() {

  try {
    setLoading(true)
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

      // Store in state
      setSessionToken(token);

      //Store in localStorage
      localStorage.setItem("sessionToken", token);

      // customerLogin()
       setLoading(false)

      
    }

  } catch (err) {
    setLoading(false)
    console.error("Error:", err.response?.data || err.message);
  }
}

async function customerLogin () {

  try {

  const token = localStorage.getItem("sessionToken");

const body = formData;
console.log("body", body)

     
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

    //  if (createRes.data.status === "success") {
     
    //   const token = localStorage.getItem("sessionToken");
      const menuRes = await axios.get(
        getPublicMenuUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      )
   
      // console.log("Create Customer Response:", createRes.data);
      console.log("menu Res:", menuRes.data)
      navigate("/menu", { state: menuRes.data });
      setLoading(false)
      
     
    // }
    } catch(error) {
      console.error("Error fetching menu:", error);
        setLoading(false);
        
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
    
    <div className='bg-amber-200 border-black border-8 h-1/2 w-1/2 mx-auto my-auto'>
       <button className='text-white bg-amber-300 ml-1.5 py-2 px-4 rounded-2xl' onClick={()=>customerLogin()}>
       Login
    </button>
     
      
      {loading ? (
        <Spinner/>
      ) :
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

   

      }
    </div>


  );
}

export default DataFetcherComponent