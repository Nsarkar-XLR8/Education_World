import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { addToCartSchema } from '@/lib/validations';

// GET /api/cart — Get user's cart
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { customerEmail: session.user.email },
      include: { product: true },
      orderBy: { id: 'desc' },
    });

    const total = cartItems.reduce((sum: number, item: { totalPrice: unknown }) => sum + Number(item.totalPrice), 0);

    return NextResponse.json({ cartItems, total });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart — Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { productId, quantity } = parsed.data;

    // Get product and check stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (product.stockProduct < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const price = Number(product.productPrice);
    const discount = Number(product.discount);
    const effectivePrice = price - (price * discount / 100);
    const totalPrice = effectivePrice * quantity;

    // Check if already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { productId, customerEmail: session.user.email },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          productQuantity: existingItem.productQuantity + quantity,
          totalPrice: Number(existingItem.totalPrice) + totalPrice,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          productId,
          customerEmail: session.user.email,
          productQuantity: quantity,
          eachProPrice: effectivePrice,
          totalPrice,
        },
      });
    }

    // Reduce stock
    await prisma.product.update({
      where: { id: productId },
      data: { stockProduct: { decrement: quantity } },
    });

    return NextResponse.json({ cartItem }, { status: 201 });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// DELETE /api/cart — Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: parseInt(itemId), customerEmail: session.user.email },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Restore stock
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockProduct: { increment: item.productQuantity } },
    });

    await prisma.cartItem.delete({ where: { id: item.id } });

    return NextResponse.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
