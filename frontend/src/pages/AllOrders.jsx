import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { FaUserLarge, FaCheck } from 'react-icons/fa6';
import { IoOpenOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import SeeUserData from './SeeUserData';

const AllOrders = () => {
  const [AllOrders, setAllOrders] = useState([]);  
  const [Options, setOptions] = useState(-1);
  const [Values, setValues] = useState({ status: "" });
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-all-orders", { headers });

        if (response.data && response.data.data) {
          setAllOrders(response.data.data);
        } else {
          setAllOrders([]);  // Ensures an array is always set
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setAllOrders([]);  // Prevents crash if API fails
      }
    };

    fetchOrders();
  }, []);  // Now runs only ONCE when component mounts

  const change = (e) => {
    setValues({ status: e.target.value });
  };

  const submitChanges = async (i) => {
    try {
      const id = AllOrders[i]._id;
      const response = await axios.put(
        `http://localhost:1000/api/v1/update-status/${id}`,
        Values,
        { headers }
      );
      alert(response.data.message);

      // Update order status locally to reflect changes immediately
      setAllOrders((prevOrders) =>
        prevOrders.map((order, index) =>
          index === i ? { ...order, status: Values.status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <>
      {!AllOrders.length ? (
        <div className='h-[100%] flex items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='h-[100%] p-0 md:p-4 text-zinc-100'>
          <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
            All Orders
          </h1>

          {/* Table Header */}
          <div className='mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2'>
            <div className='w-[3%] text-center'>Sr.</div>
            <div className='w-[40%] md:w-[22%]'>Books</div>
            <div className='w-0 md:w-[45%] hidden md:block'>Description</div>
            <div className='w-[17%] md:w-[9%]'>Price</div>
            <div className='w-[30%] md:w-[16%]'>Status</div>
            <div className='w-[10%] md:w-[5%]'><FaUserLarge /></div>
          </div>

          {/* Orders List */}
          {AllOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No orders found</div>
          ) : (
            AllOrders.map((items, i) => (
              <div key={items._id} className='bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300'>
                <div className='w-[3%] text-center'>{i + 1}</div>
                <div className='w-[40%] md:w-[22%]'>
                  <Link to={`/view-book-details/${items?.book?._id}`} className='hover:text-blue-300'>
                    {items?.book?.title || "Unknown Book"}
                  </Link>
                </div>
                <div className='w-0 md:w-[45%] hidden md:block'>
                  <h1>{items?.book?.desc?.slice(0, 50) || "No Description"} ...</h1>
                </div>
                <div className='w-[17%] md:w-[9%]'>₹ {items?.book?.price || "0"}</div>

                {/* Order Status */}
                <div className='w-[30%] md:w-[16%] font-semibold'>
                  <button
                    className='hover:scale-105 transition-all duration-300'
                    onClick={() => setOptions(i)}
                  >
                    {items.status === "Order Placed" ? (
                      <div className='text-yellow-500'>{items.status}</div>
                    ) : items.status === "Canceled" ? (
                      <div className='text-red-500'>{items.status}</div>
                    ) : (
                      <div className='text-green-500'>{items.status}</div>
                    )}
                  </button>

                  {Options === i && (
                    <div className="flex mt-4">
                      <select
                        name='status'
                        className='bg-gray-800'
                        onChange={change}
                        value={Values.status}
                      >
                        {["Order Placed", "Out of Delivery", "Delivered", "Canceled"].map((statusOption, index) => (
                          <option value={statusOption} key={index}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                      <button
                        className='text-green-500 hover:text-pink-600 mx-2'
                        onClick={() => {
                          setOptions(-1);
                          submitChanges(i);
                        }}
                      >
                        <FaCheck />
                      </button>
                    </div>
                  )}
                </div>

                {/* User Details Button */}
                <div className='w-[10%] md:w-[5%]'>
                  <button
                    className='text-xl hover:text-orange-500'
                    onClick={() => {
                      setuserDiv("fixed");
                      setuserDivData(items?.user);
                    }}
                  >
                    <IoOpenOutline />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* User Data Modal */}
      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setuserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
