"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TbEye, TbEyeOff } from "react-icons/tb";

export default function SigninPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
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
      if (error.toLowerCase().includes("invalid")) {
        toast.error("Invalid credentials. Please try again.");
      } else if (error.toLowerCase().includes("email")) {
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
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <h1 className="text-lg font-semibold mt-12 text-center">
        Just Another Blog App
      </h1>

      {/* Card */}
      <div className="flex flex-1 flex-col items-center justify-start mt-44">
        <h2 className="text-3xl text-center font-bold mb-6">Welcome back</h2>
        <div className="rounded-md border-1 border-neutral-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email format",
                  },
                })}
                className={`w-80 px-3 py-1 text-sm bg-neutral-100/60 rounded-lg border placeholder:text-neutral-500/50`}
                placeholder="Johndoe@xyz.com"
              />
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm">Password</label>
              <div className="relative w-80">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "At least 6 characters",
                    },
                  })}
                  className={`w-full px-3 py-1 pr-10 text-sm bg-neutral-100/60 rounded-lg border placeholder:text-neutral-500/50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500/70 hover:text-neutral-900/80 cursor-pointer transition-all"
                >
                  {showPass ? <TbEyeOff /> : <TbEye />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-neutral-900 font-medium mt-6 text-neutral-50 w-full py-1.5 rounded-md text-sm flex items-center justify-center gap-3 cursor-pointer transition-all disabled:bg-neutral-900/50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-neutral-400 mt-6">
          Don&apos;t have an account?{" "}
          <span
            className="text-neutral-900 underline cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
