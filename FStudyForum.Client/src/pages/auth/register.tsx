import AuthService from "@/services/AuthService";
import { FC } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { checkEmail, cn } from "@/helpers/utils";
import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { Icons } from "@/components/Icons";
import React from "react";
import { AxiosError } from "axios";
import { Response } from "@/types/response";
import { CircleAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const validation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .trim()
    .test("is-mailFPT", "Email can't contain only @fpt.edu.vn", value => {
      return value !== "@fpt.edu.vn";
    })
    .test("is-mailFPT", "Email must have @fpt.edu.vn", value => {
      return checkEmail(value);
    }),
  password: Yup.string()
    .required("Password is required")
    .trim()
    .min(8, "Password must have at least 8 characters")
    .max(20, "Passwords can only be up to 20 characters")
    .matches(/[a-z]/, "Password must have at least one lowercase letter")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/\d/, "Password must have at least one number")
    .matches(/[@$!%*?&]/, "Password must have at least one special character"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .trim()
    .oneOf([Yup.ref("password")], "Confirm password does not match")
});

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormInputs>({
    mode: "onTouched",
    resolver: yupResolver(validation)
  });

  const { mutate: handleRegister, isPending } = useMutation({
    mutationFn: async (form: RegisterFormInputs) => {
      await AuthService.register(form.email, form.password);
    },
    onSuccess: (_, variables) => {
      navigate(`/auth/confirm-email?email=${variables.email}`);
    },
    onError: e => {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  });

  return (
    <>
      <div className="flex flex-col mb-4 items-center">
        <Icons.logo className="w-10 h-10" />
        <span className="font-semibold text-lg">Register</span>
      </div>
      <form
        onSubmit={handleSubmit(form => handleRegister(form))}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm m-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            className={cn(
              "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:opacity-100",
              " focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10  placeholder:text-gray-500",
              Boolean(errors?.email?.message) &&
                "focus:!border-red-600 focus:!border-t-red-600 focus:ring-red-600/10 !border-red-500  placeholder:text-red-500"
            )}
            labelProps={{ className: "hidden" }}
            disabled={isPending}
            crossOrigin={undefined}
            {...register("email")}
            onKeyDown={e => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
          />

          {errors.email && (
            <span
              className={cn(
                "text-red-500 text-xs mt-1 ml-1 flex gap-x-1 items-center"
              )}
            >
              <CircleAlert className="w-3 h-3" /> {errors.email.message}
            </span>
          )}
        </div>
        <div className="relative">
          <label htmlFor="password" className="block text-gray-700 text-sm m-1">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={cn(
                "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:opacity-100",
                "focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 placeholder:text-gray-500",
                Boolean(errors?.password?.message) &&
                  "focus:!border-red-600 focus:!border-t-red-600 focus:ring-red-600/10 !border-red-500 placeholder:text-red-500"
              )}
              labelProps={{ className: "hidden" }}
              disabled={isPending}
              crossOrigin={undefined}
              {...register("password")}
              onKeyDown={e => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 ml-1 flex gap-x-1 items-center">
              <CircleAlert className="w-3 h-3" /> {errors.password.message}
            </span>
          )}
        </div>

        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm text-gray-700 m-1"
          >
            Confirm password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className={cn(
                "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:opacity-100",
                "focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 placeholder:text-gray-500",
                Boolean(errors?.confirmPassword?.message) &&
                  "focus:!border-red-600 focus:!border-t-red-600 focus:ring-red-600/10 !border-red-500 placeholder:text-red-500"
              )}
              labelProps={{ className: "hidden" }}
              disabled={isPending}
              crossOrigin={undefined}
              {...register("confirmPassword")}
              onKeyDown={e => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1 ml-1 flex gap-x-1 items-center">
              <CircleAlert className="w-3 h-3" />{" "}
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {error && !isPending && (
          <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1 gap-x-1 ">
            <CircleAlert className="w-3 h-3" /> {error}
          </span>
        )}
        <div>
          <Button
            type="submit"
            className="mt-6 normal-case text-sm text-center"
            fullWidth
            disabled={isPending}
            variant="gradient"
            color="deep-orange"
          >
            Register
          </Button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-600 text-center">
        <span>
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className="text-deep-orange-600 font-semibold hover:underline "
          >
            Sign in
          </Link>
        </span>
      </div>
    </>
  );
};

export default SignUp;
