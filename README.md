# Local Market - E-commerce Website

A production-ready, mobile-responsive e-commerce website for a local provision market built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### 🛍️ Core Features
- **Homepage** - Hero section, featured products, categories, and about section
- **Product Catalog** - Grid view with filtering and search functionality
- **Product Categories** - Organized sections (groceries, vegetables, fruits, beverages, snacks, household items)
- **Product Details** - Individual product pages with images, descriptions, pricing, and stock status
- **Shopping Cart** - Add/remove items, quantity adjustment, real-time total calculation
- **Checkout Process** - Customer information form, order summary, order confirmation
- **Search Functionality** - Search products by name or category
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop

### 🎨 Technical Highlights
- **Next.js 14+ App Router** - Modern server and client components
- **TypeScript** - Full type safety across the application
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality, accessible components
- **Zustand** - Client-side state management with local storage persistence
- **React Hook Form + Zod** - Form validation
- **Sonner** - Toast notifications
- **Lucide React** - Beautiful icons
- **SEO Optimized** - Meta tags and proper structure
- **Accessible** - ARIA labels and keyboard navigation

## Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Notifications**: Sonner
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with header & footer
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── products/
│   │   ├── page.tsx            # All products page
│   │   └── [category]/
│   │       └── page.tsx        # Category-specific products
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx        # Individual product page
│   ├── cart/
│   │   └── page.tsx            # Shopping cart page
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   ├── order-confirmation/
│   │   └── page.tsx            # Order confirmation page
│   └── about/
│       └── page.tsx            # About page
├── components/
│   ├── common/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Footer
│   ├── product/
│   │   ├── ProductCard.tsx     # Product card component
│   │   ├── ProductGrid.tsx     # Product grid layout
│   │   └── CategorySidebar.tsx # Category filter sidebar
│   ├── cart/
│   │   ├── CartItem.tsx        # Individual cart item
│   │   └── CartSummary.tsx     # Cart summary & totals
│   ├── checkout/
│   │   ├── CheckoutForm.tsx    # Checkout form
│   │   ├── OrderSummary.tsx    # Order summary
│   │   └── OrderConfirmation.tsx # Confirmation display
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── useCart.ts              # Cart state management (Zustand)
├── utils/
│   └── helpers.ts              # Utility functions
├── types/
│   └── index.ts                # TypeScript type definitions
├── data/
│   └── products.ts             # Sample product data
└── lib/
    └── utils.ts                # Library utilities
```

## Quick Start

### 1. Install Dependencies
```bash
cd /Users/tahiru/Desktop/shop
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:3000`

## Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Features in Detail

### 1. Homepage
- Eye-catching hero section with call-to-action
- Feature highlights (Fresh, Fast Delivery, Best Prices)
- Category showcase
- Featured products section
- Newsletter signup
- About section

### 2. Products Page
- Search functionality
- Sort options (A-Z, Price Low-High, High-Low, Newest)
- Category filtering via sidebar
- Responsive product grid
- Product loading skeletons

### 3. Product Details
- High-quality product emoji/icon display
- Detailed descriptions
- Price and stock information
- Quantity selector
- Add to cart functionality
- Related products section

### 4. Shopping Cart
- Add/remove items
- Quantity adjustment
- Real-time price calculation
- Shipping calculation
- Tax calculation
- Continue shopping button

### 5. Checkout
- Multi-field form validation
- Customer information capture
- Address collection
- Order summary
- Form error handling

### 6. Order Confirmation
- Order details display
- Customer information recap
- Order tracking reference
- WhatsApp integration link
- Related product suggestions

## Sample Product Data

The project includes 36 sample products across 6 categories:
- **Groceries** - Rice, flour, lentils, oil, salt, etc.
- **Vegetables** - Tomatoes, onions, garlic, potatoes, carrots, peppers
- **Fruits** - Bananas, apples, oranges, grapes, mangoes, watermelons
- **Beverages** - Orange juice, milk, yogurt, tea, coffee, coconut water
- **Snacks** - Chickpea snack, nuts, popcorn, granola bars, chocolate, biscuits
- **Household Items** - Soap, detergent, bleach, paper towels, trash bags, air freshener

Each product includes name, description, price, stock, unit, ratings, and reviews.

## Customization Guide

### Adding New Products
Edit `src/data/products.ts` and add to the `products` array:
```typescript
{
  id: "unique-id",
  name: "Product Name",
  description: "Description",
  price: 100,
  category: "groceries",
  image: "/images/products/product.jpg",
  stock: 50,
  unit: "kg",
  rating: 4.5,
  reviews: 123,
}
```

### Updating Company Information
- `src/components/common/Header.tsx` - Logo, company name
- `src/components/common/Footer.tsx` - Contact details
- `src/app/about/page.tsx` - Company story and details
- `src/app/layout.tsx` - Meta tags

### WhatsApp Integration
Update phone numbers in:
- `src/components/checkout/OrderConfirmation.tsx`
- `src/components/common/Footer.tsx`
- `src/app/about/page.tsx`

### Adding Payment Gateway
To integrate actual payments (Razorpay, Stripe, etc.):
1. Install payment library: `npm install razorpay` (for example)
2. Update `src/components/checkout/CheckoutForm.tsx`
3. Modify order processing in `src/app/checkout/page.tsx`

## Responsive Design

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

Uses Tailwind CSS responsive utilities throughout.

## Performance Features

- Server-side rendering with Next.js App Router
- Image optimization ready
- Lazy loading for products
- Code splitting
- CSS optimization with Tailwind
- Local storage for cart persistence

## SEO & Accessibility

- ✅ Meta tags and Open Graph
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Mobile-friendly
- ✅ Color contrast compliance

## Deployment

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
npm run build
# Deploy the .next folder
```

### Traditional Server
```bash
npm run build
npm start
# Runs on port 3000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Future Enhancements

- [ ] Real payment gateway
- [ ] User authentication
- [ ] Order tracking
- [ ] Wishlist/favorites
- [ ] Product reviews
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Analytics
- [ ] Multi-language

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Clear cache and reinstall
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Build errors
```bash
npm run build
# Check error messages
npm run lint
```

## Support

For issues or customization help:
- Email: support@localmarket.com
- WhatsApp: +91 9876543210

## License

MIT License - Feel free to use for commercial projects

---

**Ready to launch your e-commerce store?** 🚀

This complete project includes everything you need. Just customize the branding, products, and payment gateway, then deploy!

