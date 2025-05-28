import { FaSearch } from "react-icons/fa";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-md">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">
        <FaSearch />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 text-lg bg-white text-gray-900 font-sans"
      />
    </div>
  );
} 