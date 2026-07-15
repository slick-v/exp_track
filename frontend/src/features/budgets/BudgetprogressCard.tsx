import { formatCurrency } from "../../shared/formatCurrency";

type Props = {
  label: string;
  limit: string;
  spent: string;
  remaining: string;
  percentUsed: number;
  isOverBudget: boolean;
};

export default function BudgetProgressCard({
  label,
  limit,
  spent,
  remaining,
  percentUsed,
  isOverBudget,
}: Props) {
  const barWidth = Math.min(percentUsed, 100);
  const barColor = isOverBudget ? "bg-red-500" : percentUsed > 80 ? "bg-amber-500" : "bg-green-500";

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      <div className="flex justify-between items-baseline">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-500">
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </p>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {isOverBudget ? (
        <p className="text-sm text-red-600 font-medium">
          ⚠ Over budget by {formatCurrency(Math.abs(parseFloat(remaining)).toString())}
        </p>
      ) : (
        <p className="text-sm text-slate-500">{formatCurrency(remaining)} remaining</p>
      )}
    </div>
  );
}