'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddStudentModalProps {
  onClose: () => void
  onAdd: (name: string, grade: string, target: string) => void
}

export default function AddStudentModal({ onClose, onAdd }: AddStudentModalProps) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('9 класс')
  const [target, setTarget] = useState('ОГЭ')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), grade, target)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Добавить ученика</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя (псевдоним)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Алёша К."
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Класс</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option>8 класс</option>
              <option>9 класс</option>
              <option>10 класс</option>
              <option>11 класс</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Цель</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option>ОГЭ</option>
              <option>ЕГЭ</option>
              <option>Подтянуть оценки</option>
              <option>Разговорный</option>
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
