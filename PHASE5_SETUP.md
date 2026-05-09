# Phase 5: AI Multi-Agent Chat System - Setup Guide

## What's New
- 10 specialized AI agents with chart-aware personalities
- Real-time chat interface with agent selection
- Claude API integration via Vercel AI SDK
- Conversation memory and context management

## Environment Setup

### 1. Add Anthropic API Key
Add to your `.env.local`:
```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

Get your key from: https://console.anthropic.com/

### 2. Verify Supabase Setup
Make sure these tables exist:
```sql
-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  agent_id TEXT NOT NULL,
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Test the Chat Page
- Navigate to `/dashboard/chat`
- Select an agent from the 10 available
- Start a conversation about your chart

## The 10 Agents

| Agent | Focus | Use When |
|-------|-------|----------|
| 📖 Lal Kitab | Remedies & gems | Need specific upay |
| 💼 Career | Job & business | Career decisions |
| 💑 Marriage | Relationships | Marriage/dating questions |
| 🔄 Karmic | Soul lessons | Understanding destiny |
| 💰 Wealth | Money & prosperity | Financial decisions |
| 🧠 Psychology | Personality & patterns | Self-understanding |
| 🏥 Health | Medical astrology | Health concerns |
| 💊 Remedy | Customized practices | Want personalized upay |
| 🕉️ Spiritual | Meditation & purpose | Spiritual path |
| 🪐 Transit | Current timing | What's happening now |

## How It Works

1. **Agent Selection**: Click any agent button to switch
2. **Chart Context**: Your birth chart is automatically passed to the agent
3. **Smart Prompts**: Each agent has specialized system prompts for accuracy
4. **Streaming Response**: Real-time streaming for fast responses
5. **Message Memory**: Conversation history within each agent

## Example Conversations

### With Career Agent:
```
You: When should I change my job?
Career Agent: Based on your birth chart [analysis], 
your Jupiter dasha is favorable for career changes. 
Best windows: March-May 2026 and October-November 2026.
```

### With Remedy Agent:
```
You: Give me a 40-day remedy for my weak Saturn
Remedy Agent: Your Saturn in [position] needs:
- Gem: Blue Sapphire 2-3 carats
- Mantra: Om Pram Preem Praum... 19000 times over 40 days
- Donation: Mustard oil & iron on Saturdays
- Practice: Feed crows daily...
```

### With Spiritual Agent:
```
You: What meditation should I do?
Spiritual Agent: Your 12th house [analysis] suggests...
Try: Primordial sound meditation using mantra...
Duration: 20 minutes daily at sunrise
Expected: First benefits in 40 days...
```

## API Structure

### POST /api/chat
Sends a message to an agent and gets streaming response

**Request:**
```json
{
  "agentId": "career",
  "messages": [
    { "role": "user", "content": "When will I get promoted?" }
  ],
  "chartData": { /* full ChartData object */ }
}
```

**Response:** Server-sent event stream with agent's response

## Performance Notes

- Model: Claude 3.5 Sonnet (latest, most capable)
- Temperature: 0.7 (balanced between accuracy and creativity)
- Max tokens: 1024 per response
- Streaming: Real-time response as it's generated

## Costs

- Per chat: ~0.1-0.5 cents (streaming Claude 3.5 Sonnet)
- Per month (assuming 100 chats/day): ~$150-750
- Consider rate limiting for production

## Next Steps

**Phase 6**: Add subscription tiers to monetize agents
- Free: 5 agent chats/month
- Premium: Unlimited agent access
- Elite: Personal astrologer + WhatsApp agents

Would you like me to proceed with Phase 5 testing or move to Phase 6?
