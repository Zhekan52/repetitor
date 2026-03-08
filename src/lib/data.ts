// Типы данных для платформы мониторинга успеваемости

export interface Student {
  id: string;
  name: string; // Псевдоним или краткое имя
  level: string;
  learningGoal: string;
  skills: Skill[];
  lessons: Lesson[];
  homework: Homework[];
  payments: Payment[];
  notes: string; // Заметки репетитора
}

export interface Skill {
  name: string;
  score: number; // 1-10
  lastUpdated: string;
}

export interface Lesson {
  id: string;
  date: string;
  topic: string;
  status: 'Понял на 100%' | 'Нужно повторить' | 'Сложная тема';
}

export interface Homework {
  id: string;
  description: string;
  status: 'Выполнено' | 'Сделано частично' | 'Просрочено';
  dueDate: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  lessonsIncluded: number;
}

// Моковые данные
export const students: Student[] = [
  {
    id: 'ST-001',
    name: 'Алексей К.',
    level: 'Intermediate, B1',
    learningGoal: 'Сдать ЕГЭ на 90+',
    skills: [
      { name: 'Грамматика', score: 7, lastUpdated: '2024-02-01' },
      { name: 'Говорение', score: 5, lastUpdated: '2024-02-01' },
      { name: 'Письмо', score: 6, lastUpdated: '2024-02-01' },
      { name: 'Слух', score: 4, lastUpdated: '2024-02-01' },
    ],
    lessons: [
      { id: 'L-001', date: '2024-02-05', topic: 'Past Simple vs Past Continuous', status: 'Понял на 100%' },
      { id: 'L-002', date: '2024-02-12', topic: 'Conditionals Type 2', status: 'Нужно повторить' },
      { id: 'L-003', date: '2024-02-19', topic: 'Modal Verbs', status: 'Понял на 100%' },
    ],
    homework: [
      { id: 'HW-001', description: 'Упражнения на Past Simple', status: 'Выполнено', dueDate: '2024-02-08' },
      { id: 'HW-002', description: 'Сочинение на тему " Путешествия "', status: 'Сделано частично', dueDate: '2024-02-15' },
      { id: 'HW-003', description: 'Аудирование BBC', status: 'Просрочено', dueDate: '2024-02-10' },
    ],
    payments: [
      { id: 'P-001', date: '2024-01-15', amount: 15000, lessonsIncluded: 10 },
      { id: 'P-002', date: '2024-02-20', amount: 15000, lessonsIncluded: 10 },
    ],
    notes: 'Хорошо усваивает материал, но часто отвлекается на телефон',
  },
  {
    id: 'ST-002',
    name: 'Мария С.',
    level: 'Upper-Intermediate, B2',
    learningGoal: 'Переезд в Германию',
    skills: [
      { name: 'Грамматика', score: 8, lastUpdated: '2024-02-01' },
      { name: 'Говорение', score: 7, lastUpdated: '2024-02-01' },
      { name: 'Письмо', score: 9, lastUpdated: '2024-02-01' },
      { name: 'Слух', score: 6, lastUpdated: '2024-02-01' },
    ],
    lessons: [
      { id: 'L-004', date: '2024-02-06', topic: 'German Loanwords', status: 'Понял на 100%' },
      { id: 'L-005', date: '2024-02-13', topic: 'Business Email Writing', status: 'Сложная тема' },
    ],
    homework: [
      { id: 'HW-004', description: 'Подготовка к интервью', status: 'Выполнено', dueDate: '2024-02-12' },
    ],
    payments: [
      { id: 'P-003', date: '2024-01-20', amount: 20000, lessonsIncluded: 8 },
    ],
    notes: 'Очень мотивирована, заметный прогресс',
  },
  {
    id: 'ST-003',
    name: 'Дмитрий В.',
    level: 'Beginner, A2',
    learningGoal: 'Базовая коммуникация для работы',
    skills: [
      { name: 'Грамматика', score: 4, lastUpdated: '2024-02-01' },
      { name: 'Говорение', score: 3, lastUpdated: '2024-02-01' },
      { name: 'Письмо', score: 5, lastUpdated: '2024-02-01' },
      { name: 'Слух', score: 3, lastUpdated: '2024-02-01' },
    ],
    lessons: [
      { id: 'L-006', date: '2024-02-07', topic: 'Present Simple', status: 'Нужно повторить' },
    ],
    homework: [
      { id: 'HW-005', description: 'Повторить слова unit 3', status: 'Просрочено', dueDate: '2024-02-09' },
      { id: 'HW-006', description: 'Диалоги в аэропорту', status: 'Просрочено', dueDate: '2024-02-11' },
    ],
    payments: [
      { id: 'P-004', date: '2024-02-01', amount: 12000, lessonsIncluded: 5 },
    ],
    notes: 'Сложно выделять время на занятия, часто переносит',
  },
];

// Функции для работы с данными
export function getProblemStudents(): Student[] {
  return students.filter(student => {
    const hasOverdueHomework = student.homework.some(hw => hw.status === 'Просрочено');
    const remainingLessons = getRemainingLessons(student);
    const hasLowBalance = remainingLessons <= 2;
    return hasOverdueHomework || hasLowBalance;
  });
}

export function getRemainingLessons(student: Student): number {
  const totalPaid = student.payments.reduce((sum, p) => sum + p.lessonsIncluded, 0);
  const totalUsed = student.lessons.length;
  return Math.max(0, totalPaid - totalUsed);
}

export function getAttendanceRate(student: Student): number {
  // Упрощенная логика - в реальном приложении нужно больше данных
  const totalLessons = student.lessons.length;
  if (totalLessons === 0) return 100;
  const completedLessons = student.lessons.filter(l => l.status === 'Понял на 100%').length;
  return Math.round((completedLessons / totalLessons) * 100);
}
