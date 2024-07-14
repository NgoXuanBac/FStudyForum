import ReportService from "@/services/ReportService";
import { Button, Chip } from "@material-tailwind/react";
import { FC, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/helpers/utils";
import { CircleAlert, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Response } from "@/types/response";
type ReportForm = {
  type: string;
  content?: string;
};

const validation = Yup.object().shape({
  type: Yup.string().required("Please select a report type"),
  content: Yup.string()
});

type Props = {
  postId: number;
  topicName: string;
  handler: () => void;
};

const ReportForm: FC<Props> = ({ postId, topicName, handler }) => {
  const [report, setReport] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ReportForm>({
    mode: "onTouched",
    resolver: yupResolver(validation)
  });
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await ReportService.getAll();
        setReport(response);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.message);
        }
      }
    };
    fetchReports();
  }, []);

  const { mutate: handleReport, isPending: pending } = useMutation({
    mutationFn: async (form: ReportForm) => {
      const payload = {
        type: form.type,
        content: {
          Content: form.content,
          ReportedPostId: postId,
          ReportedTopicname: topicName,
          ReportedUsername: user?.username ?? ""
        },
        creater: user?.email ?? ""
      };
      await ReportService.sendReport(payload);
    },
    onSuccess: async () => {
      setSubmitted(true);
    },
    onError: e => {
      const error = e as AxiosError;
      setError((error?.response?.data as Response)?.message || error.message);
    }
  });

  if (submitted) {
    return (
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Report Submitted
        </h1>
        <p className="text-xs text-gray-900 text-left">
          Thank you for your report. We will review it as soon as possible.
        </p>
        <div className="flex w-full justify-end">
          <Button
            onClick={handler}
            className="text-white p-3 px-6 rounded-lg mt-4 capitalize"
            variant="gradient"
            color="deep-orange"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute p-1 bg-blue-gray-700/50 rounded-full right-0"
        onClick={handler}
      >
        <X className="text-white w-4 h-4" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900">Report</h1>
      <p className="text-xs text-gray-900 text-left">
        Thanks for looking out for yourself and your fellow redditors by
        reporting things that break the rules. Let us know what's happening, and
        we'll look into it.
      </p>
      <form
        onSubmit={handleSubmit(form => handleReport(form))}
        className="mt-4"
      >
        <div className="overflow-x-auto max-h-[20rem] no-scrollbar">
          <div className=" w-full flex flex-wrap gap-2">
            {report.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedReport(item);
                  setValue("type", item, { shouldValidate: true });
                }}
                className="hover:cursor-pointer"
                role="button"
                tabIndex={0}
                aria-pressed={selectedReport === item ? "true" : "false"}
              >
                <Chip
                  className="rounded-full px-4 py-2 text-xs capitalize"
                  variant={selectedReport === item ? "filled" : "ghost"}
                  color="blue-gray"
                  value={item}
                  disabled={pending}
                  {...register("type")}
                />
              </div>
            ))}
          </div>
          {errors.type && (
            <span
              className={cn(
                "text-red-500 text-xs mt-1 ml-1 flex gap-x-1 items-center"
              )}
            >
              <CircleAlert className="w-3 h-3" /> {errors.type.message}
            </span>
          )}
          <div className="flex justify-center bg-blue-gray-700 mt-4 rounded-lg">
            <TextareaAutosize
              className="w-full p-4 appearance-none overflow-hidden bg-transparent text-white text-sm focus:outline-none resize-none"
              placeholder="Tell us more about the issue"
              disabled={pending}
              {...register("content")}
            />
          </div>
          <div>
            {!errors.type && error && (
              <span className="flex items-center tracking-wide text-xs text-red-500 mt-1 ml-1 gap-x-1">
                <CircleAlert className="w-3 h-3" /> {error}
              </span>
            )}
          </div>
          <div className="mt-6">
            <Button
              disabled={pending}
              type="submit"
              className=" text-white p-4 rounded-lg w-full"
              variant="gradient"
              color="deep-orange"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
