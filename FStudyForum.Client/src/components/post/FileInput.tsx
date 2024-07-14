import { MAX_FILE_SIZE } from "@/helpers/constants";
import { cn, truncateFileName, validateFile } from "@/helpers/utils";
import { CloudUpload, Plus } from "lucide-react";
import { forwardRef, type ChangeEvent, type DragEvent } from "react";
import ImageUpload from "./ImageUpload";

import React from "react";
import { showErrorToast } from "@/helpers/toast";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export interface FileInputContextType {
  files: FileWithURL[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithURL[]>>;
  moveTemp: (url: string) => void;
}

export const FileInputContext = React.createContext<FileInputContextType>({
  files: [],
  setFiles: () => null,
  moveTemp: () => null
});

export interface FileWithURL {
  upload?: File;
  preview: string;
  url?: string;
  name: string;
  type: string;
  size: number;
}

const FileInput = forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, inputRef) => {
    const [dragActive, setDragActive] = React.useState<boolean>(false);
    const { files, setFiles, moveTemp } = React.useContext(FileInputContext);

    const addFiles = (files: File[]) => {
      const newFiles = files.map<FileWithURL>(file => {
        return {
          upload: file,
          preview: URL.createObjectURL(file),
          name: truncateFileName(file.name),
          size: file.size,
          type: file.type
        };
      });
      setFiles(cur => [...cur, ...newFiles]);
    };
    const removeFile = (index: number) => {
      URL.revokeObjectURL(files[index].preview);
      files.splice(index, 1);
      setFiles(() => [...files]);
    };
    const updateFile = (index: number, newFile: FileWithURL) => {
      setFiles(cur => cur.map((item, i) => (index === i ? newFile : item)));
    };

    const handleDrag = (e: DragEvent<HTMLFormElement | HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const validFiles = Array.from(e.target.files).filter(
          file => validateFile(file).isValid
        );

        if (validFiles.length !== e.target.files.length) {
          showErrorToast(
            "File type not supported or size exceeds allowed limit"
          );
          return;
        }

        addFiles(validFiles);
      }
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const files = Array.from(e.dataTransfer.files);
        const acceptedFiles = files.filter(file => validateFile(file).isValid);

        if (files.length !== acceptedFiles.length) {
          showErrorToast(
            "File type not supported or size exceeds allowed limit"
          );
        }
        addFiles(files);
        setDragActive(false);
        e.dataTransfer.clearData();
      }
    };

    const noInput = files.length === 0;

    return (
      <div onDragEnter={handleDrag} className="h-full w-full overflow-hidden">
        <label
          htmlFor="dropzone-file"
          className={cn(
            "relative h-full flex flex-col items-center justify-center w-full border-2 ratio aspect-[8/3] border-gray-300 border-dashed rounded-lg transition",
            { "bg-gray-100": dragActive },
            { "h-fit aspect-auto": !noInput }
          )}
        >
          <div
            className={cn(
              "relative w-full h-full flex flex-col items-center justify-center",
              { "items-start": !noInput }
            )}
          >
            {noInput ? (
              <>
                <div
                  className="absolute inset-0 cursor-pointer"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                />

                <CloudUpload className="w-10 h-10 text-gray-400" />

                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 ">
                  up to <strong>infinite</strong> images,{" "}
                  {(MAX_FILE_SIZE / 1000000).toFixed(0)}MB per file
                </p>

                <input
                  {...props}
                  ref={inputRef}
                  multiple
                  onChange={handleChange}
                  accept="image/jpeg, image/jpg, image/png"
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                />
              </>
            ) : (
              <div className="flex flex-col w-full h-full">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden sm:rounded-lg">
                      <table className="min-w-full divide-y dark:divide-slate-600">
                        <thead className="bg-slate-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Preview
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Size
                            </th>

                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            ></th>
                          </tr>
                        </thead>
                        <tbody className="relative divide-y dark:divide-slate-600">
                          {files.map((file, index) => (
                            <ImageUpload
                              key={index}
                              file={file}
                              onRemove={() => {
                                removeFile(index);
                              }}
                              onLoaded={url => {
                                moveTemp(url);
                                updateFile(index, { ...file, url });
                              }}
                            />
                          ))}
                        </tbody>
                      </table>

                      <label
                        htmlFor="dropzone-file-images-present"
                        className="relative cursor-pointer group hover:dark:bg-slate-800 transition flex justify-center py-2 border-t border-slate-600"
                      >
                        <Plus className="group-hover:fill-slate-400 transition stroke-1 w-4 h-4 fill-slate-500" />
                        <input
                          {...props}
                          ref={inputRef}
                          multiple
                          onChange={handleChange}
                          onClick={event => (event.currentTarget.value = "")}
                          accept="image/jpeg, image/jpg, image/png"
                          type="file"
                          id="dropzone-file-images-present"
                          className="relative z-20 hidden"
                        />
                        <div
                          className="absolute inset-0"
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
    );
  }
);

export default FileInput;
