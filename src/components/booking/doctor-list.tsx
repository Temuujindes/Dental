'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin, Clock, User, Search } from 'lucide-react'

interface Doctor {
  id: string
  name: string
  bio: string
  imageUrl?: string
  rating: number
  experience: number
  available: boolean
}

interface DoctorListProps {
  onDoctorSelect?: (doctor: Doctor) => void
  selectedDoctorId?: string
}

export default function DoctorList({ onDoctorSelect, selectedDoctorId }: DoctorListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      params.append('available', 'true')

      const response = await fetch(`/api/doctors?${params}`)
      if (!response.ok) throw new Error('Failed to fetch doctors')
      
      const data = await response.json()
      setDoctors(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [search])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Эмчийн жагсаалт</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Эмчийн нэрээр хайх..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-6 mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Doctor List */}
      <div className="p-6">
        {doctors.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Эмч олдсонгүй</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => onDoctorSelect?.(doctor)}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${selectedDoctorId === doctor.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {doctor.imageUrl ? (
                      <img
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {doctor.name}
                      </h3>
                      {doctor.available ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Боломжтой
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Завсарласан
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{doctor.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.experience} жил</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {doctor.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
