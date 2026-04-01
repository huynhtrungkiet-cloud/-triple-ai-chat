import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Settings, Menu, X } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export const Sidebar: React.FC = () => {
  const { projects, currentProjectId, createProject, deleteProject, setCurrentProject } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName);
      setNewProjectName('');
      setShowNewProjectInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateProject();
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-slate-700 rounded-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        className="fixed lg:relative left-0 top-0 h-screen w-80 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col z-40 pt-20 lg:pt-0"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-2xl font-bold gradient-text mb-1">Triple AI</h1>
          <p className="text-xs text-gray-400">Claude + GPT-4 + Gemini</p>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
            Projects
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Tạo project đầu tiên của bạn</p>
            </div>
          ) : (
            projects.map(project => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => {
                    setCurrentProject(project.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    currentProjectId === project.id
                      ? 'bg-primary-500/20 border border-primary-500/50 text-primary-400'
                      : 'hover:bg-slate-700/50 text-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium truncate">{project.name}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* New Project Input */}
        <div className="border-t border-slate-700 p-4 space-y-2">
          <AnimatePresence>
            {showNewProjectInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-2"
              >
                <input
                  autoFocus
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tên project..."
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleCreateProject}
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded text-sm font-medium transition-colors"
                >
                  Tạo
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowNewProjectInput(!showNewProjectInput)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all duration-200 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            New Project
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-slate-700/50 rounded text-sm text-gray-300 transition-colors">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </motion.div>
    </>
  );
};
