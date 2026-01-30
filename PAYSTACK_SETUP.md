# Paystack Configuration for Ghana

## Getting Started with Paystack

### Step 1: Create a Paystack Account
1. Go to [paystack.com](https://paystack.com)
2. Sign up for a business account (Ghana preferred)
3. Complete KYC verification
4. Get your API keys from the dashboard

### Step 2: Set Environment Variables

Create a `.env` file in your project root:

```env
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_public_key_here
PAYSTACK_SECRET_KEY=sk_live_your_secret_key_here
```

Or for testing (use Paystack test keys):

```env
# Paystack Test Keys (for development)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_test_public_key
PAYSTACK_SECRET_KEY=sk_test_your_test_secret_key
```

### Step 3: Test Cards for Development

Paystack provides test cards for development:

| Card Type | Number | CVC | Date |
|-----------|--------|-----|------|
| Mastercard | 5399 8383 5868 9090 | 419 | 05/26 |
| Visa | 4084 0343 1117 2181 | 408 | 11/29 |
| Verve | 5061 0600 3000 6118 | 123 | 12/26 |

Use any future date for expiry and any OTP in the OTP field during testing.

### Step 4: Implement Payment Button

Example in your checkout component:

```tsx
import { initializePayment, getPaystackConfig, formatAmountForPaystack } from "@/utils/paystack";

export default function CheckoutPage() {
  const handlePayment = async () => {
    const { publicKey } = getPaystackConfig();
    
    if (!publicKey) {
      toast.error("Payment not configured. Please set Paystack keys.");
      return;
    }

    try {
      const response = await initializePayment({
        publicKey,
        email: formData.email,
        amount: totalPrice, // in GHS
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        currency: "GHS",
        metadata: {
          orderId: generateOrderId(),
          items: cart.items,
        },
      });

      if (response.status) {
        // Redirect to payment URL
        window.location.href = response.data.authorization_url;
      }
    } catch (error) {
      toast.error("Payment initialization failed");
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay with Paystack
    </button>
  );
}
```

### Step 5: Handle Payment Callback

Create a callback endpoint to verify payments:

```tsx
// app/api/verify-payment/route.ts
import { verifyPayment, getPaystackConfig } from "@/utils/paystack";

export async function POST(request: Request) {
  const { reference } = await request.json();
  const { secretKey } = getPaystackConfig();

  try {
    const response = await verifyPayment(reference, secretKey!);
    
    if (response.status && response.data?.status === "success") {
      // Payment verified - update order status
      // Save to database
      return Response.json({ success: true, data: response.data });
    }
    
    return Response.json({ success: false }, { status: 400 });
  } catch (error) {
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
```

### Paystack Integration Features

✅ Card Payments (Visa, Mastercard, Verve)
✅ Mobile Money (MTN, Vodafone, Airtel)
✅ Bank Transfers
✅ Secure HTTPS transactions
✅ Instant payment confirmations
✅ Comprehensive API
✅ Ghana-specific support

### Paystack Documentation

- [API Documentation](https://paystack.com/docs/api/)
- [Ghana Bank Codes](https://paystack.com/docs/guides/integrations/mobile-money/)
- [Webhooks Documentation](https://paystack.com/docs/webhooks/)
- [Test Data](https://paystack.com/docs/guides/reference/test-cards-and-accounts/)

### Supported Payment Methods in Ghana

1. **Mobile Money**
   - MTN Mobile Money
   - Vodafone Cash
   - Airtel Money

2. **Cards**
   - Visa
   - Mastercard
   - Verve

3. **Bank Transfer**
   - All Ghana banks via Paystack

### Troubleshooting

**Issue: "Payment not configured"**
- Ensure NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set in .env
- Restart development server after adding env variables

**Issue: "Invalid amount"**
- Paystack expects amounts in the smallest currency unit (kobo)
- Amount gets automatically converted in the paystack.ts utility

**Issue: "Card declined"**
- Use provided test cards during development
- Check Paystack dashboard for transaction logs

**Issue: "Mobile Money not working"**
- Ensure customer's number is valid Ghana number
- Check mobile network provider is supported
- Verify amount is in valid range

### Going Live

1. Complete Paystack KYC verification
2. Switch to live keys (pk_live_xxx)
3. Update .env with live keys
4. Test end-to-end payment flow
5. Deploy to production
6. Monitor transactions in Paystack dashboard

### Support

- Paystack Support: [support@paystack.com](mailto:support@paystack.com)
- Ghana Support: +233 XXXX XXXX
- Community: Paystack Slack Channel

---

**Currency:** Ghanaian Cedis (GHS)
**Test Mode:** Use test keys from Paystack dashboard
**Live Mode:** Switch to production keys before launch
