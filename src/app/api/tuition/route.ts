import { NextRequest, NextResponse } from 'next/server';
import { getTuitions, createTuition } from '@/lib/tuitionStore';

// GET /api/tuition — List tuition records
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const designation = searchParams.get('designation');
    const search = searchParams.get('search');

    const students = await getTuitions({
      designation: designation || undefined,
      search: search || undefined,
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Tuition GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch tuition records' }, { status: 500 });
  }
}

// POST /api/tuition — Create tuition record / post job / register tutor
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const student = await createTuition({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      class: body.class,
      dayTime: body.dayTime || '3 Days/Week (Flexible)',
      slClgUn: body.slClgUn || 'Educational Institution',
      subject: body.subject,
      designation: body.designation || 'teacher',
      salary: body.salary || 'Negotiable',
      version: body.version || 'General',
      img: body.img || null,
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    console.error('Tuition POST error:', error);
    return NextResponse.json({ error: 'Failed to register tuition profile' }, { status: 500 });
  }
}
