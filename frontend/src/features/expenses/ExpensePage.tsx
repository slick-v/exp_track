import { useState } from "react";
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense, Expense } from "./useExpenses";
import { useCategories } from "../categories/useCategories";
import ExpenseForm from "./ExpenseForm";
import { formatCurrency } from "../../shared/formatCurrency";
import { ExpenseFormValues } from "./expenseSchema";

export default function ExpensesPage() {
  const { data: expenses, isLoading } = useExpenses();
  const { data: categories } = useCategories();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  function categoryName(id: number) {
    return categories?.find((c) => c.id === id)?.name ?? "—";
  }

  function handleSubmit(values: ExpenseFormValues) {
    const input = {
      amount: values.amount,
      category_id: values.category_id,
      account_id: values.account_id,
      merchant: values.merchant || null,
      expense_date: values.expense_date,
      notes: values.notes || null,
      tags: values.tags || null,
    };

    if (editingExpense) {
      updateExpense.mutate(
        { id: editingExpense.id, input },
        { onSuccess: () => { setFormOpen(false); setEditingExpense(null); } }
      );
    } else {
      createExpense.mutate(input, { onSuccess: () => setFormOpen(false) });
    }
  }

  function handleDelete(id: number) {
    if (confirm("Delete this expense? This can't be undone from the UI.")) {
      deleteExpense.mutate(id);
    }
  }

  if (isLoading) return <p className="text-center py-10">Loading expenses…</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Expenses</h2>
        <button
          onClick={() => { setEditingExpense(null); setFormOpen(true); }}
          className="bg-slate-800 text-white rounded px-4 py-2 text-sm"
        >
          + Add Expense
        </button>
      </div>

      {formOpen && (
        <div className="bg-white rounded-lg shadow p-4">
          <ExpenseForm
            initialValues={editingExpense ?? undefined}
            onSubmit={handleSubmit}
            isSubmitting={createExpense.isPending || updateExpense.isPending}
            onCancel={() => { setFormOpen(false); setEditingExpense(null); }}
          />
        </div>
      )}

      <div className="space-y-2">
        {expenses?.length === 0 && <p className="text-slate-500 text-center py-6">No expenses yet.</p>}

        {expenses?.map((exp) => (
          <div key={exp.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-800">{exp.merchant || categoryName(exp.category_id)}</p>
              <p className="text-sm text-slate-500">{categoryName(exp.category_id)} · {exp.expense_date}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-red-600">{formatCurrency(exp.amount)}</p>
              <button
                onClick={() => { setEditingExpense(exp); setFormOpen(true); }}
                className="text-sm text-slate-500 underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="text-sm text-red-500 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}