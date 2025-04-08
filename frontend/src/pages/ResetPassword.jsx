import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:1000/api/v1/reset-password/${token}`, { newPassword });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response.data.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-8 rounded shadow w-96">
        <h2 className="text-xl text-zinc-200 text-center mb-4">Reset Password</h2>
        <input
          type="password"
          className="bg-zinc-900 w-full p-2 rounded mb-4"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
