import { FC, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthService from "@/services/AuthService";
import { Icons } from "@/components/Icons";

const ConfirmEmail: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(20);
  const [showResendButton, setShowResendButton] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      navigate("/auth/signin");
      return;
    }
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setShowResendButton(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleResendEmail = async () => {
    navigate(`/auth/confirm-email?email=${email}`, { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 0);
    try {
      await AuthService.resendEmail(email);
      setCountdown(20);
      setShowResendButton(false);
    } catch (error) {
      console.error("Failed to resend confirmation email.");
    }
  };

  return (
    <>
      <div className="w-full">
        <Icons.logo className="w-10 h-10 text-center" />
        <p className="text-lg font-semibold">Check mail</p>
        <p className="text-xs text-gray-600 text-left">
          Please check your email inbox and click on the provided link to
          confirm email.{" "}
          {countdown > 0 && (
            <span className="text-xs">
              If you don't receive email, you can resend it in{" "}
              <span className="text-deep-orange-600 font-semibold">
                {countdown}
              </span>{" "}
              seconds.
            </span>
          )}
          {countdown === 0 && showResendButton && (
            <span className="text-xs">
              If you don't receive email,{" "}
              <span
                onClick={handleResendEmail}
                className="text-blue-400 focus:text-blue-700 font-semibold"
              >
                click here to resend
              </span>
            </span>
          )}
        </p>

        <p className="mt-6 text-gray-600 text-xs">
          Go back to{" "}
          <Link
            to="/auth/signin"
            className="text-deep-orange-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default ConfirmEmail;
