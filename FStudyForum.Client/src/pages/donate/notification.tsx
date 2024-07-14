// import { Button, Card } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import Success from "@/assets/images/check.png";
import Error from "@/assets/images/close.png";
import { cn } from "@/helpers/utils";

const Notification = () => {
  const location = useLocation();
  const { donate } = location.state || {};
  const formatToVND = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };
  return (
    <>
      <div>
        {donate !== null && donate !== undefined ? (
          <div className="flex flex-col">
            <img src={Success} alt="payment" className="w-20 mx-auto" />
            <div className={cn("font-semibold", "mx-auto", "mt-5")}>
              Thank You Very Much!
            </div>
            <div className={cn("mx-auto text-sm")}>
              You have just successfully amount: {formatToVND(donate.amount)}
            </div>
          </div>
        ) : (
          <div>
            <img src={Error} alt="payment" className="w-[20%] ml-[54%]" />
            <div className={cn("font-semibold", "ml-[54%]", "mt-[5%]")}>
              Payment error!
            </div>
            <div className={cn("ml-[43%]")}>
              Payment failed. Please try again!
            </div>
          </div>
        )}
      </div>
      {/* <Card color="transparent" shadow={false}>
        <Link to="/home">
          <Button className="mt-6 ml-[56%] bg-orange-500 w-[15%]" fullWidth>
            OK
          </Button>
        </Link>
      </Card> */}
    </>
  );
};
export default Notification;
