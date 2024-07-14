import { signIn } from "@/contexts/auth/reduce";
import { useAuth } from "@/hooks/useAuth";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import { Link, useNavigate } from "react-router-dom";
import { FC } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { checkEmail, cn } from "@/helpers/utils";
import { AxiosError } from "axios";
import { Button, Input } from "@material-tailwind/react";
import { Icons } from "@/components/Icons";
import React from "react";
import { Response } from "@/types/response";
import { CircleAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
type LoginFormsInputs = {
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .test("is-mailFPT", "Email must have @fpt.edu.vn", value => {
      return checkEmail(value);
    }),
  password: Yup.string().required("Password is required")
});

const SignIn: FC = () => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormsInputs>({
    mode: "onTouched",
    resolver: yupResolver(validation)
  });

  const { mutate: handleLogin, isPending: pending } = useMutation({
    mutationFn: async (form: LoginFormsInputs) => {
      await AuthService.login(form.email, form.password);
    },
    onSuccess: async () => {
      const user = await UserService.getProfile();
      dispatch(signIn({ user }));
      navigate("/");
    },
    onError: e => {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  });

  const { mutate: handleGoogleLogin, isPending: googlePending } = useMutation({
    mutationFn: async (response: CredentialResponse) => {
      const idToken = response.credential;
      if (!idToken) return;
      await AuthService.loginGoogle(idToken);
    },
    onSuccess: async () => {
      const user = await UserService.getProfile();
      dispatch(signIn({ user }));

      navigate("/");
    },
    onError: e => {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  });

  const isPending = pending || googlePending;

  return (
    <>
      <div className="flex flex-col mb-4 items-center">
        <Icons.logo className="w-10 h-10" />
        <span className="font-semibold text-lg">Login</span>
      </div>

      <form
        onSubmit={handleSubmit(form => handleLogin(form))}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm m-1 text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            placeholder="Email Address"
            className={cn(
              "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:opacity-100",
              " focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10  placeholder:text-gray-500",
              Boolean(errors?.email?.message) &&
                "focus:!border-red-600 focus:!border-t-red-600 focus:ring-red-600/10 !border-red-500  placeholder:text-red-500"
            )}
            labelProps={{ className: "hidden" }}
            crossOrigin={undefined}
            disabled={isPending}
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
        <div>
          <label htmlFor="password" className="block text-sm m-1 text-gray-700">
            Password
          </label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className={cn(
              "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:opacity-100",
              "focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10  placeholder:text-gray-500",
              Boolean(errors?.password?.message) &&
                "focus:!border-red-700 focus:!border-t-red-700 focus:ring-red-600/10 !border-red-500  placeholder:text-red-500"
            )}
            labelProps={{ className: "hidden" }}
            crossOrigin={undefined}
            disabled={isPending}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 ml-1 flex gap-x-1 items-center">
              <CircleAlert className="w-3 h-3" /> {errors.password.message}
            </span>
          )}
        </div>
        {error && (
          <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1 gap-x-1">
            <CircleAlert className="w-3 h-3" /> {error}
          </span>
        )}
        <div className="flex justify-end">
          <Link
            className="text-xs text-deep-orange-600 font-semibold hover:underline"
            to={"/auth/reset-password"}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="mt-6 text-sm normal-case"
          fullWidth
          disabled={isPending}
          variant="gradient"
          color="deep-orange"
        >
          Sign in
        </Button>
      </form>
      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>
          You don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-deep-orange-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-b border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs text-gray-600">
            Or continue with
          </span>
        </div>
      </div>
      <div className={cn("w-full flex justify-center font-inter")}>
        <GoogleLogin
          onSuccess={response => handleGoogleLogin(response)}
          onError={() => {
            console.log("Login Failed");
          }}
          width={"120"}
        />
      </div>
    </>
  );
};
export default SignIn;
