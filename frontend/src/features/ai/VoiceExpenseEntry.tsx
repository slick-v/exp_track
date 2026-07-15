import { useEffect, useState } from "react";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { apiPostFormData, apiPost, apiGet } from "../../lib/apiClient";
import { formatCurrency } from "../../shared/formatCurrency";

type PreviewItem = {
  amount: string;
  category_guess: string;
  matched_category_id: number | null;
  merchant: string | null;
};

type PreviewResponse = {
  transcript: string;
  items: PreviewItem[];
};

type Account = {
  id: number;
  name: string;
  account_type: string;
};

export default function VoiceExpenseEntry({ onSaved }: { onSaved: () => void }) {
  const { state, audioBlob, errorMessage, startRecording, stopRecording, reset } = useVoiceRecorder();
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // NEW: state for the account dropdown
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  // NEW: fetch the user's accounts once, when this component first loads
  useEffect(() => {
    apiGet<Account[]>("/api/v1/accounts").then((data) => {
      setAccounts(data);
      if (data.length > 0) setSelectedAccountId(data[0].id); // default to the first one
    });
  }, []);

  async function handleProcess() {
    if (!audioBlob) return;
    setIsProcessing(true);
    setProcessError(null);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const result = await apiPostFormData<PreviewResponse>("/api/v1/ai/voice-expense", formData);
      setPreview(result);
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : "Failed to process recording");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleConfirmSave() {
    if (!preview || !selectedAccountId) return; // guard: don't save with no account picked
    setIsSaving(true);
    setProcessError(null);

    try {
      let skippedCount = 0;
      for (const item of preview.items) {
        if (!item.matched_category_id) {
          skippedCount++;
          continue;
        }
        await apiPost("/api/v1/expenses", {
          amount: item.amount,
          category_id: item.matched_category_id,
          account_id: selectedAccountId, // CHANGED: was hardcoded to 1, now uses the dropdown's value
          merchant: item.merchant,
          expense_date: new Date().toISOString().split("T")[0],
        });
      }
      setPreview(null);
      reset();
      onSaved();
      if (skippedCount > 0) {
        setProcessError(`${skippedCount} item(s) skipped — no matching category found`);
      }
    } catch (err) {
      setProcessError("Failed to save one or more expenses");
    } finally {
      setIsSaving(false);
    }
  }

  if (preview) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4">
        <p className="text-sm text-slate-500 italic">"{preview.transcript}"</p>

        {/* NEW: the account dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Save to account</label>
          <select
            value={selectedAccountId ?? ""}
            onChange={(e) => setSelectedAccountId(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          {preview.items.map((item, i) => (
            <div key={i} className="border rounded p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.merchant ?? "—"}</p>
                <p className="text-sm text-slate-500">
                  {item.matched_category_id
                    ? item.category_guess
                    : `${item.category_guess} (no matching category — will be skipped)`}
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(item.amount)}</p>
            </div>
          ))}
        </div>

        {processError && <p className="text-red-500 text-sm">{processError}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleConfirmSave}
            disabled={isSaving || !selectedAccountId}
            className="flex-1 bg-slate-800 text-white rounded py-2 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Confirm & Save"}
          </button>
          <button
            onClick={() => { setPreview(null); reset(); }}
            className="flex-1 border rounded py-2"
          >
            Discard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center space-y-4">
      {state === "idle" && (
        <button onClick={startRecording} className="bg-red-500 text-white rounded-full px-6 py-3">
          🎤 Start Recording
        </button>
      )}

      {state === "recording" && (
        <button onClick={stopRecording} className="bg-slate-800 text-white rounded-full px-6 py-3 animate-pulse">
          ⏹ Stop Recording
        </button>
      )}

      {state === "stopped" && audioBlob && (
        <div className="space-y-3">
          <audio controls src={URL.createObjectURL(audioBlob)} className="mx-auto" />
          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="flex-1 bg-slate-800 text-white rounded py-2 disabled:opacity-50"
            >
              {isProcessing ? "Processing…" : "Process Recording"}
            </button>
            <button onClick={reset} className="flex-1 border rounded py-2">
              Re-record
            </button>
          </div>
        </div>
      )}

      {state === "error" && <p className="text-red-500 text-sm">{errorMessage}</p>}
      {processError && !preview && <p className="text-red-500 text-sm">{processError}</p>}
    </div>
  );
}