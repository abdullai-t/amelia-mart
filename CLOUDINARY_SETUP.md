# Cloudinary Setup Guide for Amelia Mart

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- **Free Tier**: 25 GB storage, 25 GB bandwidth/month
- Automatic image optimization
- CDN delivery for fast loading
- Image transformations (resize, crop, format conversion)
- Secure URL-based image manipulation

Perfect for e-commerce product images!

## Step 1: Create Cloudinary Account (FREE)

1. Go to: https://cloudinary.com/users/register/free
2. Sign up with your email or Google account
3. Verify your email address
4. Complete the setup wizard

## Step 2: Get Your Credentials

1. Go to your Cloudinary Console: https://console.cloudinary.com/
2. On the dashboard, you'll see:
   - **Cloud Name** (e.g., `dxample123`)
   - **API Key** 
   - **API Secret**

## Step 3: Create Upload Preset (IMPORTANT)

For client-side uploads, you need an unsigned upload preset:

1. In Cloudinary Console, go to: **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `amelia-mart-products` (or any name you prefer)
   - **Signing Mode**: Select **Unsigned** (very important!)
   - **Folder**: `amelia-mart/products` (optional, helps organize images)
   - **Allowed formats**: jpg, png, webp, gif
5. Click **Save**

## Step 4: Configure Your Project

1. Create or update `.env.local` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

2. Add your Cloudinary credentials to `.env.local`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=amelia-mart-products
```

**Example:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxample123
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=amelia-mart-products
```

## Step 5: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Restart it
npm run dev
```

## Step 6: Test Image Upload

1. Go to: http://localhost:3000/admin/products
2. Click **Add Product**
3. Fill in product details
4. Upload an image (max 5MB)
5. You should see:
   - "Uploading image..." toast
   - "Image uploaded successfully!" toast
   - Image preview in the form

6. Save the product - the image URL will be a Cloudinary URL like:
   ```
   https://res.cloudinary.com/dxample123/image/upload/v1234567890/amelia-mart/products/xyz.jpg
   ```

## Troubleshooting

### Issue: "Cloudinary configuration missing"
**Solution**: Make sure you've created `.env` and added both variables.

### Issue: Upload fails with 401/403 error
**Solution**: Check that your upload preset has "Signing Mode" set to **Unsigned**.

### Issue: Image not showing after upload
**Solution**: 
- Check browser console for errors
- Verify the Cloudinary URL is accessible
- Make sure your Cloud Name is correct

### Issue: Variables not loading
**Solution**: 
- Restart your development server after adding env variables
- Check that variable names start with `NEXT_PUBLIC_`

## Image Optimization Features

Cloudinary automatically:
- Converts images to optimal format (WebP for modern browsers)
- Compresses images without quality loss
- Resizes images for different devices
- Serves from global CDN for fast loading

## Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Videos**: 25 credits/month

Perfect for small to medium e-commerce stores!

## Upgrading Later

If you need more:
- **Plus Plan**: $99/month - 100 GB storage, 100 GB bandwidth
- **Advanced Plan**: Custom pricing

## Security Notes

- Upload preset is "unsigned" = anyone can upload to your folder
- For production, consider:
  - Using signed uploads with backend
  - Adding file size/type restrictions
  - Implementing upload rate limiting
  - Setting up webhooks for moderation

## Next Steps

Once configured:
1. Your product images are automatically backed up in cloud
2. Images load faster from CDN
3. No need to store images locally
4. Automatic optimization for all devices

## Need Help?

- Cloudinary Docs: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com/
- Community: https://community.cloudinary.com/

---

**Status**: Ready to use! Upload your first product image to test. 🚀
