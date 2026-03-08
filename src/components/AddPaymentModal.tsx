'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddPaymentModalProps {
  onClose: () => void
  onAdd: (amount: number, lessonsIncluded: number, date: string) => void
}

export default function AddPaymentModal({ onClose, onAdd }: AddPaymentModalProps) {
  const [amount, setAmount] = useState('')
  const [lessons, setLessons] = useState('4')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !lessons) return
    onAdd(Number(amount), Number(lessons), date)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Добавить оплату</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Сумма (₽)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Например: 12000"
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Количество уроков</label>
            <select
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="4">4 урока</option>
              <option value="8">8 уроков</option>
              <option value="10">10 уроков</option>
              <option value="12">12 уроков</option>
              <option value="16">16 уроков</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Дата оплаты</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
