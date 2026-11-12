---
name: review-my-clips
description: Read the ranked, captioned Shorts RemixViral cut from a long video the user owns: list clip jobs, show the best clips with times, reasons and scores. Read-only and free. Use when the user asks about their RemixViral clips or what to post from an upload.
license: MIT
compatibility: Needs the RemixViral MCP server (https://remixviral.ai/api/mcp) connected and signed in.
---

# Review my RemixViral clips

RemixViral (https://remixviral.ai) is an AI clipper for long videos the user owns (podcasts, streams, webinars, talks): the user uploads the video in the RemixViral app, RemixViral transcribes it, ranks the strongest moments and cuts them into captioned vertical (9:16) Shorts. It can also make a faceless Short from a topic when there is no source video.

- Read-only: `list_clip_jobs` and `get_clip_job` never charge credits.
- Clip jobs start with an upload of a video the user owns at https://remixviral.ai/dashboard/clips. No link import: never offer to download or clip a video from a URL.
- Quote titles, reasons, scores and transcripts exactly as returned. No performance promises.

## Steps

1. Call `list_clip_jobs`. If there are none, say so and point the user to https://remixviral.ai/dashboard/clips to upload a video they own. Do not offer to import a link.
2. Pick the job the user means (default: the newest). Call `get_clip_job` with its id. Leave `includeTranscript` off unless the user needs the transcript (it is large).
3. If the job is still processing, report its status and stage and stop; do not loop.
4. When ready, show the clips best first as a table: rank, title, start and end time (`startSec` to `endSec`, as mm:ss), score, render status, and the reason it was picked. Quote titles and reasons exactly as returned.
5. Offer next steps that need no tool: titles or captions for posting, a posting order. Do not promise how any clip will perform.
