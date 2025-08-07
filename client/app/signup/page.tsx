"use client";

import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="lg:border lg:border-neutral-200 w-full h-screen 2xl:w-[1440px] 2xl:h-[900px] 2xl:rounded-[20px]">
        <div className="w-full h-full grid lg:grid-cols-2 grid-cols-1">
          <div className="flex flex-col mt-20 lg:mt-21 mb-16 mx-6 sm:mx-12 lg:mx-18 items-center justify-between">
            <div className="flex flex-col gap-4 items-start">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-1 2xl:w-85">
                  Create your JABA Account
                </h2>
                <p className="font-medium text-neutral-600/80">
                  Just another blog app
                </p>
              </div>
              <SignUpForm />
            </div>
            <p className="text-sm text-neutral-500">
              Already have an account?{" "}
              <span
                className="text-neutral-900 underline cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Login
              </span>
            </p>
          </div>
          {/* Image later */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-neutral-200 w-full max-w-[900px] h-[850px] lg:rounded-l-2xl p-6 flex flex-col gap-6 overflow-hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
