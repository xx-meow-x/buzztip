// Where course group chats come from.
//
// Right now every account gets the same sample enrollment so the demo has
// course chats to show. Later, replace getEnrolledCourses() with a call to the
// school's records using the student's account number, and each student will
// be placed in the group chats for the courses they're actually taking.

export const COURSE_CATALOG = {
  'CS 301': 'Data Structures and Algorithms',
  'CS 305': 'Software Engineering 1',
  'MATH 201': 'Discrete Mathematics',
  'GE 104': 'Purposive Communication',
}

const SAMPLE_ENROLLMENT = ['CS 301', 'CS 305', 'MATH 201']

export function getEnrolledCourses(/* studentNumber */) {
  return [...SAMPLE_ENROLLMENT]
}

export const courseGroupId = (code) => 'course_' + code.replace(/\s+/g, '').toLowerCase()
