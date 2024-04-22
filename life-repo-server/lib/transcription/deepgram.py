import os
import logging

from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class DeepgramAdapter:
    def __init__(self):
        self.api_key = os.environ["DEEPGRAM_API_KEY"]

    def run_transcription(self, audio_path: str):
        dg = DeepgramClient(api_key=self.api_key)

        print(f"Running transcription on {audio_path}.")

        options: PrerecordedOptions = PrerecordedOptions(
            punctuate=True,
            smart_format=True,
            paragraphs=True,
            model="nova-2-ea",
        )

        with open(audio_path, "rb") as audio:
            print("sending request")
            source = {"buffer": audio, "mimetype": "audio/wav"}
            response = dg.listen.prerecorded.v("1").transcribe_file(
                source, options=options
            )

        print(f"Successfully transcribed {audio_path}.")

        return response

    def run_transcription_callback(
        self,
        audio_path: str,
        callback_url: str = os.environ.get("DEEPGRAM_CALLBACK_URL"),
    ):
        dg = DeepgramClient(api_key=self.api_key)

        options = PrerecordedOptions(
            punctuate=True,
            smart_format=True,
            paragraphs=True,
            callback=callback_url,
            model="nova-2-ea",
        )

        print(f"Running transcription on {audio_path} with callback.")

        with open(audio_path, "rb") as audio:
            source = {"buffer": audio, "mimetype": "audio/wav"}
            print("sending request")
            dg.asyncmanage.v("1")
            response = dg.listen.prerecorded.v("1").transcribe_file_callback(
                source, callback_url, options=options
            )

        print(f"Successfully transcribed {audio_path} with callback.")

        return response
