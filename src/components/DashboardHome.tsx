'use client'

import { AlertTriangle, DollarSign, Users, BookOpen, TrendingUp, Plus, Target } from 'lucide-react'
import { Student } from '@/lib/data'

interface DashboardHomeProps {
  students: Student[]
  getProblemStudents: () => Student[]
  getRemainingLessons: (student: Student) => number
  onStudentClick: (student: Student) => void
  onAddStudent: () => void
}

export default function DashboardHome({ 
  students, 
  getProblemStudents, 
  getRemainingLessons,
  onStudentClick,
  onAddStudent 
}: DashboardHomeProps) {
  const problemStudents = getProblemStudents()

  const totalLessons = students.reduce((sum, s) => sum + s.lessons.length, 0)
  const totalHomework = students.reduce((sum, s) => sum + s.homework.length, 0)
  const overdueHomework = students.reduce((sum, s) => 
    sum + s.homework.filter(h => h.status === 'Просрочено').length, 0
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Дашборд</h1>
          <p className="text-muted-foreground">Мои ученики и подготовка к ОГЭ</p>
        </div>
        <button
          onClick={onAddStudent}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить ученика</span>
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Учеников</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Уроков проведено</p>
              <p className="text-2xl font-bold">{totalLessons}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего ДЗ</p>
              <p className="text-2xl font-bold">{totalHomework}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Просрочено ДЗ</p>
              <p className="text-2xl font-bold">{overdueHomework}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Проблемные ученики */}
      {problemStudents.length > 0 && (
        <div className="bg-card border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Требуют внимания</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemStudents.map((student) => {
              const hasOverdueHomework = student.homework.some(hw => hw.status === 'Просрочено')
              const remainingLessons = getRemainingLessons(student)
              const hasLowBalance = remainingLessons <= 2
              const hasBadGrades = student.subjects.some(sub => sub.score <= 3)

              return (
                <button
                  key={student.id}
                  onClick={() => onStudentClick(student)}
                  className="bg-muted/50 border rounded-lg p-4 text-left hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{student.name}</span>
                    <span className="text-xs text-muted-foreground">{student.grade}</span>
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
                    {hasBadGrades && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Есть тройки
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
        {students.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">У вас пока нет учеников</p>
            <button
              onClick={onAddStudent}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Добавить первого ученика
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => onStudentClick(student)}
                className="bg-muted/50 border rounded-lg p-4 text-left hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{student.name}</span>
                  <span className="text-xs text-muted-foreground">{student.grade}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {student.target}
                </p>
                {student.subjects.length > 0 && (
                  <div className="flex gap-1">
                    {student.subjects.map(sub => (
                      <span 
                        key={sub.subject}
                        className={`text-xs px-2 py-0.5 rounded ${
                          sub.score >= 4 ? 'bg-green-500/20 text-green-500' :
                          sub.score === 3 ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {sub.score}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
