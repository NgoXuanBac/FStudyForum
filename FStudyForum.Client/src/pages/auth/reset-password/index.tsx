import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkEmail, cn } from "@/helpers/utils";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { Icons } from "@/components/Icons";
import { AxiosError } from "axios";
import { Response } from "@/types/response";
import React from "react";
import AuthService from "@/services/AuthService";
import { CircleAlert } from "lucide-react";

type ForgotPasswordFormInputs = {
  email: string;
};

const validation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .test("is-mailFPT", "Email must have @fpt.edu.vn", value => {
      return checkEmail(value);
    })
});

const resendTime = 20;

const ForgotPassword: FC = () => {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(resendTime);
  const [canSend, setCanSend] = React.useState(true);

  React.useEffect(() => {
    if (canSend) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setCanSend(true);
          return resendTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [canSend]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormInputs>({
    mode: "onTouched",
    resolver: yupResolver(validation)
  });

  const handleSend = async (form: ForgotPasswordFormInputs) => {
    try {
      setError("");
      setLoading(true);
      setCanSend(false);
      await AuthService.forgotPassword(form.email);
    } catch (e) {
      setCanSend(true);
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ml-1 mb-6 w-full">
        <Icons.logo className="w-10 h-10" />
        <p className="text-lg font-semibold">Reset your password</p>
        <p className="text-xs text-gray-600 text-left">
          Enter your emal and we will send you instructions on how to reset your
          password.
        </p>
      </div>
      <form onSubmit={handleSubmit(handleSend)} className="w-full">
        <div>
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
            disabled={loading || !canSend}
            crossOrigin={undefined}
            {...register("email")}
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
        {error && (
          <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1 gap-x-1">
            <CircleAlert className="w-3 h-3" />
            {error}
          </span>
        )}
        {countdown != resendTime && (
          <span className="flex items-center tracking-wide text-xs text-green-500 mt-1 ml-1">
            Please check your email inbox. If you don't receive the email,
            resend after {countdown} seconds
          </span>
        )}

        <Button
          type="submit"
          className="mt-4 text-sm normal-case"
          disabled={loading || !canSend}
          variant="gradient"
          color="deep-orange"
          fullWidth
        >
          Send instructions
        </Button>
      </form>
      <div className="ml-1 mt-6">
        <p className="text-xs text-gray-600">
          Go back to{" "}
          <Link
            to="/auth/signin"
            className="hover:underline text-deep-orange-600 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default ForgotPassword;
