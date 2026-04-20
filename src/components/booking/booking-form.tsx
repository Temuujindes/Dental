'use client'

import { useState } from 'react'
import { User, Phone, Mail, Calendar, Clock, FileText } from 'lucide-react'

interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface BookingFormProps {
  doctor: Doctor
  selectedDate: string
  selectedSlot: TimeSlot
  onBookingComplete?: () => void
  onCancel?: () => void
}

export default function BookingForm({ 
  doctor, 
  selectedDate, 
  selectedSlot, 
  onBookingComplete, 
  onCancel 
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    service: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const services = [
    'Үндсэн шалгалт',
    'Шүдний эмчилгээ',
    'Шүдний ороолт',
    'Шүдний цэвэрлэгээ',
    'Шүдний ороомгийн засвар',
    'Хүүхдийн стоматолог',
    'Ортодонти',
    'Шүдний хирурги'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.patientName || !formData.patientEmail || !formData.service) {
      setError('Заавал бөглөх талбаруудыг бөглөнө үү')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          patientPhone: formData.patientPhone,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          service: formData.service,
          notes: formData.notes
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Booking failed')
      }

      setSuccess(true)
      setTimeout(() => {
        onBookingComplete?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Цаг авалт амжилтгүй боллоо')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Цаг амжилттай авлаа!</h3>
          <p className="text-gray-600 mb-4">
            Таны цагийг амжилттай баталгаажууллаа. Имэйл хаяг руу мэдэгдэл илгээх болно.
          </p>
          <button
            onClick={onBookingComplete}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Дуусгах
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Цаг захиалах</h3>
        
        {/* Booking Summary */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Эмч:</p>
              <p className="font-medium text-gray-900">{doctor.name}</p>
              <p className="text-gray-600">{doctor.specialty}</p>
            </div>
            <div>
              <p className="text-gray-600">Цаг:</p>
              <p className="font-medium text-gray-900">{selectedDate}</p>
              <p className="font-medium text-blue-600">
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Өвчтөний нэр *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Нэрээ оруулна уу"
              />
            </div>
          </div>

          {/* Patient Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имэйл хаяг *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                required
                value={formData.patientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, patientEmail: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Patient Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Утасны дугаар
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="99999999"
              />
            </div>
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Үйлчилгээ *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">Үйлчилгээ сонгох</option>
                {services.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Нэмэлт мэдээлэл
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Асуух зүйлсээ бичнэ үү..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Баталгаажуулж байна...' : 'Цаг авах'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Цуцлах
          </button>
        </div>
      </form>
    </div>
  )
}
