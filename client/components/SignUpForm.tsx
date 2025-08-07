"use client";

import { signupUser } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiCheckFill, RiCircleFill } from "react-icons/ri";
import { TbEye, TbEyeOff } from "react-icons/tb";

type FormData = {
  name: string;
  email: string;
  password: string;
};

type ValidationState = {
  hasMixedCase: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  isMinLength: boolean;
};

export default function SignUpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [showPass, setShowPass] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [email, setEmail] = useState("");
  const [nameValid, setNameValid] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [validations, setValidations] = useState<ValidationState>({
    hasMixedCase: false,
    hasDigit: false,
    hasSymbol: false,
    isMinLength: false,
  });

  const validatePassword = (pwd: string) => {
    setPassword(pwd);
    setValidations({
      hasMixedCase: /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
      hasDigit: /\d/.test(pwd),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      isMinLength: pwd.length >= 8,
    });
  };

  const validateName = (name: string) => {
    const isValid = name.trim().length > 0 && name.length <= 20;
    setNameValid(isValid);
  };

  const validateEmail = (email: string) => {
    const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    setEmailValid(pattern.test(email));
  };

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(signupUser(data));
    if (signupUser.fulfilled.match(result)) {
      router.push("/home");
    }
  };

  const isValid =
    validations.hasDigit &&
    validations.hasMixedCase &&
    validations.hasSymbol &&
    validations.isMinLength &&
    emailValid &&
    nameValid;

  const icon = (condition: boolean) =>
    condition ? <RiCheckFill size={12} /> : <RiCircleFill size={6} />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start justify-center gap-2"
    >
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Name</label>
        <input
          {...register("name", {
            required: "Name is required",
            maxLength: { value: 20, message: "Max 20 characters" },
          })}
          onChange={(e) => {
            const val = e.target.value;
            setName(val);
            validateName(val);
          }}
          value={name}
          className={`w-80 px-3 py-1 text-sm bg-neutral-100/60 rounded-lg border placeholder:text-neutral-500/50`}
          placeholder="Your name"
        />
      </div>

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
          value={email}
          onChange={(e) => {
            const val = e.target.value;
            setEmail(val);
            validateEmail(val);
          }}
          className={`w-80 px-3 py-1 text-sm bg-neutral-100/60 rounded-lg border placeholder:text-neutral-500/50`}
          placeholder="Johndoe@xyz.com"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm">Password</label>
        <div className="relative w-80">
          <input
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "At least 6 characters",
              },
              onChange: (e) => validatePassword(e.target.value),
            })}
            value={password}
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
      </div>

      {/* Password checklist */}
      <ul className="text-sm">
        <li className="flex items-center gap-2">
          {icon(validations.hasMixedCase)} Mix of uppercase and lowercase
        </li>
        <li className="flex items-center gap-2">
          {icon(validations.hasDigit)} Contains at least one number
        </li>
        <li className="flex items-center gap-2">
          {icon(validations.hasSymbol)} Contains at least one symbol
        </li>
        <li className="flex items-center gap-2">
          {icon(validations.isMinLength)} Minimum 8 characters
        </li>
      </ul>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid}
        className="bg-neutral-900 font-medium mt-6 text-neutral-50 w-full py-1.5 rounded-md text-sm flex items-center justify-center gap-3 cursor-pointer transition-all disabled:bg-neutral-900/50 disabled:cursor-not-allowed mb-4"
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
