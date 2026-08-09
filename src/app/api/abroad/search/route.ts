import { NextRequest, NextResponse } from 'next/server';
import { searchGlobalUniversities } from '@/lib/universitySearchEngine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const country = searchParams.get('country');

    const universities = await searchGlobalUniversities(q || undefined, country || undefined);
    return NextResponse.json({ universities, count: universities.length });
  } catch (error) {
    console.error('Global university search error:', error);
    return NextResponse.json({ error: 'Failed to search universities' }, { status: 500 });
  }
}
