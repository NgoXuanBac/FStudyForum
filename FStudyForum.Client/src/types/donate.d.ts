export interface Payment {
    username: string;
    fullname: string;
    description: string;
    amount: number;
}

export interface QRCode {
    qrCode: string,
    qrDataURL: string
}
export interface ApiResponse {
    nextPage: number;
    page: number;
    pageSize: number;
    prevPage: number;
    records: Array<Record>;
    totalPages: number;
    totalRecords: number;
    error: number;
    message: string;
}
export interface Record {
    accountId: number;
    amount: number;
    bankCodeName: string;
    bankSubAccId: string;
    bookingDate: string | null;
    corresponsiveAccount: string;
    corresponsiveBankId: string;
    corresponsiveBankName: string;
    corresponsiveName: string;
    cusumBalance: number | null;
    description: string;
    id: number;
    paymentChannel: string;
    tid: string;
    virtualAccount: string;
    virtualAccountName: string;
    when: string;
}
export interface Donation{
    id: int;
    amount: number;
    message: string;
    username: string;
    tid: string | null;
}
export interface CreateDonation {
    amount: number;
    message: string;
    username: string;
    tid: string | null;
}
export interface UpdateDonation {
    amount: number;
    message: string;
    username: string;
    tid: string | null;
}
export interface StatisticsDonate {
    date: Date;
    totalDonation: number;
    totalAmount: number;
}