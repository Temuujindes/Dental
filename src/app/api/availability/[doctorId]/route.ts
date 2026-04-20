import { NextRequest, NextResponse } from 'next/server'
import { getDoctorAvailability } from '@/lib/booking'

interface Params {
  params: Promise<{ doctorId: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { doctorId } = await params
    const { searchParams } = new URL(request.url)
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required (format: YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    const availability = await getDoctorAvailability(
      doctorId,
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
