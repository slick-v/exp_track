import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseFormSchema, ExpenseFormValues } from "./expenseSchema";
import { useCategories } from "../categories/useCategories";
import { useAccounts } from "../accounts/useAccounts";
import { Expense } from "./useExpenses";

type Props = {
  initialValues?: Expense;
  onSubmit: (values: ExpenseFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
};

export default function ExpenseForm({ initialValues, onSubmit, isSubmitting, onCancel }: Props) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialValues
      ? {
          amount: parseFloat(initialValues.amount),
          category_id: initialValues.category_id,
          account_id: initialValues.account_id,
          merchant: initialValues.merchant ?? "",
          expense_date: initialValues.expense_date,
          notes: initialValues.notes ?? "",
          tags: initialValues.tags ?? "",
        }
      : { expense_date: new Date().toISOString().split("T")[0] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input {...register("amount")} type="number" step="0.01" className="mt-1 w-full border rounded px-3 py-2" />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select {...register("category_id")} className="mt-1 w-full border rounded px-3 py-2">
          <option value="">Select…</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Account</label>
        <select {...register("account_id")} className="mt-1 w-full border rounded px-3 py-2">
          <option value="">Select…</option>
          {accounts?.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {errors.account_id && <p className="text-red-500 text-sm">{errors.account_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input {...register("expense_date")} type="date" className="mt-1 w-full border rounded px-3 py-2" />
        {errors.expense_date && <p className="text-red-500 text-sm">{errors.expense_date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Merchant (optional)</label>
        <input {...register("merchant")} type="text" className="mt-1 w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Notes (optional)</label>
        <textarea {...register("notes")} className="mt-1 w-full border rounded px-3 py-2" rows={2} />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-800 text-white rounded py-2 disabled:opacity-50">
          {isSubmitting ? "Saving…" : initialValues ? "Update Expense" : "Add Expense"}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 border rounded py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}