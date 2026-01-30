import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, orderId, metadata } = body;

    const settings = (await prisma.settings.findFirst()) as any;
    const paystackSecretKey = settings?.paystackSecretKey || process.env.PAYSTACK_SECRET_KEY;

    // Check if Paystack key is configured
    if (!paystackSecretKey || paystackSecretKey === 'sk_test_xxxxxxxxxxxxxxxxxx') {
      return NextResponse.json({
        status: false,
        message: 'Paystack is not configured. Please add your Paystack keys in Settings or .env.',
      }, { status: 500 });
    }

    // Initialize Paystack payment
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to pesewas (GHS cents)
        currency: 'GHS',
        reference: orderId,
        metadata: {
          orderId,
          ...metadata,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-confirmation?orderId=${orderId}`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || 'Payment initialization failed');
    }

    return NextResponse.json({
      status: true,
      message: 'Payment initialized',
      data: {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      },
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    return NextResponse.json(
      { 
        status: false,
        message: error instanceof Error ? error.message : 'Failed to initialize payment' 
      },
      { status: 500 }
    );
  }
}
