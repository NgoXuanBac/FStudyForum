import { forwardRef } from "react";
import { Trash2 } from "lucide-react";
import { cn, getImageParams } from "@/helpers/utils";
import React from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/helpers/storage";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { FileWithURL } from "./FileInput";
import { showErrorToast } from "@/helpers/toast";
interface ImageUploadProps extends React.HTMLAttributes<HTMLTableRowElement> {
  file: FileWithURL;
  onRemove: () => void;
  onLoaded: (url: string) => void;
}

const ImageUpload = forwardRef<HTMLTableRowElement, ImageUploadProps>(
  ({ file, className, onRemove, onLoaded, ...props }, imageRef) => {
    const [progess, setProgess] = React.useState(file.url ? 100 : 0);

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onRemove();
    };

    React.useEffect(() => {
      if (file.url) return;
      const startUpload = async () => {
        if (!file.upload) return;
        const { width, height } = await getImageParams(file.upload);
        const storageRef = ref(
          storage,
          `images/attachment${crypto.randomUUID()}_width${width}_height${height}`
        );
        const metadata = {
          contentType: "image/jpeg"
        };
        const uploadTask = uploadBytesResumable(
          storageRef,
          file.upload,
          metadata
        );
        uploadTask.on(
          "state_changed",
          snapshot => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgess(Math.min(90, percent));
          },
          error => {
            showErrorToast(error.message);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setProgess(100);
            onLoaded(url);
          }
        );
      };

      startUpload();
    }, [file.upload, file.url, onLoaded]);

    return (
      <tr ref={imageRef} {...props} className={cn("", className)}>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div
            className={cn(
              progess != 100 && "opacity-60",
              "relative flex h-12 w-20 justify-center overflow-hidden rounded-sm"
            )}
          >
            <img
              src={file.preview || file.url}
              className="scale-125 absolute top-1/2 left-0 object-cover opacity-30 -translate-y-1/2 blur-xl w-full"
              alt={file.name}
              loading="lazy"
            />
            <img
              className="object-contain"
              src={file.preview || file.url}
              alt={file.name}
            />
            <div
              className={cn(
                "absolute flex w-full h-full justify-center items-center",
                progess == 100 && "hidden"
              )}
            >
              <CircularProgressbar
                value={progess}
                strokeWidth={50}
                className="w-3 h-3"
                styles={buildStyles({
                  strokeLinecap: "butt",
                  pathColor: "gray"
                })}
              />
            </div>
          </div>
        </td>
        <td className="px-6 py-4 truncate whitespace-normal text-sm font-medium dark:text-slate-400 ">
          <div className="">
            <p
              className={cn(
                "w-[10rem] text-ellipsis whitespace-nowrap overflow-hidden"
              )}
            >
              {file.name}
            </p>
          </div>
        </td>
        <td
          className={cn(
            "px-6 py-4 whitespace-nowrap text-sm dark:text-slate-400"
          )}
        >
          {(file.size / 1000).toFixed(0)} KB
        </td>

        <td className="px-6 py-4 h-full whitespace-nowrap text-sm ">
          <button
            type="button"
            className="flex p-2 items-center justify-center cursor-pointer"
            disabled={progess != 100}
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </td>
      </tr>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
