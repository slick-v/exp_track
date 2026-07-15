import { useState } from "react";
import { useIncome, useCreateIncome, useUpdateIncome, useDeleteIncome, Income } from "./useIncome";
import IncomeForm, { IncomeFormValues } from "./IncomeForm";
import { formatCurrency } from "../../shared/formatCurrency";

export default function IncomePage() {
  const { data: income, isLoading } = useIncome();
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const deleteIncome = useDeleteIncome();

  const [formOpen, setFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  function handleSubmit(values: IncomeFormValues) {
    const input = {
      amount: values.amount,
      account_id: values.account_id,
      source: values.source || null,
      income_date: values.income_date,
      notes: values.notes || null,
    };
    if (editingIncome) {
      updateIncome.mutate({ id: editingIncome.id, input }, { onSuccess: () => { setFormOpen(false); setEditingIncome(null); } });
    } else {
      createIncome.mutate(input, { onSuccess: () => setFormOpen(false) });
    }
  }

  function handleDelete(id: number) {
    if (confirm("Delete this income entry?")) deleteIncome.mutate(id);
  }

  if (isLoading) return <p className="text-center py-10">Loading income…</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Income</h2>
        <button onClick={() => { setEditingIncome(null); setFormOpen(true); }} className="bg-slate-800 text-white rounded px-4 py-2 text-sm">
          + Add Income
        </button>
      </div>

      {formOpen && (
        <div className="bg-white rounded-lg shadow p-4">
          <IncomeForm
            initialValues={editingIncome ?? undefined}
            onSubmit={handleSubmit}
            isSubmitting={createIncome.isPending || updateIncome.isPending}
            onCancel={() => { setFormOpen(false); setEditingIncome(null); }}
          />
        </div>
      )}

      <div className="space-y-2">
        {income?.length === 0 && <p className="text-slate-500 text-center py-6">No income entries yet.</p>}
        {income?.map((inc) => (
          <div key={inc.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-800">{inc.source || "Income"}</p>
              <p className="text-sm text-slate-500">{inc.income_date}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-green-600">{formatCurrency(inc.amount)}</p>
              <button onClick={() => { setEditingIncome(inc); setFormOpen(true); }} className="text-sm text-slate-500 underline">Edit</button>
              <button onClick={() => handleDelete(inc.id)} className="text-sm text-red-500 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}