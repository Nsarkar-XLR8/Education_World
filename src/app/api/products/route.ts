import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProducts, getProductById, createProduct } from '@/lib/productStore';

// GET /api/products — List products with optional filters & sorting
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    if (id) {
      const product = await getProductById(parseInt(id, 10));
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    const products = await getProducts({
      level: level || undefined,
      search: search || undefined,
      sort: sort || undefined,
    });

    return NextResponse.json({
      products,
      pagination: {
        page: 1,
        limit: products.length,
        total: products.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products — Create product (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    const product = await createProduct({
      productName: body.productName,
      writerName: body.writerName,
      productPrice: Number(body.productPrice),
      discount: Number(body.discount || 0),
      levelScClgUni: body.levelScClgUni || 'school',
      stockProduct: Number(body.stockProduct || 10),
      img: body.img || null,
      description: body.description || 'Quality educational book for your studies.',
      publisher: body.publisher || 'Education World Press',
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
