export interface Report {
     id: number;
     type: string;
     content: ReportContent;
     responseContent: string | null;
     creater: string;
}

export interface ReportCreate {
     type: string;
     content: ReportContent;
     creater: string;
}

interface ReportContent {
     Content?: string;
     ReportedPostId: number;
     ReportedTopicname: string;
     ReportedUsername: string;
}