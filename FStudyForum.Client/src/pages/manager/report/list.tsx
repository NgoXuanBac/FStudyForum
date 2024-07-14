import ReportService from "@/services/ReportService";
import { Alert, Spinner } from "@material-tailwind/react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types/report";
import { Link, useNavigate } from "react-router-dom";
const ReportList: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: reports,
    error,
    isLoading
  } = useQuery<Report[]>({
    queryKey: ["REPORT_LIST"],
    queryFn: () => ReportService.getUserReports(),
    refetchOnWindowFocus: false
  });
  const handleResponseClick = (reportId: number) => {
    navigate(`/manager/report/${reportId}`);
  };
  if (error)
    return (
      <Alert color="red" className="p-4">
        Can't fetch reports
      </Alert>
    );
  if (isLoading) return <Spinner className="mx-auto" />;
  return (
    <>
      <ul className="bg-white shadow overflow-hidden sm:rounded-md max-w-full mx-auto mt-16">
        {reports?.map(report => (
          <li className="border-t border-gray-200" key={report.id}>
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <Link
                  to={`/report/${report.id}`}
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  {report.type}
                </Link>
                <p className=" text-base text-blue-gray-900">
                  From: {report.creater}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Status:{" "}
                  <span
                    className={
                      report.responseContent !== ""
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {report.responseContent !== "" ? "Responsed" : "Pending"}
                  </span>
                </p>
                <div
                  onClick={() => handleResponseClick(report.id)}
                  className="hover:cursor-pointer px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-90 transition-transform"
                >
                  Response
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ReportList;
