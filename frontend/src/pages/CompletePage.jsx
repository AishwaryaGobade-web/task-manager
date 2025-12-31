import React, { useMemo, useState } from 'react'
import { CT_CLASSES } from '../assets/dummy'
import { CheckCircle2, Filter } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import TaskItem from '../components/TaskItem'

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest', icon: '🆕' },
  { id: 'oldest', label: 'Oldest', icon: '🕰️' }
]

const CompletePage = () => {
  const { tasks = [], refreshTasks } = useOutletContext()
  const [sortBy, setSortBy] = useState('newest')

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter(task =>
        [true, 1, 'yes'].includes(
          typeof task.completed === 'string'
            ? task.completed.toLowerCase()
            : task.completed
        )
      )
      .sort((a, b) =>
        sortBy === 'newest'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      )
  }, [tasks, sortBy])

  return (
    <div className={CT_CLASSES.page}>
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle2 className='text-purple-500 w-5 h-5' />
            <span>Completed Task</span>
          </h1>

          <p className={CT_CLASSES.subtitle}>
            {sortedCompletedTasks.length} completed task
            {sortedCompletedTasks.length !== 1 && 's'}
          </p>
        </div>

        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
              <Filter className='w-4 h-4 text-purple-500' />
              <span>Sort by:</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={CT_CLASSES.select}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[
                    CT_CLASSES.btnBase,
                    sortBy === opt.id
                      ? CT_CLASSES.btnActive
                      : CT_CLASSES.btnInactive
                  ].join(' ')}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <CheckCircle2 className="w-8 h-8 text-purple-500" />
            <p>No completed tasks yet</p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CompletePage
