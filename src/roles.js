export const ADMIN = 'ADMIN'
export const TEACHER = 'TEACHER'
export const STUDENT = 'STUDENT'

export const isAdmin = () => {
    const currentUserRole = localStorage.getItem('role')
    return currentUserRole === ADMIN
}

export const isTeacher = () => {
    const currentUserRole = localStorage.getItem('role')
    return currentUserRole === TEACHER
}

export const isStudent = () => {
    const currentUserRole = localStorage.getItem('role')
    return currentUserRole === STUDENT
}
