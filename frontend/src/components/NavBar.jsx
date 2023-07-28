import React, { useState } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-bold flex items-center">
            <a href="/">
              <img src={logo} alt="IEEE Logo" className="w-24 mr-2" />
            </a>
          </div>

          {/* Responsive Dropdown Menu */}
          <div className="lg:hidden">
            {isMenuOpen ? (
              <button
                onClick={closeMenu}
                className="text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 5.414L12 13l8-7.586L20.414 7 12 15 3.586 7 4 5.414zM4.586 6L12 13.414 19.414 6 12 13.414 4.586 6z"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                &#9776;
              </button>
            )}
          </div>

          {/* Regular Navbar Menu */}
          <ul className="hidden lg:flex lg:flex-row lg:space-x-4">
            <li>
              <a
                href="/"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/gallery"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="/Events"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Events
              </a>
            </li>
          </ul>
        </div>

        {/* Responsive Dropdown Menu (hidden on larger screens) */}
        <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <ul className="mt-2 bg-gray-700 p-2 text-white">
            <li>
              <a
                href="/"
                className="block py-2 px-4 hover:bg-gray-600 transition duration-300"
                onClick={closeMenu}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/gallery"
                className="block py-2 px-4 hover:bg-gray-600 transition duration-300"
                onClick={closeMenu}
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="/Events"
                className="block py-2 px-4 hover:bg-gray-600 transition duration-300"
                onClick={closeMenu}
              >
                Events
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
