import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa";
import { useSelector } from 'react-redux';

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
        // If not logged in, remove protected links
        if (!isLoggedIn && (item.title === "Cart" || item.title === "Profile" || item.title === "Admin Profile")) {
            return false;
        }

        // If the user is logged in as a regular user, remove admin profile
        if (role === "user" && item.title === "Admin Profile") {
            return false;
        }

        // If the user is logged in as admin, remove regular profile
        if (role === "admin" && item.title === "Profile") {
            return false;
        }

        return true; // Show the link if no conditions are met
    });

    const [MobileNav, setMobileNav] = useState("hidden");

    return (
        <>
            <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        className="h-10 me-4"
                        src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
                        alt="logo"
                    />
                    <h1 className="text-2xl font-semibold">BookHeaven</h1>
                </Link>
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
        </>
    );
};

export default Navbar;
