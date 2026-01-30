import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { status: false, message: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const settings = (await prisma.settings.findFirst()) as any;
    const paystackSecretKey = settings?.paystackSecretKey || process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey || paystackSecretKey === 'sk_test_xxxxxxxxxxxxxxxxxx') {
      return NextResponse.json({
        status: false,
        message: 'Paystack is not configured. Please add your Paystack keys in Settings or .env.',
      }, { status: 500 });
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({
        status: false,
        message: 'Payment verification failed',
      }, { status: 400 });
    }

    const paymentData = data.data;

    // Update order payment status in database
    if (paymentData.status === 'success') {
      const orderId = paymentData.metadata?.orderId || paymentData.reference;
      
      await prisma.order.update({
        where: { orderNumber: orderId },
        data: {
          paymentStatus: 'paid',
          paymentMethod: 'paystack',
          status: 'processing',
        },
      });

      return NextResponse.json({
        status: true,
        message: 'Payment verified successfully',
        data: {
          reference: paymentData.reference,
          amount: paymentData.amount / 100, // Convert from pesewas to GHS
          paidAt: paymentData.paid_at,
          channel: paymentData.channel,
        },
      });
    }

    return NextResponse.json({
      status: false,
      message: 'Payment not successful',
      data: {
        status: paymentData.status,
      },
    }, { status: 400 });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { 
        status: false,
        message: error instanceof Error ? error.message : 'Failed to verify payment' 
      },
      { status: 500 }
    );
  }
}
