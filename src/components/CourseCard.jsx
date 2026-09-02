import './CourseCard.css'

function CourseCard({ course, onClick }) {
  return (
    <button
      type="button"
      className="course-card"
      onClick={onClick}
      aria-label={`View details for ${course.department || 'course'} ${course.code || ''}`}
    >
      <div className="course-header">
        <h2 className="course-code">{course.code}</h2>
        <span className="course-credits">{course.credits ?? 'Course'} Credits</span>
      </div>
      <h3 className="course-title">{course.title || course.description}</h3>
      <p className="course-department">{course.department}</p>
      <p className="course-description">{course.description}</p>
      {course.prerequisites && (
        <div className="course-prerequisites">
          <strong>Prerequisites:</strong> {course.prerequisites}
        </div>
      )}
      {course.instructor && (
        <div className="course-instructor">
          <strong>Instructor:</strong> {course.instructor}
        </div>
      )}
    </button>
  )
}

export default CourseCard
