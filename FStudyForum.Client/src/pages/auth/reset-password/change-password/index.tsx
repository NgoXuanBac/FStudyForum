import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icons } from "@/components/Icons";
import { cn } from "@/helpers/utils";
import { Button, Input } from "@material-tailwind/react";
import React from "react";
import { AxiosError } from "axios";
import { Response } from "@/types/response";
import AuthService from "@/services/AuthService";
import { CircleAlert } from "lucide-react";

type ChangePasswordFormInputs = {
  password: string;
  confirmPassword: string;
};

const validation = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must have at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Confirm password do not match")
});

const ChangePassword: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordFormInputs>({
    mode: "onTouched",
    resolver: yupResolver(validation)
  });

  const handleChange = async (form: ChangePasswordFormInputs) => {
    if (!token || !email) {
      navigate("/auth/signin");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      await AuthService.changePassword(token, email, form.password);
      navigate("/auth/signin");
    } catch (e) {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <Icons.logo className="w-10 h-10 mx-auto" />
        <p className="text-lg font-semibold">Change your password</p>
      </div>
      <form onSubmit={handleSubmit(handleChange)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm m-1">
            New password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            className={cn(
              "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:opacity-100",
              " focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10  placeholder:text-gray-500",
              Boolean(errors?.password?.message) &&
                "focus:!border-red-600 focus:!border-t-red-600 focus:ring-red-600/10 !border-red-500  placeholder:text-red-500"
            )}
            labelProps={{ className: "hidden" }}
            disabled={loading}
            crossOrigin={undefined}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 ml-1 flex gap-x-1 items-center">
              <CircleAlert className="w-3 h-3" /> {errors.password.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm text-gray-700 m-1"
          >
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Cofirm password"
            className={cn(
              "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:opacity-100",
              " focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10  placeholder:text-gray-500",
              Boolean(errors?.confirmPassword?.message) &&
                "focus:!border-red-600 focus:!border-t-red-600 focus:ring-red-600/10 !border-red-500  placeholder:text-red-500"
            )}
            labelProps={{ className: "hidden" }}
            disabled={loading}
            crossOrigin={undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1 ml-1 flex gap-x-1 items-center">
              <CircleAlert className="w-3 h-3" />
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        {error && (
          <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1 gap-x-1">
            <CircleAlert className="w-3 h-3" /> {error}
          </span>
        )}
        <Button
          type="submit"
          className="mt-6 text-sm normal-case"
          fullWidth
          disabled={loading}
          variant="gradient"
          color="deep-orange"
        >
          Change
        </Button>
      </form>
      <div className="text-center mt-6">
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

export default ChangePassword;
