
import os
import shutil
import uuid
import subprocess
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from moviepy.editor import (
    VideoFileClip,
    concatenate_videoclips,
    CompositeVideoClip,
    ColorClip,
)
from google import genai
import json
import assemblyai as aai

# Initialize APIs
aai.settings.api_key = "8e164c92be0c44d48448156a8114e797"
client = genai.Client(api_key="AIzaSyBLeukJfhBs-Y1f40AwGudbUnYOfy_3uEY")
transcriber = aai.Transcriber()

# FastAPI app setup
app = FastAPI(title="CreAItive Video Clip Extractor API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)
os.makedirs("temp", exist_ok=True)

# Serve static files
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_status(self, client_id: str, message: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(json.dumps({"status": message}))


manager = ConnectionManager()

# Models
class GenerateRequest(BaseModel):
    video_id: str
    query: str
    aspect_ratio: str
    burn_captions: bool


# Helper functions
async def extract_audio(video_path, audio_path, client_id):
    """Extract audio from a video file"""
    await manager.send_status(client_id, "Extracting audio from video...")
    command = f"ffmpeg -i {video_path} -ar 16000 -ac 1 -b:a 64k -f mp3 {audio_path}"
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    await process.communicate()
    return audio_path


async def transcribe_with_gemini(audio_path, client_id):
    """Transcribe audio using Gemini API"""
    await manager.send_status(client_id, "Uploading audio file for transcription...")

    # Upload the audio file
    audio_file = client.files.upload(file=audio_path)

    await manager.send_status(client_id, "Transcribing audio with Gemini...")
    # Request transcription
    prompt = "Generate a detailed transcript of this audio with timestamps. Include the start and end time for each segment in seconds."

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=[prompt, audio_file]
    )

    # Process the response to extract segments with timestamps
    transcript_text = response.text
    await manager.send_status(client_id, "Transcription completed. Processing segments...")

    # Now let's get the segments with timestamps
    await manager.send_status(client_id, "Structuring transcription data...")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            """Based on the following transcript, create a structured JSON output with segments.
            Each segment should have a start time, end time, and text. Extract the timestamps
            from the transcript and convert them to seconds.
            Format the output as:
            {
                "segments": [
                    {"start": start_time_in_seconds, "end": end_time_in_seconds, "text": "text content"},
                    ...
                ]
            }

            Transcript:
            """
            + transcript_text
        ],
    )

    try:
        # Try to extract JSON from the response
        segments_text = response.text
        # Find JSON content (look for content between curly braces)
        json_content = segments_text[
            segments_text.find("{") : segments_text.rfind("}") + 1
        ]
        segments_data = json.loads(json_content)
        return segments_data["segments"]
    except (json.JSONDecodeError, KeyError) as e:
        await manager.send_status(client_id, f"Error processing transcript segments: {str(e)}")
        return []


async def get_relevant_segments(segments, user_query, client_id):
    """Use Gemini to identify relevant segments based on user query"""
    await manager.send_status(client_id, f"Finding relevant segments for query: '{user_query}'")
    segments_str = json.dumps(segments, indent=2)

    prompt = f"""You are an expert video editor. Given the following transcript segments from a video,
    identify the most relevant parts based on this user query: "{user_query}"

    Guidelines:
    1. Choose segments that are directly relevant to the query
    2. Include complete thoughts and context (adjacent segments if needed)
    3. The segments should not cut off in the middle of ideas
    4. Choose multiple interesting highlights if available
    5. Return the exact start and end times from the original segments

    Output only valid JSON in this exact format:
    {{
        "conversations": [
            {{"start": start_time_in_seconds, "end": end_time_in_seconds}},
            ...
        ]
    }}

    Transcript segments:
    {segments_str}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )

    try:
        # Extract the JSON part from the response
        response_text = response.text
        # Find JSON content (look for content between curly braces)
        json_start = response_text.find("{")
        json_end = response_text.rfind("}") + 1

        if json_start >= 0 and json_end > json_start:
            json_content = response_text[json_start:json_end]
            conversations = json.loads(json_content)
            return conversations.get("conversations", [])
        else:
            await manager.send_status(client_id, "No valid JSON found in the response")
            return []
    except (json.JSONDecodeError, AttributeError) as e:
        await manager.send_status(client_id, f"Error processing relevant segments: {str(e)}")
        return []


def apply_aspect_ratio(clip, aspect_ratio):
    """Apply the selected aspect ratio to the clip"""
    original_width = clip.w
    original_height = clip.h

    if aspect_ratio == "youtube":
        # 16:9 aspect ratio
        target_ratio = 16 / 9
    elif aspect_ratio == "square":
        # 1:1 aspect ratio
        target_ratio = 1
    elif aspect_ratio == "reel":
        # 9:16 aspect ratio for reels/shorts
        target_ratio = 9 / 16
    else:
        # Default to original ratio
        return clip

    current_ratio = original_width / original_height

    if abs(current_ratio - target_ratio) < 0.01:
        # Already in the correct ratio (with a small tolerance)
        return clip

    # Determine new dimensions while maintaining original content
    if target_ratio > current_ratio:
        # Need to add padding on top and bottom
        new_width = original_width
        new_height = int(original_width / target_ratio)
        y_center = (new_height - original_height) // 2
        x_center = 0
    else:
        # Need to add padding on sides
        new_height = original_height
        new_width = int(original_height * target_ratio)
        x_center = (new_width - original_width) // 2
        y_center = 0

    # Create a black background
    bg = ColorClip(size=(new_width, new_height), color=(0, 0, 0))
    bg = bg.set_duration(clip.duration)

    # Position the original clip on the background
    positioned_clip = clip.set_position((x_center, y_center))

    # Composite the clips
    final_clip = CompositeVideoClip([bg, positioned_clip])
    return final_clip


async def edit_video(
    original_video_path,
    segments,
    output_video_path,
    aspect_ratio="youtube",
    fade_duration=0.5,
    client_id=None,
):
    """Edit the video based on the selected segments and apply the chosen aspect ratio"""
    await manager.send_status(client_id, "Editing video with selected segments...")

    try:
        video = VideoFileClip(original_video_path)
        clips = []

        for seg in segments:
            start = float(seg["start"])
            end = float(seg["end"])

            # Ensure end time doesn't exceed video duration
            if end > video.duration:
                end = video.duration

            if start < end and start >= 0:
                clip = (
                    video.subclip(start, end)
                    .fadein(fade_duration)
                    .fadeout(fade_duration)
                )
                clips.append(clip)

        if clips:
            await manager.send_status(client_id, "Creating video with selected clips...")
            concat_clip = concatenate_videoclips(clips, method="compose")

            # Apply the selected aspect ratio
            await manager.send_status(client_id, f"Applying {aspect_ratio} aspect ratio...")
            final_clip = apply_aspect_ratio(concat_clip, aspect_ratio)

            # Export intermediate video without captions
            await manager.send_status(client_id, "Rendering intermediate video...")
            temp_output_path = output_video_path.replace(".mp4", "_temp.mp4")

            # Use a callback to report progress
            def write_callback(t):
                asyncio.run_coroutine_threadsafe(
                    manager.send_status(client_id, f"Rendering video: {int(t/final_clip.duration*100)}%"),
                    asyncio.get_event_loop()
                )

            # This is a blocking operation, can't be easily made async
            final_clip.write_videofile(
                temp_output_path,
                codec="libx264",
                audio_codec="aac",
                verbose=False,
                logger=None,
                progress_bar=False
            )

            return temp_output_path
        else:
            await manager.send_status(client_id, "No valid segments to include in the edited video.")
            return None
    except Exception as e:
        await manager.send_status(client_id, f"Error during video editing: {str(e)}")
        return None
    finally:
        # Close the video files
        if "video" in locals():
            video.close()
        if "final_clip" in locals():
            final_clip.close()
        if "concat_clip" in locals() and "concat_clip" != "final_clip":
            concat_clip.close()


async def add_captions(input_video_path, output_video_path, burn_captions=True, client_id=None):
    """Transcribe the video and generate captions, optionally burning them into the video"""
    try:
        await manager.send_status(client_id, "Generating captions with AssemblyAI...")
        transcript = transcriber.transcribe(input_video_path)

        # Export the SRT file
        srt_path = input_video_path.replace(".mp4", ".srt")
        with open(srt_path, "w", encoding="utf-8") as srt_file:
            srt_file.write(transcript.export_subtitles_srt())

        await manager.send_status(client_id, "SRT file generated")

        if burn_captions:
            await manager.send_status(client_id, "Burning captions into the video...")
            # Use ffmpeg to burn the subtitles directly into the video
            command = f'ffmpeg -i "{input_video_path}" -vf "subtitles={srt_path}:force_style=\'FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BackColour=&H80000000,BorderStyle=4\'" -c:a copy "{output_video_path}"'
            process = await asyncio.create_subprocess_shell(
                command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()
            await manager.send_status(client_id, "Video with burned captions completed")
        else:
            # If not burning captions, simply copy the file
            shutil.copy(input_video_path, output_video_path)
            await manager.send_status(client_id, "Video processing completed (without burned captions)")

        return srt_path
    except Exception as e:
        await manager.send_status(client_id, f"Error adding captions: {str(e)}")
        return None


# Routes
@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file and return a unique ID"""
    try:
        video_id = str(uuid.uuid4())
        file_location = f"uploads/{video_id}.mp4"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"video_id": video_id, "filename": file.filename}
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error uploading file: {str(e)}"})


@app.post("/generate")
async def generate_video(request: GenerateRequest):
    """Generate a clip-extracted video with optional captions"""
    try:
        # Set up file paths
        video_id = request.video_id
        input_video = f"uploads/{video_id}.mp4"
        temp_audio = f"temp/{video_id}.mp3"
        intermediate_video = f"temp/{video_id}_intermediate.mp4"
        output_video = f"outputs/{video_id}_output.mp4"

        # Return information needed for WebSocket connection
        return {
            "video_id": video_id,
            "message": "Video processing started. Connect to WebSocket for status updates.",
            "output_path": f"/outputs/{video_id}_output.mp4"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error starting processing: {str(e)}"})


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        # Get generation parameters from the first message
        data = await websocket.receive_text()
        params = json.loads(data)

        # Set up file paths
        video_id = params["video_id"]
        input_video = f"uploads/{video_id}.mp4"
        temp_audio = f"temp/{video_id}.mp3"
        intermediate_video = f"temp/{video_id}_intermediate.mp4"
        output_video = f"outputs/{video_id}_output.mp4"

        # Check if input video exists
        if not os.path.exists(input_video):
            await manager.send_status(client_id, f"Error: Video not found")
            return

        try:
            # Process the video
            await extract_audio(input_video, temp_audio, client_id)
            segments = await transcribe_with_gemini(temp_audio, client_id)

            if not segments:
                await manager.send_status(client_id, "Transcription failed or returned no segments.")
                return

            await manager.send_status(client_id, f"Transcription complete. Found {len(segments)} segments.")

            relevant_segments = await get_relevant_segments(segments, params["query"], client_id)

            if not relevant_segments:
                await manager.send_status(client_id, "No relevant segments found.")
                return

            await manager.send_status(client_id, f"Found {len(relevant_segments)} relevant segments.")

            temp_video_path = await edit_video(
                input_video,
                relevant_segments,
                intermediate_video,
                params["aspect_ratio"],
                client_id=client_id
            )

            if not temp_video_path:
                await manager.send_status(client_id, "Video editing failed.")
                return

            srt_path = await add_captions(
                temp_video_path,
                output_video,
                params["burn_captions"],
                client_id=client_id
            )

            if srt_path:
                await manager.send_status(client_id, "Processing completed successfully")
                await manager.send_status(client_id, json.dumps({
                    "status": "completed",
                    "output_video": f"/outputs/{video_id}_output.mp4",
                    "srt_file": f"/outputs/{os.path.basename(srt_path)}"
                }))
            else:
                await manager.send_status(client_id, "Caption generation failed")

        except Exception as e:
            await manager.send_status(client_id, f"Processing error: {str(e)}")

        finally:
            # Clean up temporary files
            for file in [temp_audio, intermediate_video]:
                if os.path.exists(file):
                    os.remove(file)

    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        await manager.send_status(client_id, f"Error: {str(e)}")
        manager.disconnect(client_id)


@app.get("/download/{video_id}")
async def download_video(video_id: str):
    """Download the processed video"""
    file_path = f"outputs/{video_id}_output.mp4"
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename=f"processed_video_{video_id}.mp4",
            media_type="video/mp4"
        )
    return JSONResponse(status_code=404, content={"message": "Video not found"})


@app.get("/download/srt/{video_id}")
async def download_srt(video_id: str):
    """Download the SRT file"""
    file_path = f"outputs/{video_id}_temp.srt"
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename=f"subtitles_{video_id}.srt",
            media_type="application/x-subrip"
        )
    return JSONResponse(status_code=404, content={"message": "SRT file not found"})


# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
