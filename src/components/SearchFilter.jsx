import { useState } from 'react'
import './SearchFilter.css'

function SearchFilter({ onSearch, onFilter, departments }) {
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
        <label className="department-filter">
          <span>Department</span>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option value={department} key={department}>{department}</option>
            ))}
          </select>
        </label>
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
