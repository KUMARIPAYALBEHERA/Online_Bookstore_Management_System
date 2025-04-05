import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
import axios from 'axios'; // Added for backend connection

const Navbar = () => {
    // Define all possible links
    const allLinks = [
        {
            title: "Home",
            link: "/"
        },
        {
            title: "All Books",
            link: "/all-books"
        },
        {
            title: "Cart",
            link: "/cart"
        },
        {
            title: "Profile",
            link: "/profile"
        },
        {
            title: "Admin Profile",
            link: "/profile"
        }
    ];

    // Get user login status and role from Redux
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    // Filter the links dynamically based on login and role
    const links = allLinks.filter((item) => {
        if (!isLoggedIn && (item.title === "Cart" || item.title === "Profile" || item.title === "Admin Profile")) {
            return false;
        }
        if (role === "user" && item.title === "Admin Profile") {
            return false;
        }
        if (role === "admin" && item.title === "Profile") {
            return false;
        }
        return true;
    });

    const [MobileNav, setMobileNav] = useState("hidden");

    // Search box related states
    const [search, setSearch] = useState('');

    const [searchResults, setSearchResults] = useState([]); //  To store searched books


    // Optimized Search Function with API call
    const handleSearch = async () => {
        if (!search.trim()) {
            setSearchResults([]); // Clear previous results when input is empty
            return;
        }
        try {
            const response = await axios.get(`http://localhost:1000/api/v1/search?query=${search}`);
            setSearchResults(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error searching books:", error);
            setSearchResults([]);
        }
    };

    // Auto-clear results when input is empty
    useEffect(() => {
        if (!search.trim()) {
            setSearchResults([]);
        }
    }, [search]);

    // Debounce search to optimize API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 500); // Delay 500ms before sending request

        return () => clearTimeout(timer); // Cleanup timer
    }, [search]);

    return (
        <>
            <nav className="z-50 fixed top-0 left-0 w-full bg-transparent backdrop-blur-md text-white px-8 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        className="h-10 me-4"
                        src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
                        alt="logo"
                    />
                    <h1 className="text-2xl font-semibold">BookHeaven</h1>
                </Link>

                {/* SEARCH BAR */}
                <div className="hidden md:flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="p-2 rounded-full border text-yellow-500 bg-black text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <div className="nav-links-bookheaven block md:flex items-center gap-4">
                    <div className="hidden md:flex gap-4">
                        {links.map((items, i) => (
                            <div className='flex items-center' key={i}>
                                {items.title === "Profile" || items.title === "Admin Profile" ? (
                                    <Link
                                        to={items.link}
                                        className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                                    >
                                        {items.title}
                                    </Link>
                                ) : (
                                    <Link
                                        to={items.link}
                                        className="hover:text-blue-500 transition-all duration-300"
                                    >
                                        {items.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {!isLoggedIn && (
                        <div className="hidden md:flex gap-4">
                            <Link
                                to="/LogIn"
                                className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                            >
                                LogIn
                            </Link>
                            <Link
                                to="/SignUp"
                                className="px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                            >
                                SignUp
                            </Link>
                        </div>
                    )}

                    <button
                        className="block md:hidden text-white text-2xl hover:text-zinc-400"
                        onClick={() =>
                            MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden")
                        }
                    >
                        <FaGripLines />
                    </button>
                </div>
            </nav>

            <div className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}>

                {/* Mobile Search Box */}
                <div className="flex flex-col items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                                setMobileNav("hidden"); // Close menu after searching
                            }
                        }}
                        className="p-2 rounded-full border text-yellow-500 bg-black text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => {
                            handleSearch();
                            setMobileNav("hidden");
                        }}
                        className="mt-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                    >
                        <FaSearch />
                    </button>
                </div>

                {links.map((items, i) => (
                    <Link
                        to={items.link}
                        className={`${MobileNav} text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300`}
                        key={i}
                        onClick={() => setMobileNav("hidden")}
                    >
                        {items.title}
                    </Link>
                ))}

                {!isLoggedIn && (
                    <>
                        <Link
                            to="/LogIn"
                            className={`${MobileNav} px-8 mb-8 text-3xl font-semibold py-2 border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300`}
                        >
                            LogIn
                        </Link>
                        <Link
                            to="/SignUp"
                            className={`${MobileNav} px-8 mb-8 text-3xl font-semibold py-2 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300`}
                        >
                            SignUp
                        </Link>
                    </>
                )}
            </div>

            {searchResults.length > 0 && (
                <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
                    <h2 className="text-lg mb-4"></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {searchResults.map((book, i) => (
                            <a href={`/view-book-details/${book._id}`} key={i} className="p-4 border border-blue-500 rounded">
                                <h3 className="text-xl font-semibold">{book.title}</h3>
                                <p>Author: {book.author}</p>
                                <p>Language: {book.language}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}

        </>
    );
};

export default Navbar;
