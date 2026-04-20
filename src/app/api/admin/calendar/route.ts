import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const doctorId = searchParams.get('doctorId')

    if (!month) {
      return NextResponse.json(
        { error: 'Month parameter is required (format: YYYY-MM)' },
        { status: 400 }
      )
    }

    const [year, monthNum] = month.split('-').map(Number)
    const monthStart = startOfMonth(new Date(year, monthNum - 1))
    const monthEnd = endOfMonth(monthStart)

    // Get all appointments for the month
    const where: any = {
      date: {
        gte: monthStart,
        lte: monthEnd
      }
    }

    if (doctorId) {
      where.doctorId = doctorId
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    // Get all doctors for the filter
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialty: true
      },
      orderBy: { name: 'asc' }
    })

    // Group appointments by date
    const appointmentsByDate = appointments.reduce((acc, apt) => {
      const dateKey = format(apt.date, 'yyyy-MM-dd')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(apt)
      return acc
    }, {} as Record<string, any[]>)

    // Generate calendar days
    const calendarDays = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    }).map(day => {
      const dateKey = format(day, 'yyyy-MM-dd')
      const dayAppointments = appointmentsByDate[dateKey] || []
      
      return {
        date: dateKey,
        day: day.getDate(),
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isToday(day),
        appointments: dayAppointments,
        appointmentCount: dayAppointments.length,
        statusCounts: {
          pending: dayAppointments.filter(apt => apt.status === 'PENDING').length,
          confirmed: dayAppointments.filter(apt => apt.status === 'CONFIRMED').length,
          cancelled: dayAppointments.filter(apt => apt.status === 'CANCELLED').length,
          completed: dayAppointments.filter(apt => apt.status === 'COMPLETED').length
        }
      }
    })

    // Calculate statistics
    const stats = {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'PENDING').length,
      confirmed: appointments.filter(apt => apt.status === 'CONFIRMED').length,
      cancelled: appointments.filter(apt => apt.status === 'CANCELLED').length,
      completed: appointments.filter(apt => apt.status === 'COMPLETED').length
    }

    return NextResponse.json({
      calendarDays,
      doctors,
      stats,
      month: format(monthStart, 'yyyy-MM'),
      monthName: format(monthStart, 'MMMM yyyy')
    })
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar data' },
      { status: 500 }
    )
  }
}
