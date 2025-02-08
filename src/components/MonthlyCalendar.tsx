import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../types/task';

interface MonthlyCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
}

export function MonthlyCalendar({ isOpen, onClose, selectedDate, onSelectDate, tasks }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(parseISO(task.dueDate), date));
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.monthly-calendar') && !target.closest('.month-text')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/20 backdrop-blur-sm"
        >
          <div className="monthly-calendar w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>

              <button
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((date, index) => {
                  const dayTasks = getTasksForDate(date);
                  const hasOverdueTasks = dayTasks.some(task => 
                    task.status !== 'completed' && new Date(task.dueDate) < new Date()
                  );
                  const hasCompletedTasks = dayTasks.some(task => task.status === 'completed');

                  return (
                    <motion.button
                      key={date.toISOString()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onSelectDate(date);
                        onClose();
                      }}
                      className={`
                        relative aspect-square rounded-lg p-1
                        flex flex-col items-center justify-center
                        transition-colors duration-200
                        ${isSameDay(date, selectedDate)
                          ? 'bg-blue-500 text-white'
                          : isToday(date)
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <span className="text-sm font-medium">{format(date, 'd')}</span>
                      
                      {/* Task Indicators */}
                      {dayTasks.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {hasOverdueTasks && (
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                          {hasCompletedTasks && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          )}
                          {dayTasks.some(task => !task.status || task.status === 'in-progress') && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
