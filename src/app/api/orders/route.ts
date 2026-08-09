import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { checkoutSchema } from '@/lib/validations';

// GET /api/orders — List user's orders (or all orders if admin)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = (session.user as { role?: string })?.role === 'ADMIN';

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { customerEmail: session.user.email },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { orderDate: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — Checkout cart into an order
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid delivery address' }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { customerEmail: session.user.email },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const overallPrice = cartItems.reduce((sum: number, item: { totalPrice: unknown }) => sum + Number(item.totalPrice), 0);

    const order = await prisma.order.create({
      data: {
        customerEmail: session.user.email,
        customerAddress: parsed.data.address,
        overallPrice,
        items: {
          create: cartItems.map((item: { productId: number; eachProPrice: unknown; productQuantity: number; totalPrice: unknown }) => ({
            productId: item.productId,
            perProPrice: item.eachProPrice as any,
            proQuantity: item.productQuantity,
            perProTotalPrice: item.totalPrice as any,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { customerEmail: session.user.email },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
