import React, { useState } from 'react';
import axios from "axios";


const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email) {
      alert("Please enter your email address");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/forgot-password", 
        { email },
        { validateStatus: (status) => status < 500 } // don't throw for 4xx errors
      );
      
      if (response.status === 200) {
        alert(response.data.message);
      } else {
        alert(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Server error occurred");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 w-full sm:w-96">
        <h2 className="text-xl text-center text-zinc-200">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full mt-2 p-2 bg-zinc-900  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
