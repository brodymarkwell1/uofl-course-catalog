import { useState } from 'react'
import './SearchFilter.css'

function SearchFilter({ onSearch, onFilter }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    onSearch(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    onFilter(e.target.value)
  }

  const handleClear = () => {
    setSearch('')
    setFilter('')
    onSearch('')
    onFilter('')
  }

  return (
    <div className="search-filter">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by course name, code, or description..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Filter by department..."
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />
        {(search || filter) && (
          <button onClick={handleClear} className="clear-btn">
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchFilter
