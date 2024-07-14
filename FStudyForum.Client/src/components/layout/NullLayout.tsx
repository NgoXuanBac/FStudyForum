import ThumbNail from "@/assets/images/null_dark.png";

const NullLayout = () => {
    return (
        <div className="flex mt-12 h-full w-full flex-col items-center justify-center gap-5">
            <img src={ThumbNail} className="w-[200px]" alt="NULL"></img>
            <div className="text-label-3 dark:text-dark-label-3">No data</div>
        </div>
    );
};
export default NullLayout;