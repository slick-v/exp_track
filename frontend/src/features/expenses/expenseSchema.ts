import { z } from "zod";

export const expenseFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category_id: z.coerce.number().min(1, "Select a category"),
  account_id: z.coerce.number().min(1, "Select an account"),
  merchant: z.string().optional(),
  expense_date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;