# Deployment Guide - Local Market E-Commerce

Complete guide for deploying your Local Market e-commerce website to production.

## Pre-Deployment Checklist

- [ ] Customize company branding (name, logo, colors)
- [ ] Update product data with real images
- [ ] Add real contact information
- [ ] Set up payment gateway
- [ ] Configure email notifications
- [ ] Test all functionality locally
- [ ] Run build: `npm run build`
- [ ] Test production build: `npm run start`
- [ ] Review all pages for broken links

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Vercel is the official hosting platform for Next.js and provides the best experience.

#### Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub account (optional, but recommended)

#### Steps

1. **Push to GitHub** (Optional but recommended)
```bash
cd /Users/tahiru/Desktop/shop
git add .
git commit -m "Local Market e-commerce website"
git remote add origin https://github.com/yourusername/shop.git
git branch -M main
git push -u origin main
```

2. **Deploy via GitHub**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"
   - Vercel automatically detects Next.js
   - Click "Deploy"
   - Done! Your site is live

3. **Deploy via Vercel CLI**
```bash
npm install -g vercel
cd /Users/tahiru/Desktop/shop
vercel
# Follow the prompts
# Choose production environment when asked
```

#### Post-Deployment
- Vercel will provide you a unique URL (e.g., `shop.vercel.app`)
- Set up custom domain in Vercel dashboard
- Auto-deploys on git push to main branch

---

### Option 2: Deploy to Netlify

#### Prerequisites
- Netlify account (free at https://netlify.com)
- GitHub account (recommended)

#### Steps

1. **Build the project**
```bash
npm run build
```

2. **Deploy via Netlify UI**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Select your GitHub repo
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy"

3. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
cd /Users/tahiru/Desktop/shop
netlify deploy --prod
```

---

### Option 3: Traditional VPS/Server Deployment

#### Prerequisites
- Ubuntu/Linux VPS (DigitalOcean, AWS EC2, Linode, etc.)
- Node.js 18+ installed on server
- PM2 for process management

#### Steps

1. **Connect to your server**
```bash
ssh root@your_server_ip
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone and setup project**
```bash
git clone https://github.com/yourusername/shop.git
cd shop
npm install
```

4. **Build for production**
```bash
npm run build
```

5. **Install PM2**
```bash
npm install -g pm2
```

6. **Start with PM2**
```bash
pm2 start "npm start" --name "local-market"
pm2 startup
pm2 save
```

7. **Setup Nginx reverse proxy**
```bash
sudo apt-get install nginx

# Create config file
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Enable SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

9. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

---

### Option 4: Docker Deployment

#### Create Dockerfile

Create `Dockerfile` in project root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Deploy

```bash
docker-compose up -d
```

---

## Environment Variables

Create `.env.production` in your project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Payment Gateway (if using)
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp Integration
WHATSAPP_PHONE=+91 9876543210
WHATSAPP_API_KEY=your_whatsapp_api_key
```

---

## Domain Configuration

### Using Vercel
1. Go to project settings in Vercel dashboard
2. Click "Domains"
3. Add your domain
4. Update DNS records at your domain registrar

### Using Custom Domain
1. Point your domain's DNS to your server
   - A record: `@` → your server IP
   - CNAME record: `www` → `@`

2. Verify DNS propagation:
```bash
dig yourdomain.com
```

---

## Post-Deployment Setup

### 1. Add Payment Gateway

**For Razorpay:**
```bash
npm install razorpay
```

Update `src/components/checkout/CheckoutForm.tsx`:
```typescript
import Razorpay from 'razorpay';

const handlePayment = async (amount: number) => {
  const response = await fetch('/api/payment', {
    method: 'POST',
    body: JSON.stringify({ amount })
  });
  const data = await response.json();
  
  const options = {
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    amount: amount * 100, // Convert GHS to kobo
    currency: 'GHS',
    reference: data.reference,
  };
  
  // Use Paystack instead
  window.PaystackPop.setup(options);
};
```

### 2. Paystack Integration (Ghana)

Paystack is already integrated! See [PAYSTACK_SETUP.md](./PAYSTACK_SETUP.md) for configuration:

```bash
# Set your Paystack keys in .env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

Paystack supports:
- 💳 Card Payments (Visa, Mastercard, Verve)
- 📱 Mobile Money (MTN, Vodafone, Airtel)
- 🏦 Bank Transfers

### 3. Email Notifications

Install Nodemailer:
```bash
npm install nodemailer
```

Create `src/lib/email.ts`:
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

export const sendOrderEmail = async (email: string, orderId: string) => {
  await transporter.sendMail({
    from: 'orders@localmarket.com',
    to: email,
    subject: `Order Confirmation #${orderId}`,
    html: `<p>Thank you for your order!</p>`
  });
};
```

### 3. Google Analytics

Add to `src/app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXX" />
      </body>
    </html>
  )
}
```

### 4. Error Logging (Sentry)

```bash
npm install @sentry/nextjs
```

---

## Monitoring & Maintenance

### Monitor Performance
```bash
# Check resource usage
ps aux | grep node

# Check disk space
df -h

# Check memory
free -h
```

### View Logs
```bash
# Vercel logs
vercel logs

# Server logs
pm2 logs local-market
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart
pm2 restart local-market
```

---

## Performance Optimization

### 1. Enable Caching
Add to `next.config.js`:
```javascript
module.exports = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600'
        }
      ]
    }
  ]
};
```

### 2. Image Optimization
Add real images to replace emojis:
```tsx
import Image from 'next/image';

<Image 
  src="/images/product.jpg"
  alt="Product"
  width={300}
  height={300}
  priority
/>
```

### 3. Database Setup (Optional)
For full production with database:
```bash
npm install postgres
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Memory Issues
```bash
# Increase Node heap size
NODE_OPTIONS=--max_old_space_size=4096 npm start
```

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### High Server Load
- Use CDN (Cloudflare, AWS CloudFront)
- Enable compression in Nginx
- Optimize images
- Add caching headers

---

## Backup Strategy

### Backup Database (if using)
```bash
pg_dump dbname > backup.sql

# Restore
psql dbname < backup.sql
```

### Backup Application
```bash
tar -czf backup.tar.gz ~/shop/
aws s3 cp backup.tar.gz s3://your-bucket/
```

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Update dependencies regularly: `npm audit fix`
- [ ] Use environment variables for secrets
- [ ] Enable API rate limiting
- [ ] Add CORS headers
- [ ] Set up DDoS protection (Cloudflare)
- [ ] Regular backups
- [ ] Monitor error logs
- [ ] Update Node.js regularly

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| High memory usage | Increase server RAM or optimize code |
| Slow page loads | Add CDN, compress images, enable caching |
| Database errors | Check connection string, verify database is running |
| SSL errors | Renew certificate: `certbot renew` |
| 404 errors | Check routing, verify pages exist |
| Cart not persisting | Check localStorage access, verify browser support |

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Netlify Docs**: https://docs.netlify.com
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Your Local Market e-commerce store is now ready for production!** 🚀

For questions or issues, contact your hosting provider's support team.
