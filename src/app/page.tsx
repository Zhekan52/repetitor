'use client'

import { useState, useEffect } from 'react'
import { 
  loadStudents, 
  saveStudents, 
  addStudent, 
  deleteStudent,
  getProblemStudents, 
  getRemainingLessons, 
  getAttendanceRate, 
  Student,
  addLesson,
  addHomework,
  addPayment,
  updateSubjectScore,
  updateHomeworkStatus,
  SUBJECTS,
  Subject
} from '@/lib/data'
import Sidebar from '@/components/Sidebar'
import DashboardHome from '@/components/DashboardHome'
import StudentProfile from '@/components/StudentProfile'
import AddStudentModal from '@/components/AddStudentModal'
import AddLessonModal from '@/components/AddLessonModal'
import AddHomeworkModal from '@/components/AddHomeworkModal'
import AddPaymentModal from '@/components/AddPaymentModal'
import GradeModal from '@/components/GradeModal'

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [currentView, setCurrentView] = useState<'dashboard' | 'student'>('dashboard')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [showAddHomework, setShowAddHomework] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  // Загрузка данных
  useEffect(() => {
    const loaded = loadStudents()
    setStudents(loaded)
  }, [])

  // Сохранение при изменении
  useEffect(() => {
    if (students.length > 0) {
      saveStudents(students)
    }
  }, [students])

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student)
    setCurrentView('student')
  }

  const handleBack = () => {
    setCurrentView('dashboard')
    setSelectedStudent(null)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleAddStudent = (name: string, grade: string, target: string) => {
    const newStudent = addStudent({
      name,
      grade,
      target,
      subjects: [],
      lessons: [],
      homework: [],
      payments: [],
      notes: ''
    })
    setStudents([...students, newStudent])
    setShowAddStudent(false)
  }

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого ученика?')) {
      setStudents(deleteStudent(students, studentId))
      if (selectedStudent?.id === studentId) {
        setCurrentView('dashboard')
        setSelectedStudent(null)
      }
    }
  }

  const handleAddLesson = (date: string, subject: Subject, topic: string, status: string) => {
    if (!selectedStudent) return
    setStudents(addLesson(students, selectedStudent.id, {
      date,
      subject,
      topic,
      status: status as any
    }))
    // Обновить выбранного студента
    const updated = students.find(s => s.id === selectedStudent.id)
    if (updated) setSelectedStudent({...updated})
    setShowAddLesson(false)
  }

  const handleAddHomework = (subject: Subject, description: string, dueDate: string) => {
    if (!selectedStudent) return
    setStudents(addHomework(students, selectedStudent.id, {
      subject,
      description,
      dueDate,
      status: 'На проверке'
    }))
    setShowAddHomework(false)
  }

  const handleUpdateHomeworkStatus = (homeworkId: string, status: any) => {
    if (!selectedStudent) return
    setStudents(updateHomeworkStatus(students, selectedStudent.id, homeworkId, status))
  }

  const handleAddPayment = (amount: number, lessonsIncluded: number, date: string) => {
    if (!selectedStudent) return
    setStudents(addPayment(students, selectedStudent.id, {
      amount,
      lessonsIncluded,
      date
    }))
    setShowAddPayment(false)
  }

  const handleUpdateGrade = (subject: Subject, grade: number) => {
    if (!selectedStudent) return
    setStudents(updateSubjectScore(students, selectedStudent.id, subject, grade))
    setShowGradeModal(false)
    setSelectedSubject(null)
  }

  const openGradeModal = (subject: Subject) => {
    setSelectedSubject(subject)
    setShowGradeModal(true)
  }

  // Найти обновленного студента
  useEffect(() => {
    if (selectedStudent) {
      const found = students.find(s => s.id === selectedStudent.id)
      if (found) setSelectedStudent(found)
    }
  }, [students])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar 
          currentView={currentView}
          onNavigate={setCurrentView}
          onStudentClick={handleStudentClick}
          students={students}
          onAddStudent={() => setShowAddStudent(true)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' ? (
            <DashboardHome 
              students={students} 
              getProblemStudents={() => getProblemStudents(students)}
              getRemainingLessons={getRemainingLessons}
              onStudentClick={handleStudentClick}
              onAddStudent={() => setShowAddStudent(true)}
            />
          ) : (
            <StudentProfile 
              student={selectedStudent}
              onBack={handleBack}
              getRemainingLessons={getRemainingLessons}
              getAttendanceRate={getAttendanceRate}
              onDelete={handleDeleteStudent}
              onAddLesson={() => setShowAddLesson(true)}
              onAddHomework={() => setShowAddHomework(true)}
              onAddPayment={() => setShowAddPayment(true)}
              onUpdateGrade={openGradeModal}
              onUpdateHomeworkStatus={handleUpdateHomeworkStatus}
            />
          )}
        </main>
      </div>

      {/* Модальные окна */}
      {showAddStudent && (
        <AddStudentModal 
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddStudent}
        />
      )}

      {showAddLesson && selectedStudent && (
        <AddLessonModal 
          onClose={() => setShowAddLesson(false)}
          onAdd={handleAddLesson}
        />
      )}

      {showAddHomework && selectedStudent && (
        <AddHomeworkModal 
          onClose={() => setShowAddHomework(false)}
          onAdd={handleAddHomework}
        />
      )}

      {showAddPayment && selectedStudent && (
        <AddPaymentModal 
          onClose={() => setShowAddPayment(false)}
          onAdd={handleAddPayment}
        />
      )}

      {showGradeModal && selectedSubject && (
        <GradeModal 
          subject={selectedSubject}
          currentGrade={selectedStudent.subjects.find(s => s.subject === selectedSubject)?.score || 5}
          onClose={() => { setShowGradeModal(false); setSelectedSubject(null) }}
          onSave={handleUpdateGrade}
        />
      )}
    </div>
  )
}
