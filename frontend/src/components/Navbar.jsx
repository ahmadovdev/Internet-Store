import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import SearchInput from "./SearchInput.jsx";
import KatalogDropdown from "./KatalogDropdown.jsx";
import { useProductStore } from "../stores/useProductStore.js";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const { fetchSearchResults, searchResults } = useProductStore();
  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate(`/search?q=${query}`);
  };

  const handleSearchSuggestions = (query) => {
    fetchSearchResults(query);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white text-black shadow-sm border-none backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          <Link to="/" className="flex-shrink-0 text-purple-600 hover:text-purple-800 transition-colors">
            <svg width="200" height="60" viewBox="0 0 250 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H25L23 30H7L5 10Z" fill="currentColor" />
              <path d="M10 10V6C10 5 12 5 12 6V10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M20 10V6C20 5 18 5 18 6V10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <text x="35" y="25" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="currentColor" alignmentBaseline="middle">
                Ecommerce
              </text>
            </svg>
          </Link>
          <KatalogDropdown />
          <SearchInput onSearchSuggestions={handleSearchSuggestions} onSearchSubmit={handleSearchSubmit} searchResults={searchResults} />
          <nav className="flex flex-wrap items-center gap-4">
            {user && (
              <Link to={"/cart"} className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
                <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link to={"/secret-dashboard"} className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center">
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button onClick={logout} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link to={"/signup"} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link to={"/login"} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
