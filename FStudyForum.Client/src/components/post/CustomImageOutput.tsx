import ImageWithLoading from "../ui/ImageWithLoading";

type ImageOutputData = {
  file: { url: string };
  caption?: string;
  stretched?: boolean;
  withBorder?: boolean;
  withBackground?: boolean;
};
type CustomImageProps = {
  data: ImageOutputData;
};
const CustomImageOutput = ({ data }: CustomImageProps): JSX.Element => {
  const src = data.file.url;
  return (
    <div className="relative w-full min-h-[15rem]">
      <ImageWithLoading
        src={src}
        alt={data.caption}
        className="rounded-md w-full"
      />
    </div>
  );
};

export default CustomImageOutput;
