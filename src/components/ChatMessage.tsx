import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  provider?: 'claude' | 'openai' | 'gemini';
  isLoading?: boolean;
}

const getProviderColor = (provider?: string) => {
  switch (provider) {
    case 'claude':
      return 'from-blue-500 to-blue-600';
    case 'openai':
      return 'from-green-500 to-green-600';
    case 'gemini':
      return 'from-orange-500 to-orange-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const getProviderLabel = (provider?: string) => {
  switch (provider) {
    case 'claude':
      return 'Claude (Anthropic)';
    case 'openai':
      return 'GPT-4 (OpenAI)';
    case 'gemini':
      return 'Gemini (Google)';
    default:
      return 'You';
  }
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  provider,
  isLoading,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 mb-6 ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-2xl ${role === 'user' ? 'order-last' : ''}`}>
        {role === 'assistant' && provider && (
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2 bg-gradient-to-r ${getProviderColor(provider)}`}>
            {getProviderLabel(provider)}
          </div>
        )}

        <div
          className={`
            px-4 py-3 rounded-lg backdrop-blur-sm
            ${role === 'user'
              ? 'bg-primary-600 text-white rounded-br-none'
              : 'glass bg-slate-700/40 text-gray-100 rounded-bl-none'
            }
          `}
        >
          {isLoading ? (
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-body">
              {content}
            </p>
          )}
        </div>

        {role === 'assistant' && !isLoading && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
              title="Copy message"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
