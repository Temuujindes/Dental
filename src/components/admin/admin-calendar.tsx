'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  appointments: any[]
  appointmentCount: number
  statusCounts: {
    pending: number
    confirmed: number
    cancelled: number
    completed: number
  }
}

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface AdminCalendarProps {
  onDateSelect?: (date: string) => void
}

export default function AdminCalendar({ onDateSelect }: AdminCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const weekDays = ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя']

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  }

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      const monthStr = format(currentMonth, 'yyyy-MM')
      const params = new URLSearchParams({ month: monthStr })
      
      if (selectedDoctor) {
        params.append('doctorId', selectedDoctor)
      }

      const response = await fetch(`/api/admin/calendar?${params}`)
      if (!response.ok) throw new Error('Failed to fetch calendar data')
      
      const data = await response.json()
      setCalendarDays(data.calendarDays)
      setDoctors(data.doctors)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendarData()
  }, [currentMonth, selectedDoctor])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDay = getDay(monthStart)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDateClick = (day: CalendarDay) => {
    if (day.appointments.length > 0) {
      onDateSelect?.(day.date)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Цагийн хуваарь</h2>
          <div className="flex items-center gap-4">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Бүх эмч нар</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-6 mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Нийт</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-600">Хүлээгдэж буй</p>
              <p className="text-lg font-semibold text-yellow-900">{stats.pending}</p>
            </div>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600">Баталгаажсан</p>
              <p className="text-lg font-semibold text-blue-900">{stats.confirmed}</p>
            </div>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-600">Цуцлагдсан</p>
              <p className="text-lg font-semibold text-red-900">{stats.cancelled}</p>
            </div>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600">Дууссан</p>
              <p className="text-lg font-semibold text-green-900">{stats.completed}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-6 pb-6">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden mb-4">
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startDay }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-white p-2 h-24"></div>
          ))}

          {/* Actual calendar days */}
          {calendarDays.map((day) => (
            <div
              key={day.date}
              onClick={() => handleDateClick(day)}
              className={`
                bg-white p-2 h-24 cursor-pointer hover:bg-gray-50 transition-colors
                ${!day.isCurrentMonth ? 'opacity-50' : ''}
                ${day.isToday ? 'bg-blue-50' : ''}
                ${day.appointmentCount > 0 ? 'ring-2 ring-blue-200' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-sm font-medium
                  ${day.isToday ? 'text-blue-600' : 'text-gray-900'}
                  ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                `}>
                  {day.day}
                </span>
                {day.appointmentCount > 0 && (
                  <span className="text-xs text-gray-500">{day.appointmentCount}</span>
                )}
              </div>

              {/* Appointment indicators */}
              <div className="space-y-1">
                {day.statusCounts.pending > 0 && (
                  <div className={`text-xs px-1 py-0.5 rounded ${statusColors.pending}`}>
                    {day.statusCounts.pending} хүлээгдэж буй
                  </div>
                )}
                {day.statusCounts.confirmed > 0 && (
                  <div className={`text-xs px-1 py-0.5 rounded ${statusColors.confirmed}`}>
                    {day.statusCounts.confirmed} баталгаажсан
                  </div>
                )}
                {day.statusCounts.completed > 0 && (
                  <div className={`text-xs px-1 py-0.5 rounded ${statusColors.completed}`}>
                    {day.statusCounts.completed} дууссан
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
