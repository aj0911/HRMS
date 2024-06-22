import React from 'react'
import { FaSearch } from 'react-icons/fa'
import './SearchBar.css'

const SearchBar = ({onChange,value,placeholder='Search'}) => {
  return (
    <div className="searchbar">
        <FaSearch />
        <input value={value} onChange={onChange} type="text" placeholder={placeholder} />
    </div>
  )
}

export default SearchBar