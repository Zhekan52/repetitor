'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { SUBJECTS, Subject } from '@/lib/data'

interface AddHomeworkModalProps {
  onClose: () => void
  onAdd: (subject: Subject, description: string, dueDate: string) => void
}

export default function AddHomeworkModal({ onClose, onAdd }: AddHomeworkModalProps) {
  const [subject, setSubject] = useState<Subject>('Русский')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !dueDate) return
    onAdd(subject, description.trim(), dueDate)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Добавить домашнее задание</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Задание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: Стр. 45, упр. 3"
              className="w-full px-3 py-2 border rounded-lg bg-background min-h-[80px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Срок сдачи</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            />
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
