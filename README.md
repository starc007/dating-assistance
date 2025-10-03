# DatingAI - Your Dating Response Assistant

DatingAI is an AI-powered assistant that helps men craft engaging responses to women's dating app prompts and messages. Simply share her prompt, message, or conversation thread, and get personalized response suggestions.

## Features

- **Prompt Analysis**: Automatically analyze women's dating app prompts and suggest multiple response options
- **Message Response**: Craft engaging replies to messages that keep conversations flowing
- **Conversation Flow**: Get suggestions for continuing conversations and next steps
- **Multiple Tones**: Receive responses in different tones (playful, genuine, witty, confident)
- **Platform Awareness**: Understands nuances of Hinge, Bumble, Tinder, and other dating apps

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/NodeOps-app/dating-ai.git
cd dating-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google API key:

```
GOOGLE_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Share her prompt**: Copy and paste her dating app prompt (like "Two truths and a lie" or "The way to my heart is...")
2. **Share her message**: Show me a message she sent you and I'll craft a great reply
3. **Share conversation**: Paste your chat thread and I'll suggest next steps
4. **Get multiple options**: I'll provide 2-3 response options with different tones

## Technical Stack

- **Frontend**: Next.js 15 with App Router
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Animation**: Framer Motion
