import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create or find customer
    let customer = await prisma.customer.findUnique({
      where: { email: body.customer.email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: body.customer.name,
          email: body.customer.email,
          phone: body.customer.phone,
          address: body.customer.address,
          city: body.customer.city,
        },
      });
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      const productIds = body.items.map((item: any) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      const productMap = new Map(products.map((product) => [product.id, product]));

      for (const item of body.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      await Promise.all(
        body.items.map((item: any) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      return tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          subtotal: body.subtotal,
          tax: body.tax,
          shipping: body.shipping,
          total: body.total,
          status: 'pending',
          paymentStatus: 'unpaid',
          paymentMethod: body.paymentMethod,
          shippingAddress: body.shippingAddress,
          notes: body.notes,
          items: {
            create: body.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
