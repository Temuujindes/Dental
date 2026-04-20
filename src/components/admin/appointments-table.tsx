'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Search, Filter, Calendar, User, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Appointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  service: string
  notes?: string
  patient: {
    id: string
    name: string
    email: string
    phone?: string
  }
  doctor: {
    id: string
    name: string
    specialty: string
  }
}

interface AppointmentsTableProps {
  onStatusChange?: (appointmentId: string, newStatus: string) => void
}

export default function AppointmentsTable({ onStatusChange }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    doctorId: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200'
  }

  const statusIcons = {
    PENDING: AlertCircle,
    CONFIRMED: Clock,
    CANCELLED: XCircle,
    COMPLETED: CheckCircle
  }

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      })

      const response = await fetch(`/api/admin/appointments?${params}`)
      if (!response.ok) throw new Error('Failed to fetch appointments')
      
      const data = await response.json()
      setAppointments(data.appointments)
      setTotalPages(data.pagination.pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointmentId, status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update status')

      const updatedAppointment = await response.json()
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt)
      )
      
      onStatusChange?.(appointmentId, newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [page, filters])

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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Цаг авалтууд</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Шүүлтүүр
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Хайх..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Бүх төлөв</option>
              <option value="PENDING">Хүлээгдэж буй</option>
              <option value="CONFIRMED">Баталгаажсан</option>
              <option value="CANCELLED">Цуцлагдсан</option>
              <option value="COMPLETED">Дууссан</option>
            </select>
            <button
              onClick={() => setFilters({ doctorId: '', status: '', dateFrom: '', dateTo: '', search: '' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Цэвэрлэх
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-6 mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Өдөр/Цаг
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Өвчтөн
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Эмч
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлчилгээ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Төлөв
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => {
              const StatusIcon = statusIcons[appointment.status]
              return (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(appointment.date), 'yyyy-MM-dd')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patient.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {appointment.patient.email}
                      </div>
                      {appointment.patient.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {appointment.patient.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.doctor.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.doctor.specialty}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {appointment.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[appointment.status]}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {appointment.status === 'PENDING' && 'Хүлээгдэж буй'}
                      {appointment.status === 'CONFIRMED' && 'Баталгаажсан'}
                      {appointment.status === 'CANCELLED' && 'Цуцлагдсан'}
                      {appointment.status === 'COMPLETED' && 'Дууссан'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {appointment.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Баталгаажуулах
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Цуцлах
                          </button>
                        </>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Дуусгах
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Цуцлах
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Хуудас {page} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Өмнөх
            </button>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Дараах
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
