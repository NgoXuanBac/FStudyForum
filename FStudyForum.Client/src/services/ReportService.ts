import { Report, ReportCreate } from "@/types/report";
import api from "./api";
import { ResponseWith } from "@/types/response";

const getAll = async () => {
  const response = await api.get<ResponseWith<Array<string>>>("/report/all");
  return response.data.data;
};

const getUserReports = async (): Promise<Report[]> => {
  const response = await api.get<ResponseWith<Report[]>>("/report/user-report");
  return response.data.data;
};

const getReportById = async (reportId: string) => {
  const response = await api.get<ResponseWith<Report>>(`/report/${reportId}`);
  return response.data.data;
};

const responseReport = async (reportId: string, ResponseContent: string) => {
  const resp = await api.put(`/report/response/${reportId}`, {
    ResponseContent
  });
  return resp.data.message;
};

const sendReport = async (report: ReportCreate) => {
  const response = await api.post("/report/send", report);
  return response.data.message;
};

const ReportService = {
  getAll,
  getReportById,
  getUserReports,
  responseReport,
  sendReport
};

export default ReportService;
