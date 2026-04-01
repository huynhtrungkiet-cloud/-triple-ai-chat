// API request types
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  text: string;
  provider: 'claude' | 'openai' | 'gemini';
  tokensUsed?: number;
  timestamp: number;
}

// Claude API
export async function callClaude(messages: AIMessage[]): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
  if (!apiKey) throw new Error('Claude API key not configured');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  } catch (error) {
    console.error('Claude error:', error);
    throw error;
  }
}

// OpenAI API
export async function callOpenAI(messages: AIMessage[]): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.' },
          ...messages,
        ],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI error:', error);
    throw error;
  }
}

// Gemini API
export async function callGemini(messages: AIMessage[]): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.9,
            topP: 1,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_UNSPECIFIED',
              threshold: 'BLOCK_NONE',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || '';
  } catch (error) {
    console.error('Gemini error:', error);
    throw error;
  }
}

// Multi-AI Call
export async function callMultipleAI(messages: AIMessage[], providers: string[]): Promise<{
  [key: string]: AIResponse;
}> {
  const results: { [key: string]: AIResponse } = {};

  const promises: Promise<void>[] = [];

  if (providers.includes('claude')) {
    promises.push(
      (async () => {
        try {
          const text = await callClaude(messages);
          results.claude = {
            text,
            provider: 'claude',
            timestamp: Date.now(),
          };
        } catch (error) {
          results.claude = {
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            provider: 'claude',
            timestamp: Date.now(),
          };
        }
      })()
    );
  }

  if (providers.includes('openai')) {
    promises.push(
      (async () => {
        try {
          const text = await callOpenAI(messages);
          results.openai = {
            text,
            provider: 'openai',
            timestamp: Date.now(),
          };
        } catch (error) {
          results.openai = {
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            provider: 'openai',
            timestamp: Date.now(),
          };
        }
      })()
    );
  }

  if (providers.includes('gemini')) {
    promises.push(
      (async () => {
        try {
          const text = await callGemini(messages);
          results.gemini = {
            text,
            provider: 'gemini',
            timestamp: Date.now(),
          };
        } catch (error) {
          results.gemini = {
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            provider: 'gemini',
            timestamp: Date.now(),
          };
        }
      })()
    );
  }

  await Promise.all(promises);
  return results;
}
