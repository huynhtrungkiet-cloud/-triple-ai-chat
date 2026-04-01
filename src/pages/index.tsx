import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ControlPanel } from '@/components/ControlPanel';
import { useAppStore, Message } from '@/store/app-store';
import { callMultipleAI, AIMessage } from '@/lib/ai-service';
import { AlertCircle } from 'lucide-react';

export default function ChatPage() {
  const {
    projects,
    currentProjectId,
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
    addMessage,
    createProject,
    getCurrentProject,
    mode,
    selectedProviders,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentProject = getCurrentProject();

  // Create default project on first load
  useEffect(() => {
    if (projects.length === 0) {
      createProject('Welcome Chat');
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentProject?.messages]);

  const handleSendMessage = async (content: string) => {
    if (!currentProject || !selectedProviders.length) {
      setError('Vui lòng chọn ít nhất 1 AI provider');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      addMessage(userMessage);

      // Convert messages for API
      const apiMessages: AIMessage[] = (currentProject?.messages || [])
        .filter(m => !isLoading)
        .slice(-10) // Keep last 10 messages for context
        .concat([userMessage])
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      // Call multiple AI based on mode
      if (mode === 'compare') {
        // Compare mode: call all selected providers
        const results = await callMultipleAI(apiMessages, selectedProviders);

        // Add separate message for each provider
        for (const [provider, result] of Object.entries(results)) {
          if (result && !result.text.startsWith('Error')) {
            const aiMessage: Message = {
              id: `${Date.now()}-${provider}`,
              role: 'assistant',
              content: result.text,
              provider: provider as any,
              timestamp: Date.now(),
            };
            addMessage(aiMessage);
          }
        }
      } else if (mode === 'single') {
        // Single mode: use first selected provider
        const primaryProvider = selectedProviders[0];
        const results = await callMultipleAI(apiMessages, [primaryProvider]);

        if (results[primaryProvider]) {
          const aiMessage: Message = {
            id: `${Date.now()}-${primaryProvider}`,
            role: 'assistant',
            content: results[primaryProvider].text,
            provider: primaryProvider as any,
            timestamp: Date.now(),
          };
          addMessage(aiMessage);
        }
      } else if (mode === 'chain') {
        // Chain mode: pass output of one AI to next
        let chainContent = content;

        for (const provider of selectedProviders) {
          const chainMessages: AIMessage[] = [
            ...apiMessages.slice(0, -1),
            { role: 'user', content: chainContent },
          ];

          const results = await callMultipleAI(chainMessages, [provider]);

          if (results[provider]) {
            const aiMessage: Message = {
              id: `${Date.now()}-${provider}`,
              role: 'assistant',
              content: results[provider].text,
              provider: provider as any,
              timestamp: Date.now(),
            };
            addMessage(aiMessage);
            chainContent = results[provider].text; // Use this output for next AI
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to get AI response: ${errorMessage}`);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:ml-0">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm p-4 ml-16 lg:ml-0">
          <h1 className="text-lg font-bold text-gray-100">{currentProject.name}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {selectedProviders.length > 0
              ? `${selectedProviders.length} AI provider${selectedProviders.length !== 1 ? 's' : ''} - ${mode} mode`
              : 'Chọn ít nhất 1 AI provider'}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
            <ControlPanel />

            {/* Messages */}
            <div className="space-y-4 mb-4">
              {currentProject.messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-64"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">Welcome to Triple AI</h2>
                    <p className="text-gray-400 max-w-md">
                      Hỏi Claude, GPT-4 hay Gemini. So sánh kết quả, chain chúng lại, hoặc dùng từng cái riêng biệt.
                    </p>
                  </div>
                </motion.div>
              ) : (
                currentProject.messages.map(message => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    provider={message.provider}
                  />
                ))
              )}

              {isLoading && (
                <ChatMessage
                  role="assistant"
                  content=""
                  provider={selectedProviders[0]}
                  isLoading={true}
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3 items-start"
              >
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-300">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-xs text-red-400 hover:text-red-300 mt-2 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 lg:px-8 pb-4">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
