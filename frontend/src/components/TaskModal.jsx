import React, { useCallback, useEffect, useState } from 'react'
import { baseControlClasses, DEFAULT_TASK, priorityStyles } from '../assets/dummy'
import { PlusCircle, X, Save, AlignLeft, Calendar, Flag } from 'lucide-react'

const API_BASE = 'http://localhost:4000/api/tasks'

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!isOpen) return

    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === 'Yes' || taskToEdit.completed === true
          ? 'Yes'
          : 'No'

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Low',
        dueDate: taskToEdit.dueDate?.split('T')[0] || '',
        completed: normalized,
        id: taskToEdit._id,
      })
    } else {
      setTaskData(DEFAULT_TASK)
    }
  }, [isOpen, taskToEdit])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setTaskData(prev => ({ ...prev, [name]: value }))
  }, [])

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No auth token found')

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    if (taskData.dueDate < today) {
      setError('Due date cannot be in the past.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const isEdit = Boolean(taskData.id)
      const url = isEdit
        ? `${API_BASE}/${taskData.id}/gp`
        : `${API_BASE}/gp`

      const resp = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      })

      if (!resp.ok) {
        if (resp.status === 401) return onLogout?.()
        const err = await resp.json()
        throw new Error(err.message || 'Failed to save task')
      }

      const saved = await resp.json()
      onSave?.(saved)
      onClose()
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [taskData, today, getHeaders, onLogout, onSave, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? <Save className="w-5 h-5 text-purple-500" /> : <PlusCircle className="w-5 h-5 text-purple-500" />}
            {taskData.id ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
            placeholder="Task title"
            className={baseControlClasses}
          />

          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description"
            className={baseControlClasses}
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className={`${baseControlClasses} ${priorityStyles[taskData.priority]}`}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              min={today}
              onChange={handleChange}
              className={baseControlClasses}
            />
          </div>

          <div className="flex gap-4">
            {['Yes', 'No'].map(val => (
              <label key={val} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="completed"
                  value={val}
                  checked={taskData.completed === val}
                  onChange={handleChange}
                />
                <span>{val === 'Yes' ? 'Completed' : 'In Progress'}</span>
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded">
            {loading ? 'Saving...' : taskData.id ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
