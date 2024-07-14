import ColumnChart from "@/components/chart/ColumnChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import LineChart from "@/components/chart/LineChart";
import SelectDate from "@/components/chart/SelectDate";
import { StatisticsDonate } from "@/types/donate";
import { StatisticsPost } from "@/types/post";
import React from "react";

const Analytics = () => {
  const [dataPost, setDataPost] = React.useState<StatisticsPost[]>([]);
  const [dataDonate, setDataDonate] = React.useState<StatisticsDonate[]>([]);
  const [totalPosts, setTotalPosts] = React.useState(0);
  const [totalComment, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [totalDonate, setTotalDonate] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  React.useEffect(() => {
    setTotalPosts(dataPost.reduce((sum, post) => sum + post.totalPosts, 0));
    setTotalComment(
      dataPost.reduce((sum, post) => sum + post.totalComments, 0)
    );
    setTotalVote(dataPost.reduce((sum, post) => sum + post.totalVotes, 0));
    setTotalDonate(
      dataDonate.reduce((sum, donate) => sum + donate.totalDonation, 0)
    );
    setTotalAmount(
      dataDonate.reduce((sum, donate) => sum + donate.totalAmount, 0)
    );
  }, [dataPost, dataDonate]);
  function formatCurrency(amount: number): string {
    return `${amount.toLocaleString("vi-VN")} đ`;
  }

  const statistics = [
    { label: "Total Post", value: totalPosts },
    { label: "Total Comment", value: totalComment },
    { label: "Total Vote", value: totalVote },
    { label: "Total Donate", value: totalDonate },
    {
      label: "Total Amount",
      value: formatCurrency(totalAmount)
    },
    { label: "Total Login", value: 0 },
    { label: "Total register", value: 0 }
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className="p-5 rounded-lg shadow-md bg-gray-50 overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {stat.label}
              </span>
              <img src="invoice-icon.png" alt="Icon" className="w-6 h-6" />
            </div>
            <div className="mt-2">
              <span className="block text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <SelectDate setDataPost={setDataPost} setDataDonate={setDataDonate} />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full mb-8">
          <LineChart data={dataPost} />
        </div>
        <div className="flex justify-between">
          <div className="w-3/4 pr-4">
            <DoughnutChart />
          </div>
          <div className="w-3/4 pl-4">
            <ColumnChart data={dataDonate} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
