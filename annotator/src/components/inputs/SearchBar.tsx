import { FC, KeyboardEvent, ChangeEvent, useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import LoadingIndicator from "../../components/general/LoadingIndicator";
import React from "react";

interface SearchBarProps {
  value: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  loading: boolean;
  searchMode: "automatic" | "manual";
  debounceDelay?: number;
}

const SearchBar: FC<SearchBarProps> = ({ value, autoFocus, onChange, onSearch, placeholder, loading, searchMode, debounceDelay = 300 }) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [lastSearchedTerm, setLastSearchedTerm] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchMode === "automatic") {
      const handler = setTimeout(() => {
        if (!searchTerm || searchTerm === lastSearchedTerm) return;
        onSearch(searchTerm);
        setLastSearchedTerm(searchTerm);
        setIsDebouncing(false);
        if (autoFocus && inputRef.current) {
          inputRef.current.focus();
        }
      }, debounceDelay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchTerm, lastSearchedTerm, debounceDelay, onSearch, searchMode, autoFocus]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchMode === "manual" && searchTerm !== lastSearchedTerm) {
      onSearch(searchTerm);
      setLastSearchedTerm(searchTerm);
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onChange(event.target.value);
    if (searchMode === "automatic") {
      setIsDebouncing(true);
    }
  };

  return (
    <div className='w-full relative flex items-center'>
      <input
        ref={inputRef}
        type='text'
        value={searchTerm}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        className='w-full border p-2 rounded-md flex-grow pr-[2rem] bg-gray-800'
      />
      {searchMode === "manual" && (
        <button
          onClick={() => {
            if (searchTerm !== lastSearchedTerm) {
              onSearch(searchTerm);
              setLastSearchedTerm(searchTerm);
            }
            if (autoFocus && inputRef.current) {
              inputRef.current.focus();
            }
          }}
          className='absolute inset-y-0 right-0 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-r-md'
          disabled={loading}
          style={{ width: "2rem" }}
        >
          {loading ? <LoadingIndicator className='text-white' /> : <AiOutlineSearch />}
        </button>
      )}
      {isDebouncing && searchMode === "automatic" && (
        <div className='absolute inset-y-0 right-0 flex items-center justify-center p-2' style={{ width: "2rem" }}>
          <LoadingIndicator className='text-white' />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
