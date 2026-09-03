/**
 * AI-powered search utility for the course catalog
 * Can be extended to use actual AI services
 */

const WORD_ALIASES = {
  phil: 'philosophy',
  tech: 'technology',
  comp: 'computer',
  intro: 'introduction'
}

const normalizeCourseName = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .split(/\s+/)
  .filter(Boolean)
  .map(word => WORD_ALIASES[word] || word)

const editDistance = (first, second) => {
  const distances = Array.from({ length: second.length + 1 }, (_, index) => index)

  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    let diagonal = distances[0]
    distances[0] = firstIndex

    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      const current = distances[secondIndex]
      distances[secondIndex] = first[firstIndex - 1] === second[secondIndex - 1]
        ? diagonal
        : Math.min(distances[secondIndex] + 1, distances[secondIndex - 1] + 1, diagonal + 1)
      diagonal = current
    }
  }

  return distances[second.length]
}

export function courseNameMatches(courseName, query) {
  if (!courseName || !query) {
    return false
  }

  const courseWords = normalizeCourseName(courseName)
  const queryWords = normalizeCourseName(query)
  const normalizedCourse = courseWords.join(' ')
  const normalizedQuery = queryWords.join(' ')

  if (normalizedCourse.includes(normalizedQuery)) {
    return true
  }

  if (queryWords.length < 2) {
    return false
  }

  const matchedWords = queryWords.filter(queryWord =>
    courseWords.some(courseWord => {
      const distance = editDistance(queryWord, courseWord)
      return distance <= Math.max(1, Math.floor(queryWord.length * 0.25))
    })
  )

  return matchedWords.length === queryWords.length
}

export function searchCourses(courses, query) {
  if (!query || query.trim() === '') {
    return courses
  }

  const lowerQuery = query.toLowerCase()

  return courses.filter(course => {
    const titleMatch = courseNameMatches(course.title || course.description, query)
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
