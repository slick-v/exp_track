import { useState } from "react";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { apiPostFormData, apiPost } from "../../lib/apiClient";
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

export default function VoiceExpenseEntry({ onSaved }: { onSaved: () => void }) {
  const { state, audioBlob, errorMessage, startRecording, stopRecording, reset } = useVoiceRecorder();
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!preview) return;
    setIsSaving(true);

    try {
      for (const item of preview.items) {
        if (!item.matched_category_id) continue; // skip items with no matched category — needs manual entry
        await apiPost("/api/v1/expenses", {
          amount: item.amount,
          category_id: item.matched_category_id,
          account_id: 1, // TODO: let user pick account instead of hardcoding
          merchant: item.merchant,
          expense_date: new Date().toISOString().split("T")[0],
        });
      }
      setPreview(null);
      reset();
      onSaved();
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
            disabled={isSaving}
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