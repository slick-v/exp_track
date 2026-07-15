from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Category
from app.schemas import VoiceExpensePreview, VoiceExpensePreviewItem
from app.services.ai.speech_service import transcribe_audio
from app.services.ai.parsing_service import parse_expense_text

router = APIRouter()


@router.post("/ai/voice-expense", response_model=VoiceExpensePreview)
async def voice_expense_preview(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    audio_bytes = await audio.read()

    try:
        transcript = transcribe_audio(audio_bytes, audio.filename)
    except Exception:
        raise HTTPException(status_code=502, detail="Speech recognition failed — try again")

    if not transcript.strip():
        raise HTTPException(status_code=400, detail="No speech detected")

    try:
        parsed_items = parse_expense_text(transcript)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    user_categories = db.query(Category).filter(Category.user_id == current_user.id).all()
    category_lookup = {c.name.lower(): c.id for c in user_categories}

    preview_items = [
        VoiceExpensePreviewItem(
            amount=item.amount,
            category_guess=item.category_guess,
            matched_category_id=category_lookup.get(item.category_guess.lower()),
            merchant=item.merchant,
        )
        for item in parsed_items
    ]

    return VoiceExpensePreview(transcript=transcript, items=preview_items)