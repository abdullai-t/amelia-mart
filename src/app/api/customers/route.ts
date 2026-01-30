import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats for each customer
    const customersWithStats = customers.map((customer) => {
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address ?? "",
        city: customer.city ?? "",
        joinedDate: customer.createdAt,
        totalOrders: customer.orders.length,
        totalSpent,
        status: customer.orders.length > 0 ? "active" : "inactive",
      };
    });

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
