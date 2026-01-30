import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get settings (there should only be one record)
    let settings = (await prisma.settings.findFirst()) as any;

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          storeName: 'Amelia Mart',
          storeEmail: 'info@ameliamart.com',
          storePhone: '0201234567',
          storeAddress: '123 Oxford Street, Accra, Ghana',
          paystackPublicKey: '',
          paystackSecretKey: '',
          freeShippingThreshold: 100,
          shippingFee: 10,
          taxRate: 2.5,
          deliveryTime: '3-5 days',
        } as any,
      });
    }

    return NextResponse.json({
      ...settings,
      paystackSecretKey: '',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get existing settings
    let settings = (await prisma.settings.findFirst()) as any;

    const nextPaystackPublicKey = typeof body.paystackPublicKey === 'string'
      ? body.paystackPublicKey.trim()
      : '';
    const nextPaystackSecretKey = typeof body.paystackSecretKey === 'string'
      ? body.paystackSecretKey.trim()
      : '';

    if (!settings) {
      // Create if doesn't exist
      settings = await prisma.settings.create({
        data: {
          storeName: body.storeName,
          storeEmail: body.storeEmail,
          storePhone: body.storePhone,
          storeAddress: body.storeAddress,
          paystackPublicKey: nextPaystackPublicKey,
          paystackSecretKey: nextPaystackSecretKey,
          freeShippingThreshold: parseFloat(body.freeShippingThreshold),
          shippingFee: parseFloat(body.shippingFee),
          taxRate: parseFloat(body.taxRate),
          deliveryTime: body.deliveryTime,
          emailNotifications: body.emailNotifications,
          orderNotifications: body.orderNotifications,
          lowStockAlerts: body.lowStockAlerts,
        } as any,
      });
    } else {
      // Update existing
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          storeName: body.storeName,
          storeEmail: body.storeEmail,
          storePhone: body.storePhone,
          storeAddress: body.storeAddress,
          paystackPublicKey: nextPaystackPublicKey || settings.paystackPublicKey,
          paystackSecretKey: nextPaystackSecretKey || settings.paystackSecretKey,
          freeShippingThreshold: parseFloat(body.freeShippingThreshold),
          shippingFee: parseFloat(body.shippingFee),
          taxRate: parseFloat(body.taxRate),
          deliveryTime: body.deliveryTime,
          emailNotifications: body.emailNotifications,
          orderNotifications: body.orderNotifications,
          lowStockAlerts: body.lowStockAlerts,
        } as any,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
