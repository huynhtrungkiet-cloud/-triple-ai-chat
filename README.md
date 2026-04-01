# Triple AI Chat 🤖

Multi-AI Chat Application - Compare Claude, GPT-4, and Gemini responses in real-time.

## Features ✨

- 💬 **Multi-AI Chat**: Chat with Claude, GPT-4, and Gemini
- 🔀 **Compare Mode**: Ask same question, see all AI responses side-by-side
- 🎯 **Single Mode**: Choose one AI to use
- 🔗 **Chain Mode**: Pass output from one AI to the next
- 📋 **Project Management**: Organize conversations into projects
- 💾 **Auto-save**: All conversations saved locally
- 🎨 **Modern UI**: Beautiful dark theme with animations
- 📱 **Responsive**: Works on desktop and mobile

## Setup 🚀

### 1. Clone & Install

```bash
git clone https://github.com/huynhtrungkiet/triple-ai-chat.git
cd triple-ai-chat
npm install
```

### 2. Get API Keys

**Claude API:**
- Go to https://console.anthropic.com/
- Create API key
- Copy key starting with `sk-ant-`

**OpenAI API:**
- Go to https://platform.openai.com/api/keys
- Create API key
- Copy key starting with `sk-proj-`

**Google Gemini API:**
- Go to https://console.cloud.google.com/
- Enable Generative Language API
- Create API key
- Copy key starting with `AIzaSy`

### 3. Setup Environment

Create `.env.local` file:

```bash
NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
```

### 4. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel 🌐

### Option 1: Using Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts
# Add environment variables in Vercel dashboard
```

### Option 2: GitHub + Vercel

1. Push code to GitHub
2. Go to https://vercel.com/
3. Click "New Project"
4. Select your GitHub repo
5. Add environment variables
6. Deploy!

## Usage 📖

### Compare Mode
- Select all 3 AI providers
- Ask a question
- See all responses side-by-side
- Great for comparing AI strengths

### Single Mode
- Choose 1 AI provider
- Chat with only that AI
- Useful for focusing on one provider

### Chain Mode
- Select multiple AIs
- First AI answers → output goes to 2nd AI
- 2nd AI's output → goes to 3rd AI
- Great for refining responses

## Project Structure 📁

```
src/
├── components/        # React components
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   ├── ControlPanel.tsx
│   └── Sidebar.tsx
├── lib/
│   └── ai-service.ts # API integration
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── store/
│   └── app-store.ts  # State management (Zustand)
└── styles/
    └── globals.css   # Tailwind styles
```

## Tech Stack 🛠️

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Anthropic SDK** - Claude API
- **OpenAI SDK** - GPT-4 API
- **Google GenAI** - Gemini API

## Environment Variables 🔐

```
NEXT_PUBLIC_CLAUDE_API_KEY    - Claude API key
NEXT_PUBLIC_OPENAI_API_KEY    - OpenAI API key
NEXT_PUBLIC_GEMINI_API_KEY    - Google Gemini API key
NEXT_PUBLIC_APP_NAME          - App name (default: "Triple AI Chat")
NEXT_PUBLIC_API_TIMEOUT       - API timeout in ms (default: 30000)
```

## Tips & Tricks 💡

1. **Keep API keys safe** - Never commit .env.local to GitHub
2. **Monitor API usage** - Check your API provider dashboards for usage
3. **Save interesting conversations** - Export chat history if needed
4. **Use Chain mode for refinement** - Great for generating → improving responses
5. **Compare for quality** - Use Compare mode to find best AI for your use case

## Troubleshooting 🔧

**"API key not configured"**
- Check .env.local file exists
- Verify keys are correctly formatted
- Restart dev server

**"API rate limit exceeded"**
- Wait a moment and try again
- Check your API provider's quota
- Consider upgrading plan

**"No response from AI"**
- Check internet connection
- Verify API key is valid
- Check API provider status

## Contributing 🤝

Feel free to fork and submit PRs!

## License 📄

MIT License - Use freely!

## Support 💬

Having issues? 
- Check troubleshooting section
- Review API provider documentation
- Open GitHub issue

---

Made with ❤️ using Claude + GPT-4 + Gemini
