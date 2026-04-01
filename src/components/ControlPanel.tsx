import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';

export const ControlPanel: React.FC = () => {
  const { mode, setMode, selectedProviders, setSelectedProviders } = useAppStore();

  const toggleProvider = (provider: string) => {
    if (selectedProviders.includes(provider)) {
      setSelectedProviders(selectedProviders.filter(p => p !== provider));
    } else {
      setSelectedProviders([...selectedProviders, provider]);
    }
  };

  const modes = [
    { id: 'compare', label: '🔀 So Sánh', desc: 'Xem tất cả AI trả lời' },
    { id: 'single', label: '🎯 Chọn AI', desc: 'Dùng 1 AI lúc một' },
    { id: 'chain', label: '🔗 Chain', desc: 'Liên kết các AI' },
  ];

  const providers = [
    { id: 'claude', label: 'Claude', color: 'from-blue-500 to-blue-600' },
    { id: 'openai', label: 'GPT-4', color: 'from-green-500 to-green-600' },
    { id: 'gemini', label: 'Gemini', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="glass p-4 rounded-lg space-y-4">
        {/* Mode Selection */}
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Mode
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`p-3 rounded-lg transition-all duration-200 text-sm font-medium text-center ${
                  mode === m.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white ring-2 ring-primary-400/50'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <div className="text-lg mb-1">{m.label.split(' ')[0]}</div>
                <div className="text-xs">{m.label.split(' ')[1]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Provider Selection */}
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            AI Providers
          </h3>
          <div className="space-y-2">
            {providers.map(provider => (
              <label
                key={provider.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedProviders.includes(provider.id)}
                  onChange={() => toggleProvider(provider.id)}
                  className="w-4 h-4 rounded accent-primary-500"
                />
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${provider.color}`} />
                <span className="text-sm text-gray-300 flex-1">{provider.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
