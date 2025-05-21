import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchInput({ onSearchSuggestions, onSearchSubmit, searchResults }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim() !== "" && onSearchSuggestions) {
      onSearchSuggestions(value);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim() !== "" && onSearchSubmit) {
      onSearchSubmit(searchTerm);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (searchTerm.trim() !== "" && searchResults && searchResults.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchResults, searchTerm]);

  return (
    <div className="flex items-center w-full sm:w-64 md:w-80 max-w-xl bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 ring-purple-600 transition relative" ref={wrapperRef}>
      <button onClick={handleSearchSubmit} className="text-gray-500 mr-2 hover:text-gray-700 transition">
        <Search size={20} />
      </button>
      <input
        type="text"
        placeholder="Mahsulot, kategoriya yoki brend"
        className="bg-transparent flex-1 outline-none text-sm placeholder-gray-500"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {isDropdownOpen && searchResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-md border border-gray-200 z-50 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {searchResults.slice(0, 5).map((product) => (
              <li
                key={product._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                onClick={() => handleSuggestionClick(product._id)}
              >
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
