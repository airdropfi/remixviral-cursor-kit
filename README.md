# RemixViral for Cursor

RemixViral is an AI clip maker built for AI agents to operate over MCP: you upload a long video you own, your agent reads the ranked, captioned 9:16 Shorts cut from it (with the reason each was picked) and can start faceless Shorts, and you tag the work, review and approve.

## At a glance

| | |
|---|---|
| Who it is for | AI agents and assistants that operate it, and the people who supervise them: podcast, webinar and event teams, agencies, in-house video teams, creators, small businesses |
| Does not do | No link import (upload your own video only), no timeline editor, no team seats, no free plan, no translation of other people's videos, no guarantee of views |
| Price | From $19/month (Starter, 1,200 credits); no free plan, monthly plans start with a $5 trial. A clip project costs 50 credits per source up to 60 minutes. Current prices: https://remixviral.ai/pricing.md |
| Human oversight | The owner approves access on an OAuth consent screen, sees and revokes keys under Dashboard, API keys, and can limit a key's scopes. Spending is capped by the prepaid credit balance |
| MCP server | `https://remixviral.ai/api/mcp` (Streamable HTTP), registry name `ai.remixviral/clipper` |
| Docs | https://remixviral.ai/en/mcp (agent quickstart, human oversight), https://remixviral.ai/mcp.md, https://remixviral.ai/llms.txt |
| Official listing | https://registry.modelcontextprotocol.io/v0/servers?search=ai.remixviral |

## Example prompts (you tag the work, you review the result)

- "Assign to RemixViral: go through my latest clip job and pick the three best clips. Show me the start and end times, the score and why each was picked, so I can approve them."
- "Use RemixViral to list my videos that are still rendering and the finished ones with links, so I can review what is ready."
- "Assign to RemixViral: a 30-second faceless Short about three tips for choosing a wedding photographer. Check my balance and tell me the cost first, and only create it after I say yes."

More on https://remixviral.ai/en/mcp#prompts.

Read the ranked, captioned Shorts [RemixViral](https://remixviral.ai) cut from your long videos, and make faceless Shorts from a topic, from Cursor. Nothing that costs credits runs until you have seen the cost and said yes.

[![Add RemixViral to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/link/mcp/install?name=remixviral&config=eyJ1cmwiOiJodHRwczovL3JlbWl4dmlyYWwuYWkvYXBpL21jcCJ9)

The button opens Cursor and asks you to confirm adding the `remixviral` MCP server. Prefer the app link? `cursor://anysphere.cursor-deeplink/mcp/install?name=remixviral&config=eyJ1cmwiOiJodHRwczovL3JlbWl4dmlyYWwuYWkvYXBpL21jcCJ9`

## What it contains

| Component | Name | What it does |
|---|---|---|
| MCP server | `remixviral` (`https://remixviral.ai/api/mcp`) | The RemixViral tools. |
| Rule | `rules/remixviral.mdc` | Clips are read-only, `create_video` spends credits and needs your yes, no performance claims. |
| Skill | `review-my-clips` | Ranked clips of a clip job with times, reasons and scores. Read-only. |
| Skill | `make-a-faceless-short` | Faceless Short from a topic: balance and cost first, create after your yes. |

## Tools

| Tool | What it does | Charges credits |
|---|---|---|
| `list_clip_jobs` | The clip jobs of your account, newest first. | No |
| `get_clip_job` | One job: status, then the ranked clips with start/end seconds, the reason each was picked, a score and a render status. Optional full transcript. | No |
| `create_video` | Starts a faceless Short from a topic (30, 60 or 90 s). Returns an id; the render runs asynchronously. | **Yes** |
| `get_video` | Status and, when done, the video link. | No |
| `list_videos` | Your videos, newest first, optional status filter. | No |
| `list_niches` | Valid niches, art styles, qualities and durations for `create_video`. | No |
| `get_credit_balance` | Credit balance, monthly allocation and plan. | No |

## Install in Cursor

You need a RemixViral account (https://remixviral.ai). Clip jobs are started in the app by uploading a long video you own at https://remixviral.ai/dashboard/clips; the tools here only read them.

1. Click the button above, or add this to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project):

   ```json
   {
     "mcpServers": {
       "remixviral": {
         "url": "https://remixviral.ai/api/mcp"
       }
     }
   }
   ```

2. Open Settings, then MCP. Next to `remixviral`, connect. A browser window opens: sign in to RemixViral and click Allow. Sign-in is OAuth with PKCE; RemixViral's server accepts Cursor's own callback (`cursor://anysphere.cursor-mcp/oauth/callback`), so there is no key to paste.
3. Optional, the rule: copy `rules/remixviral.mdc` to `.cursor/rules/remixviral.mdc` in your project. It is set to "Agent Decides".
4. Optional, the skills: copy the folders in `skills/` to `~/.cursor/skills/`.

Cursor asks you to approve MCP tool calls by default. Leave that on: `create_video` spends credits.

### API key instead of OAuth

Prefer a key? Create one at https://remixviral.ai/developers; the tools need the `video:read` scope (`create_video` also needs `video:create`, `get_credit_balance` needs `credits:read`), and a key without a needed scope is refused with a 403.

```json
{
  "mcpServers": {
    "remixviral": {
      "url": "https://remixviral.ai/api/mcp",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    }
  }
}
```

Keep the key out of any repository you commit.

## Use

Try the prompts in [examples/prompts.md](examples/prompts.md). A typical session: ask for the best clips of your latest upload and the agent reads the ranked list with times and reasons; ask for a faceless Short and the agent checks your balance, states the cost and waits for your yes before creating it.

## What it will and will not do

- Reading clip jobs, clips, transcripts, videos, niches and your balance is free and changes nothing.
- `create_video` is the one tool that spends credits. Those credits are real and a started render cannot be undone. The agent is told to check your balance, state the cost and wait for your explicit yes first.
- Starting a clip job is done in the RemixViral app by uploading a video you own; no tool takes a link.
- Nothing here posts, schedules, buys credits or changes your plan.
- Faceless videos use AI-generated images and voice. Switch on the platform's AI-content label when you post.
- No result is promised: nobody can tell you how a clip or video will perform.

## Layout

```text
.cursor-plugin/plugin.json   Cursor Plugin manifest
mcp.json                     MCP server for Cursor
.mcp.json                    the same server for other loaders
rules/remixviral.mdc         rule
skills/                      two skills (SKILL.md)
assets/logo.png              256x256 logo
examples/prompts.md          example prompts
scripts/validate.mjs         checks, no dependencies: node scripts/validate.mjs
```

## Data and privacy

The MCP server receives what the tools need: the ids, topics and settings you ask your agent to send, and the clip, video and credit data on your RemixViral account. This repository stores nothing and runs no code on your machine; it is a server address, Markdown instructions and a logo. See the [privacy policy](https://remixviral.ai/en/privacy) and [terms](https://remixviral.ai/en/terms). Keys and sign-in tokens are revocable in your RemixViral dashboard under API keys.

## Support

https://remixviral.ai/en/support or support@remixviral.ai. Documentation: https://remixviral.ai/en/developers.

## License

MIT for the files in this repository (see `LICENSE`). The RemixViral service is governed by its terms.
