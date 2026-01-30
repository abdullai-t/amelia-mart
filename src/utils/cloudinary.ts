/**
 * Cloudinary Image Upload Utility
 * Free tier: 25 GB storage, 25 GB bandwidth/month
 */

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  [key: string]: any;
}

/**
 * Upload image to Cloudinary
 * @param file - Image file to upload
 * @param folder - Optional folder name in Cloudinary (e.g., 'products')
 * @returns Promise with the uploaded image URL
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "amelia-mart/products"
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Cloudinary error:", errorData);
      throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param publicId - Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number
): string {
  if (!url.includes("cloudinary.com")) {
    return url; // Return original URL if not a Cloudinary URL
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return url;

  // Extract public_id from URL
  const urlParts = url.split("/upload/");
  if (urlParts.length !== 2) return url;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push("c_fill", "f_auto", "q_auto");

  return `${urlParts[0]}/upload/${transformations.join(",")}/${urlParts[1]}`;
}

/**
 * Check if string is an emoji (for backward compatibility with demo data)
 */
export function isEmoji(str: string): boolean {
  const emojiRegex = /[\p{Emoji}]/u;
  return emojiRegex.test(str) && str.length <= 4;
}
