import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchFilter from './components/SearchFilter'
import CourseCard from './components/CourseCard'
import Pagination from './components/Pagination'
import './App.css'

const STORAGE_KEY = 'uofl-saved-courses'
const PLANNER_STORAGE_KEY = 'uofl-course-planner'
const DEFAULT_SEMESTER = 'Fall 2026'

function App() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerm, setFilterTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [savedCourseIds, setSavedCourseIds] = useState([])
  const [plannerCourses, setPlannerCourses] = useState({})
  const [selectedSemester, setSelectedSemester] = useState(DEFAULT_SEMESTER)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [currentView, setCurrentView] = useState('all')
  const coursesPerPage = 10

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    setSavedCourseIds(saved)

    const plannerData = JSON.parse(localStorage.getItem(PLANNER_STORAGE_KEY) || '{}')
    setPlannerCourses(plannerData)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCourseIds))
  }, [savedCourseIds])

  useEffect(() => {
    localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plannerCourses))
  }, [plannerCourses])

  const openCourseDetails = (course) => {
    setSelectedCourse(course)
  }

  const closeCourseDetails = () => {
    setSelectedCourse(null)
  }

  const isSaved = (courseId) => savedCourseIds.includes(courseId)

  const isInPlanner = (courseId) => {
    const semesterCourses = plannerCourses[selectedSemester] || []
    return semesterCourses.includes(courseId)
  }

  const toggleSavedCourse = (courseId) => {
    setSavedCourseIds(current =>
      current.includes(courseId)
        ? current.filter(id => id !== courseId)
        : [...current, courseId]
    )
  }

  const togglePlannerCourse = (course) => {
    const semesterCourses = plannerCourses[selectedSemester] || []

    if (semesterCourses.includes(course.id)) {
      setPlannerCourses(current => ({
        ...current,
        [selectedSemester]: (current[selectedSemester] || []).filter(id => id !== course.id)
      }))
      return
    }

    setPlannerCourses(current => ({
      ...current,
      [selectedSemester]: [...(current[selectedSemester] || []), course.id]
    }))
  }

  const removePlannerCourse = (courseId) => {
    setPlannerCourses(current => ({
      ...current,
      [selectedSemester]: (current[selectedSemester] || []).filter(id => id !== courseId)
    }))
  }

  const formatDetailLabel = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, char => char.toUpperCase())
  }

  const getCourseCredits = (course) => {
    const rawValue =
      course?.credits ??
      course?.creditHours ??
      course?.credit_hours ??
      course?.credit ??
      course?.units ??
      course?.creditHoursValue ??
      course?.credit_value ??
      course?.hours

    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return 0
    }

    const numericValue = Number.parseFloat(String(rawValue).replace(/[^0-9.]/g, ''))
    return Number.isFinite(numericValue) ? numericValue : 0
  }

  const plannerCourseIds = plannerCourses[selectedSemester] || []
  const plannerCoursesList = courses.filter(course => plannerCourseIds.includes(course.id))
  const totalPlannerCredits = plannerCoursesList.reduce((sum, course) => sum + getCourseCredits(course), 0)

  let warningText = ''
  if (totalPlannerCredits >= 18) {
    warningText = 'Heavy course load'
  } else if (totalPlannerCredits >= 12) {
    warningText = 'Full-time'
  }

  useEffect(() => {
    // Load course data from catalog.json
    fetch('/catalog.json')
      .then(res => res.json())
      .then(data => {
        setCourses(data)
        setFilteredCourses(data)
      })
      .catch(err => console.error('Error loading courses:', err))
  }, [])

  useEffect(() => {
    // Filter courses based on search and filter terms
    let results = courses

    if (searchTerm) {
      results = results.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterTerm) {
      results = results.filter(course =>
        course.department?.toLowerCase().includes(filterTerm.toLowerCase())
      )
    }

    if (showSavedOnly) {
      results = results.filter(course => savedCourseIds.includes(course.id))
    }

    setFilteredCourses(results)
    setCurrentPage(1)
  }, [searchTerm, filterTerm, courses, showSavedOnly, savedCourseIds])

  useEffect(() => {
    if (currentView === 'planner') {
      setShowSavedOnly(false)
    }
  }, [currentView])

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  return (
    <div className="app">
      <Header totalCourses={currentView === 'saved' ? filteredCourses.length : currentView === 'planner' ? plannerCourseIds.length : filteredCourses.length} />
      <div className="toolbar">
        {currentView === 'all' || currentView === 'saved' ? (
          <SearchFilter 
            onSearch={setSearchTerm}
            onFilter={setFilterTerm}
          />
        ) : null}

        <div className="view-toggle-group">
          <button
            type="button"
            className={`saved-toggle ${currentView === 'all' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('all')
              setShowSavedOnly(false)
            }}
          >
            All Courses
          </button>
          <button
            type="button"
            className={`saved-toggle ${currentView === 'saved' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('saved')
              setShowSavedOnly(true)
            }}
          >
            Saved Courses
          </button>
          <button
            type="button"
            className={`saved-toggle ${currentView === 'planner' ? 'active' : ''}`}
            onClick={() => setCurrentView('planner')}
          >
            Course Planner
          </button>
        </div>
      </div>

      {currentView === 'planner' ? (
        <div className="planner-view">
          <div className="planner-header">
            <div>
              <h2>Course Planner</h2>
              <label className="semester-picker">
                <span>Selected semester:</span>
                <select value={selectedSemester} onChange={event => setSelectedSemester(event.target.value)}>
                  <option value="Fall 2026">Fall 2026</option>
                  <option value="Spring 2027">Spring 2027</option>
                  <option value="Summer 2027">Summer 2027</option>
                </select>
              </label>
            </div>
            <div className="planner-summary">
              <strong>Total Credits: {totalPlannerCredits}</strong>
              {warningText && <span className="planner-warning">{warningText}</span>}
            </div>
          </div>

          <div className="planner-list">
            {plannerCoursesList.length === 0 ? (
              <div className="planner-empty">No courses planned for {selectedSemester} yet.</div>
            ) : (
              plannerCoursesList.map(course => {
                const courseCredits = getCourseCredits(course)

                return (
                  <div className="planner-item" key={course.id}>
                    <div className="planner-course-summary">
                      <span className="planner-department">{course.department}</span>
                      <span className="planner-code">{course.code}</span>
                      <span className="planner-title">{course.title}</span>
                    </div>
                    <div className="planner-course-meta">
                      <span>{courseCredits} credits</span>
                      <button type="button" className="planner-remove-btn" onClick={() => removePlannerCourse(course.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="courses-container">
            {currentCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => openCourseDetails(course)}
              />
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {selectedCourse && (
        <div className="course-modal-backdrop" onClick={closeCourseDetails}>
          <div className="course-modal" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="course-modal-close"
              onClick={closeCourseDetails}
              aria-label="Close course details"
            >
              ×
            </button>

            <div className="course-modal-header">
              <span className="course-modal-department">
                {selectedCourse.department || 'Department'}
              </span>
              <h2>{selectedCourse.code || 'Course'}</h2>
            </div>

            {selectedCourse.title && <h3>{selectedCourse.title}</h3>}

            <div className="course-modal-actions">
              <button
                type="button"
                className={`save-course-btn ${isSaved(selectedCourse.id) ? 'saved' : ''}`}
                onClick={() => toggleSavedCourse(selectedCourse.id)}
              >
                {isSaved(selectedCourse.id) ? 'Saved' : 'Save Course'}
              </button>
              <button
                type="button"
                className={`save-course-btn planner-btn ${isInPlanner(selectedCourse.id) ? 'saved' : ''}`}
                onClick={() => togglePlannerCourse(selectedCourse)}
              >
                {isInPlanner(selectedCourse.id) ? 'In Planner' : 'Add to Planner'}
              </button>
            </div>

            <p className="course-modal-description">
              {selectedCourse.description || 'No description available.'}
            </p>

            <div className="course-modal-details">
              {Object.entries(selectedCourse)
                .filter(([key]) => !['description', 'title', 'department', 'code'].includes(key))
                .map(([key, value]) => (
                  <div className="course-modal-row" key={key}>
                    <span>{formatDetailLabel(key)}</span>
                    <strong>{value ?? 'N/A'}</strong>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
