"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateEmail, validatePhone } from "@/utils/helpers";

// Form validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(validatePhone, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(5, "Zip code is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
}

export default function CheckoutForm({
  onSubmit,
  isLoading = false,
}: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register("firstName")}
              className="mt-1"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register("lastName")}
              className="mt-1"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+233 24 123 4567"
              {...register("phone")}
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Shipping Address
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-gray-700">
              Street Address
            </Label>
            <Input
              id="address"
              placeholder="123 Main Street, Apartment 4B"
              {...register("address")}
              className="mt-1"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-gray-700">
                City
              </Label>
              <Input
                id="city"
                placeholder="New York"
                {...register("city")}
                className="mt-1"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="zipCode" className="text-gray-700">
                Zip Code
              </Label>
              <Input
                id="zipCode"
                placeholder="10001"
                {...register("zipCode")}
                className="mt-1"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.zipCode.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method - Paystack */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="payment" value="card" defaultChecked className="w-4 h-4" />
            <span className="text-gray-700">💳 Card (Visa, Mastercard)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="payment" value="mobile" className="w-4 h-4" />
            <span className="text-gray-700">📱 Mobile Money (MTN, Vodafone, Airtel)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="payment" value="bank" className="w-4 h-4" />
            <span className="text-gray-700">🏦 Bank Transfer</span>
          </label>
        </div>
        <div className="mt-4 p-3 bg-white border border-amber-100 rounded">
          <p className="text-sm text-gray-700 font-semibold flex items-center gap-2">
            🔒 Powered by <span className="font-bold text-red-600">Paystack</span>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Your payment information is secure and encrypted. Paystack handles all transactions securely.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
      >
        {isLoading ? "Processing Order..." : "Complete Order"}
      </Button>
    </form>
  );
}
