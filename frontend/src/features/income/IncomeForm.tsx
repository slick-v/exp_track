import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccounts } from "../accounts/useAccounts";
import type { Income } from "./useIncome";

const incomeFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  account_id: z.coerce.number().min(1, "Select an account"),
  source: z.string().optional(),
  income_date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

type Props = {
  initialValues?: Income;
  onSubmit: (values: IncomeFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
};

export default function IncomeForm({ initialValues, onSubmit, isSubmitting, onCancel }: Props) {
  const { data: accounts } = useAccounts();

  const { register, handleSubmit, formState: { errors } } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: initialValues
      ? {
          amount: parseFloat(initialValues.amount),
          account_id: initialValues.account_id,
          source: initialValues.source ?? "",
          income_date: initialValues.income_date,
          notes: initialValues.notes ?? "",
        }
      : { income_date: new Date().toISOString().split("T")[0] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input {...register("amount")} type="number" step="0.01" className="mt-1 w-full border rounded px-3 py-2" />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Account</label>
        <select {...register("account_id")} className="mt-1 w-full border rounded px-3 py-2">
          <option value="">Select…</option>
          {accounts?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {errors.account_id && <p className="text-red-500 text-sm">{errors.account_id.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input {...register("income_date")} type="date" className="mt-1 w-full border rounded px-3 py-2" />
        {errors.income_date && <p className="text-red-500 text-sm">{errors.income_date.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Source (optional)</label>
        <input {...register("source")} type="text" placeholder="Salary, Freelance…" className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-800 text-white rounded py-2 disabled:opacity-50">
          {isSubmitting ? "Saving…" : initialValues ? "Update Income" : "Add Income"}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 border rounded py-2">Cancel</button>
      </div>
    </form>
  );
}