import React, { useState } from 'react';
import axios from "axios"


const apiKey = process.env.NEXT_PUBLIC_SKYFIRE_API_KEY

const SearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    
    const crawlerEndpoint = "http://localhost:3000/v1/crawler/start-crawl"
    event.preventDefault();
    console.log(`Input Value: ${inputValue}`);
    try {
    
      const requestBody = {
        startUrl: inputValue
      }
      const response = await axios.post(crawlerEndpoint, requestBody, {
        headers: {
          "skyfire-api-key": apiKey,
          "content-type": "application/json",
        },
      })
      console.log("here:", response.data)
    } catch (error) {
      console.error("Error processing payment:", error)
    }
  };

  return (
    <form className="flex items-center w-full">   
      <label htmlFor="simple-search" className="sr-only">Search</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
          </svg>
        </div>
        <input 
          type="text" 
          id="simple-search" 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Input website to crawl..." 
          required 
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <button 
        type="submit" 
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleButtonClick}
      >
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;