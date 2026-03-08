'use client'

import { useState } from 'react'
import { students, getProblemStudents, getRemainingLessons, getAttendanceRate, Student } from '@/lib/data'
import Sidebar from '@/components/Sidebar'
import DashboardHome from '@/components/DashboardHome'
import StudentProfile from '@/components/StudentProfile'

export default function Home() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'student'>('dashboard')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [darkMode, setDarkMode] = useState(false)

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

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar 
          currentView={currentView}
          onNavigate={setCurrentView}
          onStudentClick={handleStudentClick}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' ? (
            <DashboardHome 
              students={students} 
              getProblemStudents={getProblemStudents}
              getRemainingLessons={getRemainingLessons}
              onStudentClick={handleStudentClick}
            />
          ) : (
            <StudentProfile 
              student={selectedStudent}
              onBack={handleBack}
              getRemainingLessons={getRemainingLessons}
              getAttendanceRate={getAttendanceRate}
            />
          )}
        </main>
      </div>
    </div>
  )
}
