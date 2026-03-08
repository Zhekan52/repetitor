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
  BarChart3
} from 'lucide-react'
import { Student } from '@/lib/data'
import SkillsRadar from './SkillsRadar'

interface StudentProfileProps {
  student: Student | null
  onBack: () => void
  getRemainingLessons: (student: Student) => number
  getAttendanceRate: (student: Student) => number
}

export default function StudentProfile({ 
  student, 
  onBack, 
  getRemainingLessons,
  getAttendanceRate 
}: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'homework' | 'finance' | 'analytics'>('overview')

  if (!student) return null

  const remainingLessons = getRemainingLessons(student)
  const attendanceRate = getAttendanceRate(student)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Понял на 100%':
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
      default:
        return 'text-muted-foreground'
    }
  }

  const generateReport = () => {
    const report = `
📊 Отчет по ученику: ${student.name} (${student.id})

🎯 Уровень: ${student.level}
📌 Цель обучения: ${student.learningGoal}

📈 Прогресс навыков:
${student.skills.map(s => `• ${s.name}: ${s.score}/10`).join('\n')}

📚 Пройденные темы (${student.lessons.length}):
${student.lessons.map(l => `• ${l.date}: ${l.topic} - ${l.status}`).join('\n')}

📝 Домашние задания:
${student.homework.map(hw => `• ${hw.description}: ${hw.status} (срок: ${hw.dueDate})`).join('\n')}

💰 Баланс: ${remainingLessons} уроков осталось
📊 Посещаемость: ${attendanceRate}%

📌 Заметки репетитора: ${student.notes}

--- Сгенерировано Tutor Hub ---
    `.trim()

    navigator.clipboard.writeText(report)
    alert('Отчет скопирован в буфер обмена!')
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
          <span>Назад к списку</span>
        </button>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Скачать отчет</span>
        </button>
      </div>

      {/* Student Header */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <span className="text-sm text-muted-foreground">{student.id}</span>
            </div>
            <p className="text-lg text-primary mb-1">{student.level}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>{student.learningGoal}</span>
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
      <div className="flex gap-2 border-b">
        {[
          { id: 'overview', label: 'Обзор', icon: BarChart3 },
          { id: 'lessons', label: 'Журнал', icon: BookOpen },
          { id: 'homework', label: 'ДЗ', icon: FileText },
          { id: 'finance', label: 'Финансы', icon: DollarSign },
          { id: 'analytics', label: 'Аналитика', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
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
          {/* Skills Radar */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Навыки (Радар)</h2>
            <SkillsRadar skills={student.skills} />
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
                    <p className="text-sm text-muted-foreground">Тем пройдено</p>
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
              <h3 className="font-semibold mb-2">Заметки репетитора</h3>
              <p className="text-sm text-muted-foreground">{student.notes}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Журнал занятий</h2>
          <div className="space-y-3">
            {student.lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{lesson.date}</span>
                  <span className="font-medium">{lesson.topic}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(lesson.status)}`}>
                  {lesson.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'homework' && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Домашние задания</h2>
          <div className="space-y-3">
            {student.homework.map((hw) => (
              <div key={hw.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    hw.status === 'Выполнено' ? 'bg-green-500' :
                    hw.status === 'Сделано частично' ? 'bg-orange-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{hw.description}</p>
                    <p className="text-sm text-muted-foreground">Срок: {hw.dueDate}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 ${getHomeworkStatusColor(hw.status)}`}>
                  {hw.status === 'Выполнено' && <CheckCircle className="w-4 h-4" />}
                  {hw.status === 'Сделано частично' && <Clock className="w-4 h-4" />}
                  {hw.status === 'Просрочено' && <AlertTriangle className="w-4 h-4" />}
                  <span className="text-sm">{hw.status}</span>
                </span>
              </div>
            ))}
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
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Из последнего платежа</p>
                <p className="text-lg font-semibold">
                  {student.payments.length > 0 
                    ? student.payments[student.payments.length - 1].lessonsIncluded 
                    : 0} уроков
                </p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">История оплат</h2>
            <div className="space-y-3">
              {student.payments.map((payment) => (
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
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Attendance */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">График посещаемости</h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-2xl font-bold">{attendanceRate}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Присутствовал: {student.lessons.filter(l => l.status === 'Понял на 100%').length}</span>
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

          {/* Progress */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Динамика навыков</h2>
            <div className="space-y-4">
              {student.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.score}/10</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all" 
                      style={{ width: `${skill.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
