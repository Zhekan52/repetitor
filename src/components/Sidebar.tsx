'use client'

import { 
  LayoutDashboard, 
  Users, 
  Moon, 
  Sun, 
  GraduationCap,
  Plus
} from 'lucide-react'
import { Student } from '@/lib/data'

interface SidebarProps {
  currentView: 'dashboard' | 'student'
  onNavigate: (view: 'dashboard' | 'student') => void
  onStudentClick: (student: Student) => void
  students: Student[]
  onAddStudent: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Sidebar({ 
  currentView, 
  onNavigate, 
  onStudentClick,
  students,
  onAddStudent,
  darkMode, 
  onToggleDarkMode 
}: SidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">ОГЭ Репетитор</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            currentView === 'dashboard' 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Дашборд</span>
        </button>

        <div className="pt-4 pb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase px-4">Ученики</p>
          <button 
            onClick={onAddStudent}
            className="p-1 hover:bg-muted rounded"
            title="Добавить ученика"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground px-4 py-2">Нет учеников</p>
        ) : (
          students.map((student) => (
            <button
              key={student.id}
              onClick={() => onStudentClick(student)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
                currentView === 'student'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="truncate">{student.name}</span>
            </button>
          ))
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{darkMode ? 'Светлая тема' : 'Тёмная тема'}</span>
        </button>
      </div>
    </aside>
  )
}
