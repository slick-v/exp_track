import { useBudgetStatus } from "./useBudgetStatus";
import { useCategories } from "../categories/useCategories";
import BudgetProgressCard from "./BudgetProgressCard";

function getCurrentMonthISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

export default function BudgetsPage() {
  const month = getCurrentMonthISO();
  const { data: budgetStatuses, isLoading, isError } = useBudgetStatus(month);
  const { data: categories } = useCategories();

  if (isLoading) return <p className="text-center py-10">Loading budgets…</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Couldn't load budgets.</p>;

  if (!budgetStatuses || budgetStatuses.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-slate-500 text-center">
          No budgets set for this month yet.
        </p>
      </div>
    );
  }

  const anyOverBudget = budgetStatuses.some((b) => b.is_over_budget);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Budgets — This Month</h2>

      {anyOverBudget && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          You're over budget in one or more categories this month.
        </div>
      )}

      {budgetStatuses.map((status) => {
        const label = status.budget.category_id
          ? categories?.find((c) => c.id === status.budget.category_id)?.name ?? "Category"
          : "Overall Budget";

        return (
          <BudgetProgressCard
            key={status.budget.id}
            label={label}
            limit={status.budget.limit_amount}
            spent={status.spent}
            remaining={status.remaining}
            percentUsed={status.percent_used}
            isOverBudget={status.is_over_budget}
          />
        );
      })}
    </div>
  );
}