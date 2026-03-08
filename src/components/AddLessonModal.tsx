'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { SUBJECTS, Subject } from '@/lib/data'

interface AddLessonModalProps {
  onClose: () => void
  onAdd: (date: string, subject: Subject, topic: string, status: string) => void
}

export default function AddLessonModal({ onClose, onAdd }: AddLessonModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [subject, setSubject] = useState<Subject>('Русский')
  const [topic, setTopic] = useState('')
  const [status, setStatus] = useState('Понял')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return
    onAdd(date, subject, topic.trim(), status)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Добавить урок</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Предмет</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тема урока</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Например: Структура сочинения"
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Как понял тему</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="Понял">Понял</option>
              <option value="Нужно повторить">Нужно повторить</option>
              <option value="Сложная тема">Сложная тема</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
