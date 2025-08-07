"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SigninPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{
    email: string;
    password: string;
  }>();

  const { isLoading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      toast.success("Login successful");
      router.push("/home");
    }

    if (error) {
      if (error.toLowerCase().includes("email")) {
        setError("email", { message: error });
      } else if (error.toLowerCase().includes("password")) {
        setError("password", { message: error });
      } else {
        toast.error(error);
      }
    }
  }, [user, error, router, setError]);

  const onSubmit = (data: { email: string; password: string }) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
