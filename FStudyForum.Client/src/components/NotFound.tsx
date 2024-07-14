import Image from "@/assets/images/not-found.gif";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <img src={Image} alt="Not found" className="w-24 h-24" />
        <span className="text-gray-600 font-semibold">404 NOT FOUND</span>
      </div>
    </div>
  );
};
export default NotFound;
