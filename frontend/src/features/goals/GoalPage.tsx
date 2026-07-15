import { useState } from "react";
import { useGoals, useContributeToGoal } from "./useGoals";
import { formatCurrency } from "../../shared/formatCurrency";

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const contribute = useContributeToGoal();
  const [amounts, setAmounts] = useState<Record<number, string>>({});

  if (isLoading) return <p className="text-center py-10">Loading goals…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Savings Goals</h2>

      {goals?.length === 0 && <p className="text-slate-500">No goals yet.</p>}

      {goals?.map((goal) => (
        <div key={goal.id} className="bg-white rounded-lg shadow p-4 space-y-2">
          <div className="flex justify-between items-baseline">
            <p className="font-medium text-slate-800">{goal.name}</p>
            <p className="text-sm text-slate-500">
              {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
            </p>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-blue-500"
              style={{ width: `${goal.percent_complete}%` }}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="number"
              placeholder="Add amount"
              value={amounts[goal.id] ?? ""}
              onChange={(e) => setAmounts({ ...amounts, [goal.id]: e.target.value })}
              className="border rounded px-2 py-1 text-sm w-32"
            />
            <button
              onClick={() => {
                const value = parseFloat(amounts[goal.id] ?? "0");
                if (value > 0) {
                  contribute.mutate({ goalId: goal.id, amount: value });
                  setAmounts({ ...amounts, [goal.id]: "" });
                }
              }}
              className="text-sm bg-slate-800 text-white rounded px-3 py-1"
            >
              Contribute
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}