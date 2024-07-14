import { toast } from "react-toastify";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    className: "custom-toast",
    bodyClassName: "custom-toast-body"
  });
};
export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    className: "custom-toast",
    bodyClassName: "custom-toast-body"
  });
};
