# 🇬🇭 Ghana Setup - Super Simple Guide

## Your Store is Ready! 🎉

Your e-commerce store has been updated for Ghana.
Just 2 more minutes to enable payments...

---

## STEP 1: Get Paystack Account (5 minutes)

👉 Go here: **https://paystack.com/register**

Fill in:
- Business name: Your store name
- Email: Your email
- Password: Create password
- Country: **Ghana** ← Important!
- Phone: Your Ghana number

Click "Create Account" and verify your email.

---

## STEP 2: Get Your API Keys (2 minutes)

1. Log in to Paystack
2. Click Settings ⚙️
3. Click **Developer** in left menu
4. Find "API Keys" section
5. Copy the **Test Keys** (for testing) or **Live Keys** (for real money)

You'll see:
```
Public Key: pk_test_xxxxxxxxxxxxxxxxxxxxx
Secret Key: sk_test_xxxxxxxxxxxxxxxxxxxxx
```

---

## STEP 3: Add Keys to Your Project (1 minute)

Open your project folder and create a new file:

📄 **Create `.env` file** in project root

Copy-paste this:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_paste_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_paste_your_secret_key_here
```

Replace with YOUR keys from Paystack.

---

## STEP 4: Test It! (5 minutes)

Your server is already running at: **http://localhost:3000**

### Test Payment Flow:
1. Visit http://localhost:3000
2. Add products to cart
3. Click "Proceed to Checkout"
4. Fill in info with Ghana phone (e.g., 0201234567)
5. Click "Complete Order"
6. See Paystack payment options
7. Use test card: **5399 8383 5868 9090**
   - CVC: 419
   - Expiry: 05/26
8. Payment goes through!

---

## ✅ What's Changed?

| What | Before | Now |
|------|--------|-----|
| Currency | ₹ (Rupees) | ₵ (Cedis) |
| Prices | ₹100 | ₵100 |
| Tax | 5% | 2.5% |
| Shipping Free | Above ₹500 | Above ₵100 |
| Shipping Cost | ₹60 | ₵10 |
| Phone | +91 format | +233 format |
| Payment | UPI/Banking | Cards/Mobile Money |

---

## 📱 Valid Ghana Phone Numbers

All work:
- `0201234567` ✅
- `0531234567` ✅
- `+233201234567` ✅
- `+233 20 123 4567` ✅

---

## 💳 Test Cards

Use in checkout:

**Mastercard:**
- Card: `5399 8383 5868 9090`
- CVC: `419`
- Expiry: `05/26`

**Visa:**
- Card: `4084 0343 1117 2181`
- CVC: `408`
- Expiry: `11/29`

Any future expiry date works. OTP: Use any 3 digits.

---

## 🎯 Payment Methods Now Available

✅ **💳 Cards**
- Visa
- Mastercard
- Verve (Ghana bank cards)

✅ **📱 Mobile Money**
- MTN Mobile Money
- Vodafone Cash
- Airtel Money

✅ **🏦 Bank Transfer**
- Any Ghana bank

---

## ❓ Common Questions

**Q: Do I need to verify my Paystack account before testing?**
A: No. Test keys work right away. You only need verification to go live.

**Q: Can I switch to real payments later?**
A: Yes! Just switch to Live Keys and update .env

**Q: What if I want to accept real payments now?**
A: Complete KYC in Paystack → Get Live Keys → Switch in .env

**Q: Is my test data saved?**
A: No. Test transactions don't create real orders. You'll set up a database later.

**Q: Can customers use mobile money?**
A: Yes! When they checkout, they can select "Mobile Money" and use MTN/Vodafone.

---

## 🚨 If Something Doesn't Work

**Problem: "Can't see Paystack payment options"**
→ Make sure you added `.env` file and restarted the server

**Problem: "Phone validation fails with Ghana number"**
→ Use format like `0201234567` (no spaces or dashes for validation)

**Problem: "Test card declined"**
→ Use EXACTLY the cards listed above. Even 1 digit wrong = decline.

**Problem: "Can't create Paystack account"**
→ Use paystack.com/register → Make sure to select Ghana

---

## 📚 Full Documentation

If you need more info:
- **QUICK_START_GHANA.md** - Detailed quick start
- **PAYSTACK_SETUP.md** - Complete setup guide
- **GHANA_UPDATE.md** - All technical changes

---

## ✨ You're All Set!

1. ✅ Store updated to Ghana
2. ✅ Currency changed to GHS
3. ✅ Paystack integrated
4. ✅ Ready to test payments

**What to do now:**
1. Create Paystack account (5 min)
2. Add API keys (1 min)
3. Test a payment (5 min)
4. You're done! 🎉

---

## 📞 Need Help?

- Paystack Support: support@paystack.com
- Paystack Dashboard: paystack.com
- Docs: paystack.com/docs

---

**Your store URL:** http://localhost:3000

**Next:** Create Paystack account and add API keys!

🇬🇭 Welcome to the Ghana market! 🚀
