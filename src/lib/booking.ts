import { PrismaClient } from '@prisma/client'
import { format, parse, isValid, addMinutes, isBefore, isAfter, isEqual } from 'date-fns'

const prisma = new PrismaClient()

export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

export interface BookingRequest {
  doctorId: string
  patientId: string
  date: Date
  startTime: string
  endTime: string
  service: string
  notes?: string
}

// Slot generate - эмчийн цагийн хуваарийн үндсэн слотуудыг үүсгэх
export async function generateTimeSlots(
  doctorId: string,
  date: Date
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay()
  const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const dayName = dayNames[dayOfWeek] as any

  // Эмчийн өдрийн хуваарь
  const schedule = await prisma.doctorSchedule.findUnique({
    where: {
      doctorId_dayOfWeek: {
        doctorId,
        dayOfWeek: dayName
      }
    }
  })

  if (!schedule || !schedule.isWorking) {
    return []
  }

  // Эмчийн амралтын цагууд
  const breaks = await prisma.doctorBreak.findMany({
    where: {
      doctorId,
      dayOfWeek: dayName,
      isActive: true
    }
  })

  // Эмчийн завсарлагааны цагууд
  const blocks = await prisma.doctorBlock.findMany({
    where: {
      doctorId,
      date,
      isActive: true
    }
  })

  // Очих цагууд
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date,
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    }
  })

  // 30 минутын слотууд үүсгэх
  const slots: TimeSlot[] = []
  const scheduleStart = parse(schedule.startTime, 'HH:mm', new Date())
  const scheduleEnd = parse(schedule.endTime, 'HH:mm', new Date())
  
  let currentTime = scheduleStart
  while (isBefore(currentTime, scheduleEnd)) {
    const slotEndTime = addMinutes(currentTime, 30)
    
    if (!isBefore(slotEndTime, scheduleEnd) && !isEqual(slotEndTime, scheduleEnd)) break

    const startTimeStr = format(currentTime, 'HH:mm')
    const endTimeStr = format(slotEndTime, 'HH:mm')

    // Амралтын цагт орох эсэх
    const isBreak = breaks.some(breakItem => {
      const breakStart = parse(breakItem.startTime, 'HH:mm', new Date())
      const breakEnd = parse(breakItem.endTime, 'HH:mm', new Date())
      const currentInRange = (isAfter(currentTime, breakStart) || isEqual(currentTime, breakStart)) &&
                            (isBefore(currentTime, breakEnd) || isEqual(currentTime, breakEnd))
      const endInRange = (isAfter(slotEndTime, breakStart) || isEqual(slotEndTime, breakStart)) &&
                        (isBefore(slotEndTime, breakEnd) || isEqual(slotEndTime, breakEnd))
      return currentInRange && endInRange
    })

    // Завсарлагааны цагт орох эсэх
    const isBlocked = blocks.some(block => {
      const blockStart = parse(block.startTime, 'HH:mm', new Date())
      const blockEnd = parse(block.endTime, 'HH:mm', new Date())
      const currentInRange = (isAfter(currentTime, blockStart) || isEqual(currentTime, blockStart)) &&
                            (isBefore(currentTime, blockEnd) || isEqual(currentTime, blockEnd))
      const endInRange = (isAfter(slotEndTime, blockStart) || isEqual(slotEndTime, blockStart)) &&
                        (isBefore(slotEndTime, blockEnd) || isEqual(slotEndTime, blockEnd))
      return currentInRange && endInRange
    })

    // Өмнөх цаг авалттай давхцах эсэх
    const hasAppointment = appointments.some(apt => {
      const aptStart = parse(apt.startTime, 'HH:mm', new Date())
      const aptEnd = parse(apt.endTime, 'HH:mm', new Date())
      const currentOverlap = (isAfter(currentTime, aptStart) || isEqual(currentTime, aptStart)) &&
                             (isBefore(currentTime, aptEnd) || isEqual(currentTime, aptEnd))
      const endOverlap = (isAfter(slotEndTime, aptStart) || isEqual(slotEndTime, aptStart)) &&
                        (isBefore(slotEndTime, aptEnd) || isEqual(slotEndTime, aptEnd))
      const coversSlot = (isBefore(currentTime, aptStart) || isEqual(currentTime, aptStart)) &&
                        (isAfter(slotEndTime, aptEnd) || isEqual(slotEndTime, aptEnd))
      return currentOverlap || endOverlap || coversSlot
    })

    slots.push({
      startTime: startTimeStr,
      endTime: endTimeStr,
      available: !isBreak && !isBlocked && !hasAppointment
    })

    currentTime = slotEndTime
  }

  return slots
}

// Availability check - цаг авах боломжтой эсэх
export async function checkAvailability(
  doctorId: string,
  date: Date,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const slots = await generateTimeSlots(doctorId, date)
  
  const requestedSlot = slots.find(slot => 
    slot.startTime === startTime && slot.endTime === endTime
  )
  
  return requestedSlot?.available || false
}

// Time overlap check - хоёр цагийн завсар давхцах эсэх
export function hasTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const dtStart1 = parse(start1, 'HH:mm', new Date())
  const dtEnd1 = parse(end1, 'HH:mm', new Date())
  const dtStart2 = parse(start2, 'HH:mm', new Date())
  const dtEnd2 = parse(end2, 'HH:mm', new Date())

  return (
    ((isAfter(dtStart1, dtStart2) || isEqual(dtStart1, dtStart2)) && isBefore(dtStart1, dtEnd2)) ||
    (isAfter(dtEnd1, dtStart2) && (isBefore(dtEnd1, dtEnd2) || isEqual(dtEnd1, dtEnd2))) ||
    ((isBefore(dtStart1, dtStart2) || isEqual(dtStart1, dtStart2)) && (isAfter(dtEnd1, dtEnd2) || isEqual(dtEnd1, dtEnd2)))
  )
}

// Booking create - цаг авалт үүсгэх
export async function createBooking(request: BookingRequest) {
  // 1. Availability шалгах
  const isAvailable = await checkAvailability(
    request.doctorId,
    request.date,
    request.startTime,
    request.endTime
  )

  if (!isAvailable) {
    throw new Error('Энэ цагт цаг авах боломжгүй байна')
  }

  // 2. Давхардлыг шалгах (database level)
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: request.doctorId,
      date: request.date,
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    }
  })

  const hasOverlap = existingAppointments.some(apt => 
    hasTimeOverlap(request.startTime, request.endTime, apt.startTime, apt.endTime)
  )

  if (hasOverlap) {
    throw new Error('Цагууд давхардаж байна')
  }

  // 3. Цаг авалт үүсгэх
  const appointment = await prisma.appointment.create({
    data: {
      patientId: request.patientId,
      doctorId: request.doctorId,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      service: request.service,
      notes: request.notes,
      status: 'PENDING'
    },
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
          name: true
        }
      }
    }
  })

  return appointment
}

// Get doctor availability for a date range
export async function getDoctorAvailability(
  doctorId: string,
  startDate: Date,
  endDate: Date
) {
  const availability = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current <= end) {
    const slots = await generateTimeSlots(doctorId, current)
    const availableSlots = slots.filter(slot => slot.available)
    
    availability.push({
      date: format(current, 'yyyy-MM-dd'),
      dayOfWeek: format(current, 'EEEE'),
      availableSlots: availableSlots.length,
      slots: availableSlots
    })

    current.setDate(current.getDate() + 1)
  }

  return availability
}
