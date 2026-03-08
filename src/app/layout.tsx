import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tutor Platform - Мониторинг успеваемости',
  description: 'Платформа для отслеживания прогресса учеников',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
