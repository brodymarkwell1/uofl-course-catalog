import './Header.css'

function Header({ totalCourses }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>UofL Course Catalog</h1>
          <p className="subtitle">University of Louisville</p>
        </div>
        <div className="header-stats">
          <span className="course-count">{totalCourses} Courses</span>
        </div>
      </div>
    </header>
  )
}

export default Header
