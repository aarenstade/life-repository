import os

from fastapi import APIRouter, HTTPException
from fastapi import UploadFile, File, HTTPException

from lib.transcription.deepgram import DeepgramAdapter
from config import TMP_DIR


router = APIRouter()


@router.post("/audio")
async def transcribe_audio_file(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(TMP_DIR, file.filename)

        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())

        dg = DeepgramAdapter()
        response = dg.run_transcription(file_location)
        text = response["results"]["channels"][0]["alternatives"][0]["transcript"]
        os.remove(file_location)

        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to upload file: {e}")
