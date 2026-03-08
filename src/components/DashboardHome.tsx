'use client'

import { AlertTriangle, DollarSign, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react'
import { Student } from '@/lib/data'

interface DashboardHomeProps {
  students: Student[]
  getProblemStudents: () => Student[]
  getRemainingLessons: (student: Student) => number
  onStudentClick: (student: Student) => void
}

export default function DashboardHome({ 
  students, 
  getProblemStudents, 
  getRemainingLessons,
  onStudentClick 
}: DashboardHomeProps) {
  const problemStudents = getProblemStudents()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <p className="text-muted-foreground">Обзор прогресса всех учеников</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего учеников</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Проведено уроков</p>
              <p className="text-2xl font-bold">
                {students.reduce((sum, s) => sum + s.lessons.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Тем пройдено</p>
              <p className="text-2xl font-bold">
                {students.reduce((sum, s) => sum + s.lessons.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Баланс уроков</p>
              <p className="text-2xl font-bold">
                {students.reduce((sum, s) => sum + getRemainingLessons(s), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Проблемные ученики */}
      {problemStudents.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Требуют внимания</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemStudents.map((student) => {
              const hasOverdueHomework = student.homework.some(hw => hw.status === 'Просрочено')
              const remainingLessons = getRemainingLessons(student)
              const hasLowBalance = remainingLessons <= 2

              return (
                <button
                  key={student.id}
                  onClick={() => onStudentClick(student)}
                  className="bg-muted/50 border rounded-lg p-4 text-left hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{student.name}</span>
                    <span className="text-xs text-muted-foreground">{student.id}</span>
                  </div>
                  <div className="space-y-1">
                    {hasOverdueHomework && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Просроченные ДЗ
                      </p>
                    )}
                    {hasLowBalance && (
                      <p className="text-sm text-orange-500 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Осталось {remainingLessons} уроков
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Список всех учеников */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Все ученики</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => onStudentClick(student)}
              className="bg-muted/50 border rounded-lg p-4 text-left hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{student.name}</span>
                <span className="text-xs text-muted-foreground">{student.id}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{student.level}</p>
              <p className="text-sm text-primary truncate">{student.learningGoal}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
