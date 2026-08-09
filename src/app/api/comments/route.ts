import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { commentSchema } from '@/lib/validations';

// GET /api/comments — List comments
export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments — Post a comment / contact inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: parsed.data,
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Comments POST error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
