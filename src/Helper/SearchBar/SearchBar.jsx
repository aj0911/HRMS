import React from 'react'
import { FaSearch } from 'react-icons/fa'
import './SearchBar.css'

const SearchBar = () => {
  return (
    <div className="searchbar">
        <FaSearch />
        <input type="text" placeholder="Search" />
    </div>
  )
}

export default SearchBar