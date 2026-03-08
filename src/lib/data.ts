// Типы данных для платформы мониторинга успеваемости ОГЭ

export const SUBJECTS = ['Русский', 'Математика', 'География', 'Обществознание'] as const
export type Subject = typeof SUBJECTS[number]

export interface Student {
  id: string;
  name: string; // Псевдоним или краткое имя
  grade: string; // Класс (9 класс)
  target: string; // Цель (ОГЭ, ЕГЭ и т.д.)
  subjects: SubjectScore[];
  lessons: Lesson[];
  homework: Homework[];
  payments: Payment[];
  notes: string;
  createdAt: string;
}

export interface SubjectScore {
  subject: Subject;
  score: number; // Оценка 2-5
  lastTest: string | null; // Дата последнего теста
  lastUpdated: string;
}

export interface Lesson {
  id: string;
  date: string;
  subject: Subject;
  topic: string;
  status: 'Понял' | 'Нужно повторить' | 'Сложная тема';
  grade?: number; // Оценка за урок
}

export interface Homework {
  id: string;
  subject: Subject;
  description: string;
  status: 'Выполнено' | 'Сделано частично' | 'Просрочено' | 'На проверке';
  dueDate: string;
  grade?: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  lessonsIncluded: number;
  subject?: Subject; // Если оплата за конкретный предмет
}

// Генератор ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Начальные данные
const initialStudents: Student[] = []

// Функции для работы с localStorage
const STORAGE_KEY = 'tutor_platform_students'

export function loadStudents(): Student[] {
  if (typeof window === 'undefined') return initialStudents
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return initialStudents
    }
  }
  return initialStudents
}

export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
}

// Операции CRUD
export function addStudent(student: Omit<Student, 'id' | 'createdAt'>): Student {
  const newStudent: Student = {
    ...student,
    id: generateId(),
    createdAt: new Date().toISOString()
  }
  return newStudent
}

export function updateStudent(students: Student[], studentId: string, updates: Partial<Student>): Student[] {
  return students.map(s => s.id === studentId ? { ...s, ...updates } : s)
}

export function deleteStudent(students: Student[], studentId: string): Student[] {
  return students.filter(s => s.id !== studentId)
}

export function addLesson(students: Student[], studentId: string, lesson: Omit<Lesson, 'id'>): Student[] {
  return students.map(s => {
    if (s.id !== studentId) return s
    return {
      ...s,
      lessons: [...s.lessons, { ...lesson, id: generateId() }]
    }
  })
}

export function addHomework(students: Student[], studentId: string, homework: Omit<Homework, 'id'>): Student[] {
  return students.map(s => {
    if (s.id !== studentId) return s
    return {
      ...s,
      homework: [...s.homework, { ...homework, id: generateId() }]
    }
  })
}

export function updateHomeworkStatus(students: Student[], studentId: string, homeworkId: string, status: Homework['status']): Student[] {
  return students.map(s => {
    if (s.id !== studentId) return s
    return {
      ...s,
      homework: s.homework.map(hw => hw.id === homeworkId ? { ...hw, status } : hw)
    }
  })
}

export function addPayment(students: Student[], studentId: string, payment: Omit<Payment, 'id'>): Student[] {
  return students.map(s => {
    if (s.id !== studentId) return s
    return {
      ...s,
      payments: [...s.payments, { ...payment, id: generateId() }]
    }
  })
}

export function updateSubjectScore(students: Student[], studentId: string, subject: Subject, score: number): Student[] {
  return students.map(s => {
    if (s.id !== studentId) return s
    const subjects = s.subjects.map(sub => 
      sub.subject === subject 
        ? { ...sub, score, lastUpdated: new Date().toISOString(), lastTest: new Date().toISOString() }
        : sub
    )
    // Если предмета нет, добавляем
    if (!subjects.find(sub => sub.subject === subject)) {
      subjects.push({ subject, score, lastTest: new Date().toISOString(), lastUpdated: new Date().toISOString() })
    }
    return { ...s, subjects }
  })
}

// Вспомогательные функции
export function getRemainingLessons(student: Student): number {
  const totalPaid = student.payments.reduce((sum, p) => sum + p.lessonsIncluded, 0)
  const totalUsed = student.lessons.length
  return Math.max(0, totalPaid - totalUsed)
}

export function getAttendanceRate(student: Student): number {
  const totalLessons = student.lessons.length
  if (totalLessons === 0) return 100
  const completedLessons = student.lessons.filter(l => l.status === 'Понял').length
  return Math.round((completedLessons / totalLessons) * 100)
}

export function getProblemStudents(students: Student[]): Student[] {
  return students.filter(student => {
    const hasOverdueHomework = student.homework.some(hw => hw.status === 'Просрочено')
    const remainingLessons = getRemainingLessons(student)
    const hasLowBalance = remainingLessons <= 2
    const hasBadGrades = student.subjects.some(sub => sub.score <= 3)
    return hasOverdueHomework || hasLowBalance || hasBadGrades
  })
}

export function getAverageGrade(student: Student): number {
  const grades = student.subjects.map(s => s.score)
  if (grades.length === 0) return 0
  return grades.reduce((a, b) => a + b, 0) / grades.length
}
