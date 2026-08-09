import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAbroadList, createAbroad, deleteAbroad } from '@/lib/abroadStore';

// GET /api/abroad — List universities
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    const universities = await getAbroadList({
      country: country || undefined,
      search: search || undefined,
      sort: sort || undefined,
    });

    return NextResponse.json({ universities });
  } catch (error) {
    console.error('Abroad GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 });
  }
}

// POST /api/abroad — Add university (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    const university = await createAbroad({
      rankUni: body.rankUni,
      university: body.university,
      courseOffer: body.courseOffer,
      tuitionFee: body.tuitionFee,
      livingCost: body.livingCost,
      fund: body.fund,
      internship: body.internship || 'Industrial Internships Available',
      taRaGa: body.taRaGa || 'TA/RA Grants Available',
      contact: body.contact || 'admissions@university.edu',
      engPro: body.engPro || 'IELTS',
      score: body.score || '6.5',
      countryName: body.countryName,
      cgpa: body.cgpa || '3.00 / 4.00',
      uniImg: body.uniImg || null,
      description: body.description || 'Top global university offering world-class research.',
    });

    return NextResponse.json({ university }, { status: 201 });
  } catch (error) {
    console.error('Abroad POST error:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}

// DELETE /api/abroad — Delete university (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'University ID required' }, { status: 400 });
    }

    await deleteAbroad(parseInt(id, 10));
    return NextResponse.json({ message: 'University removed successfully' });
  } catch (error) {
    console.error('Abroad DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 });
  }
}
