---
name: make-a-faceless-short
description: Make a faceless Short on the user's RemixViral account from a topic: agree the options, show balance and cost, call create_video only after an explicit yes. Spends credits.
license: MIT
compatibility: Needs the RemixViral MCP server (https://remixviral.ai/api/mcp) connected and signed in.
---

# Make a faceless Short with RemixViral

For when there is no source video. It does not cut a long video; see `review-my-clips` for that.

- `create_video` spends credits and a started render cannot be undone. Never call it without an explicit yes to the exact request.
- Quote the cost as the `create_video` tool description states it and the balance as `get_credit_balance` returns it. Never write a credit number from memory.
- Do not retry a timeout or error: check `list_videos` first (identical requests within 10 minutes return the existing video; at most 3 recent renders run at once).
- Remind the user to switch on the platform's AI-content label when they post. No promises about views or earnings.

## Steps

1. Agree the topic (up to 500 characters), and optionally the niche, duration (30, 60 or 90 seconds), art style and language with the user. Call `list_niches` for the valid niche and art style values.
2. Call `get_credit_balance`. Tell the user their balance and the cost exactly as the `create_video` tool description states it. Show the exact request you will send.
3. Ask: "Create this video? It spends credits and cannot be undone." Wait for a clear yes.
4. Call `create_video` once. Do not retry on a timeout or error: call `list_videos` first, because an identical request within 10 minutes returns the existing video. Use `allowDuplicate: true` only for a deliberate repeat the user asked for.
5. Poll `get_video` every 20 to 30 seconds until `COMPLETED` or `FAILED`. Give the `videoUrl` when it completes. On `FAILED`, relay the error and any credit numbers as returned.
