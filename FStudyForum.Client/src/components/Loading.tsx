import Spinner from "@/assets/images/rocket.gif";
const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <img className="w-12 h-12" src={Spinner} />
    </div>
  );
};
export default Loading;
