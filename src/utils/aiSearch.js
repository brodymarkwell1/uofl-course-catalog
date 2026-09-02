/**
 * AI-powered search utility for the course catalog
 * Can be extended to use actual AI services
 */

export function searchCourses(courses, query) {
  if (!query || query.trim() === '') {
    return courses
  }

  const lowerQuery = query.toLowerCase()
  
  return courses.filter(course => {
    const titleMatch = course.title?.toLowerCase().includes(lowerQuery)
    const codeMatch = course.code?.toLowerCase().includes(lowerQuery)
    const descriptionMatch = course.description?.toLowerCase().includes(lowerQuery)
    const departmentMatch = course.department?.toLowerCase().includes(lowerQuery)
    
    return titleMatch || codeMatch || descriptionMatch || departmentMatch
  })
}

export function filterByDepartment(courses, department) {
  if (!department || department.trim() === '') {
    return courses
  }

  return courses.filter(course =>
    course.department?.toLowerCase().includes(department.toLowerCase())
  )
}

/**
 * Get unique departments from courses
 */
export function getDepartments(courses) {
  const departments = new Set()
  courses.forEach(course => {
    if (course.department) {
      departments.add(course.department)
    }
  })
  return Array.from(departments).sort()
}
