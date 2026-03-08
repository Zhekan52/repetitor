'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Subject } from '@/lib/data'

interface GradeModalProps {
  subject: Subject
  currentGrade: number
  onClose: () => void
  onSave: (subject: Subject, grade: number) => void
}

export default function GradeModal({ subject, currentGrade, onClose, onSave }: GradeModalProps) {
  const [grade, setGrade] = useState(currentGrade)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(subject, grade)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Оценка: {subject}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Выберите оценку</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    grade === g
                      ? g >= 4 ? 'bg-green-500 text-white' : g === 3 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
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
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
