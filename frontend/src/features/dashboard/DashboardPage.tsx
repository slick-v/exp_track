import { useDashboardSummary } from "./useDashboardSummary";
import { formatCurrency } from "../../shared/formatCurrency";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: "positive" | "negative" | "neutral" }) {
  const toneClass =
    tone === "positive" ? "text-green-600" : tone === "negative" ? "text-red-600" : "text-slate-800";

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${toneClass}`}>{formatCurrency(value)}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) return <p className="text-center py-10">Loading dashboard…</p>;
  if (isError || !data) return <p className="text-center py-10 text-red-500">Couldn't load dashboard.</p>;

  const chartData = [
    { name: "Income", value: parseFloat(data.month_income) },
    { name: "Expenses", value: parseFloat(data.month_expenses) },
  ];
  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard label="Current Balance" value={data.current_balance} tone="neutral" />
        <SummaryCard label="Total Income" value={data.total_income} tone="positive" />
        <SummaryCard label="Total Expenses" value={data.total_expenses} tone="negative" />
        <SummaryCard label="This Month — Income" value={data.month_income} tone="positive" />
        <SummaryCard label="This Month — Expenses" value={data.month_expenses} tone="negative" />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm text-slate-500 mb-2">This month: income vs expenses</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}