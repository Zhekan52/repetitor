'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Target, 
  BookOpen, 
  DollarSign, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  BarChart3,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react'
import { Student, Subject, SUBJECTS, Homework } from '@/lib/data'

interface StudentProfileProps {
  student: Student | null
  onBack: () => void
  getRemainingLessons: (student: Student) => number
  getAttendanceRate: (student: Student) => number
  onDelete: (studentId: string) => void
  onAddLesson: () => void
  onAddHomework: () => void
  onAddPayment: () => void
  onUpdateGrade: (subject: Subject) => void
  onUpdateHomeworkStatus: (homeworkId: string, status: Homework['status']) => void
}

export default function StudentProfile({ 
  student, 
  onBack, 
  getRemainingLessons,
  getAttendanceRate,
  onDelete,
  onAddLesson,
  onAddHomework,
  onAddPayment,
  onUpdateGrade,
  onUpdateHomeworkStatus
}: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'homework' | 'finance' | 'analytics'>('overview')

  if (!student) return null

  const remainingLessons = getRemainingLessons(student)
  const attendanceRate = getAttendanceRate(student)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Понял':
        return 'text-green-500 bg-green-500/10'
      case 'Нужно повторить':
        return 'text-orange-500 bg-orange-500/10'
      case 'Сложная тема':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getHomeworkStatusColor = (status: string) => {
    switch (status) {
      case 'Выполнено':
        return 'text-green-500'
      case 'Сделано частично':
        return 'text-orange-500'
      case 'Просрочено':
        return 'text-red-500'
      case 'На проверке':
        return 'text-blue-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 4) return 'text-green-500 bg-green-500/10'
    if (grade === 3) return 'text-yellow-500 bg-yellow-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  const generateReport = () => {
    const report = `
📊 Отчёт по ученику: ${student.name} (${student.grade})

🎯 Цель: ${student.target}

📚 Оценки по предметам:
${student.subjects.map(s => `• ${s.subject}: ${s.score}`).join('\n') || '• Нет оценок'}

📖 Проведено уроков: ${student.lessons.length}

📝 Последние темы:
${student.lessons.slice(-5).map(l => `• ${l.date} [${l.subject}] ${l.topic}`).join('\n') || '• Нет уроков'}

📋 Домашние задания:
${student.homework.map(hw => `• ${hw.subject}: ${hw.description} - ${hw.status}`).join('\n') || '• Нет ДЗ'}

💰 Осталось уроков: ${remainingLessons}
📊 Посещаемость: ${attendanceRate}%

📌 Заметки: ${student.notes || 'Нет'}

--- ОГЭ Репетитор ---
    `.trim()

    navigator.clipboard.writeText(report)
    alert('Отчёт скопирован в буфер обмена!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(student.id)}
            className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Скачать отчёт</span>
          </button>
        </div>
      </div>

      {/* Student Header */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <span className="text-sm text-muted-foreground">{student.grade}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>{student.target}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Осталось уроков</p>
            <p className={`text-3xl font-bold ${remainingLessons <= 2 ? 'text-red-500' : 'text-green-500'}`}>
              {remainingLessons}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {[
          { id: 'overview', label: 'Обзор', icon: BarChart3 },
          { id: 'lessons', label: 'Уроки', icon: BookOpen },
          { id: 'homework', label: 'ДЗ', icon: FileText },
          { id: 'finance', label: 'Оплата', icon: DollarSign },
          { id: 'analytics', label: 'Аналитика', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Оценки по предметам */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Оценки</h2>
            </div>
            <div className="space-y-3">
              {SUBJECTS.map(subject => {
                const subjectScore = student.subjects.find(s => s.subject === subject)
                return (
                  <button
                    key={subject}
                    onClick={() => onUpdateGrade(subject)}
                    className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{subject}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${subjectScore ? getGradeColor(subjectScore.score) : 'bg-muted text-muted-foreground'}`}>
                      {subjectScore ? subjectScore.score : '+'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Посещаемость</p>
                    <p className="text-2xl font-bold">{attendanceRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Уроков проведено</p>
                    <p className="text-2xl font-bold">{student.lessons.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Активных ДЗ</p>
                    <p className="text-2xl font-bold">
                      {student.homework.filter(h => h.status !== 'Выполнено').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Заметки</h3>
              <p className="text-sm text-muted-foreground">
                {student.notes || 'Нет заметок'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={onAddLesson}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Добавить урок
            </button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Журнал уроков</h2>
            {student.lessons.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Нет проведённых уроков</p>
            ) : (
              <div className="space-y-3">
                {[...student.lessons].reverse().map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{lesson.date}</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{lesson.subject}</span>
                      <span className="font-medium">{lesson.topic}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(lesson.status)}`}>
                      {lesson.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'homework' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={onAddHomework}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Добавить ДЗ
            </button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Домашние задания</h2>
            {student.homework.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Нет домашних заданий</p>
            ) : (
              <div className="space-y-3">
                {[...student.homework].reverse().map((hw) => (
                  <div key={hw.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        hw.status === 'Выполнено' ? 'bg-green-500' :
                        hw.status === 'Сделано частично' ? 'bg-orange-500' :
                        hw.status === 'Просрочено' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{hw.description}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="px-1 bg-primary/10 rounded text-xs">{hw.subject}</span>
                          {' '}• Срок: {hw.dueDate}
                        </p>
                      </div>
                    </div>
                    <select
                      value={hw.status}
                      onChange={(e) => onUpdateHomeworkStatus(hw.id, e.target.value as Homework['status'])}
                      className={`text-sm border rounded px-2 py-1 ${getHomeworkStatusColor(hw.status)}`}
                    >
                      <option value="На проверке">На проверке</option>
                      <option value="Выполнено">Выполнено</option>
                      <option value="Сделано частично">Сделано частично</option>
                      <option value="Просрочено">Просрочено</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Balance */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Баланс уроков</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{remainingLessons}</p>
                <p className="text-muted-foreground">уроков осталось</p>
              </div>
              <button
                onClick={onAddPayment}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
                Добавить оплату
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">История оплат</h2>
            {student.payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Нет платежей</p>
            ) : (
              <div className="space-y-3">
                {[...student.payments].reverse().map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">{payment.date}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{payment.amount.toLocaleString()} ₽</p>
                      <p className="text-sm text-muted-foreground">{payment.lessonsIncluded} уроков</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Attendance */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Посещаемость</h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-2xl font-bold">{attendanceRate}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Понял: {student.lessons.filter(l => l.status === 'Понял').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>Нужно повторить: {student.lessons.filter(l => l.status === 'Нужно повторить').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Сложная тема: {student.lessons.filter(l => l.status === 'Сложная тема').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Оценки по предметам */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Оценки по предметам</h2>
            <div className="space-y-4">
              {SUBJECTS.map(subject => {
                const subjectScore = student.subjects.find(s => s.subject === subject)
                const score = subjectScore?.score || 0
                return (
                  <div key={subject}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {subjectScore ? `${score}/5` : 'Нет оценки'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-4">
                      <div 
                        className={`rounded-full h-4 transition-all ${
                          score >= 4 ? 'bg-green-500' : score === 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score ? (score / 5) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
