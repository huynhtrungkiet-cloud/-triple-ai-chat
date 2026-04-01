import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: 'claude' | 'openai' | 'gemini' | 'all';
  responses?: {
    claude?: string;
    openai?: string;
    gemini?: string;
  };
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  messages: Message[];
  mode: 'compare' | 'single' | 'chain';
  selectedProviders: string[];
  createdAt: number;
  updatedAt: number;
}

interface AppStore {
  projects: Project[];
  currentProjectId: string | null;
  mode: 'compare' | 'single' | 'chain';
  selectedProviders: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createProject: (name: string) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;
  addMessage: (message: Message) => void;
  setMode: (mode: 'compare' | 'single' | 'chain') => void;
  setSelectedProviders: (providers: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getCurrentProject: () => Project | null;
}

export const useAppStore = create<AppStore>((set, get) => {
  // Load from localStorage
  const savedProjects = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('projects') || '[]')
    : [];
  const savedCurrentProjectId = typeof window !== 'undefined'
    ? localStorage.getItem('currentProjectId')
    : null;

  return {
    projects: savedProjects,
    currentProjectId: savedCurrentProjectId,
    mode: 'compare',
    selectedProviders: ['claude', 'openai', 'gemini'],
    isLoading: false,
    error: null,

    createProject: (name: string) => {
      const newProject: Project = {
        id: Date.now().toString(),
        name,
        messages: [],
        mode: 'compare',
        selectedProviders: ['claude', 'openai', 'gemini'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      set(state => {
        const updatedProjects = [...state.projects, newProject];
        if (typeof window !== 'undefined') {
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }
        return {
          projects: updatedProjects,
          currentProjectId: newProject.id,
        };
      });
    },

    deleteProject: (id: string) => {
      set(state => {
        const updatedProjects = state.projects.filter(p => p.id !== id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }
        return {
          projects: updatedProjects,
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        };
      });
    },

    setCurrentProject: (id: string) => {
      set(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentProjectId', id);
        }
        return { currentProjectId: id };
      });
    },

    addMessage: (message: Message) => {
      set(state => {
        const updatedProjects = state.projects.map(project => {
          if (project.id === state.currentProjectId) {
            return {
              ...project,
              messages: [...project.messages, message],
              updatedAt: Date.now(),
            };
          }
          return project;
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }

        return { projects: updatedProjects };
      });
    },

    setMode: (mode: 'compare' | 'single' | 'chain') => {
      set(state => {
        const updatedProjects = state.projects.map(project => {
          if (project.id === state.currentProjectId) {
            return { ...project, mode };
          }
          return project;
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }

        return { mode, projects: updatedProjects };
      });
    },

    setSelectedProviders: (providers: string[]) => {
      set(state => {
        const updatedProjects = state.projects.map(project => {
          if (project.id === state.currentProjectId) {
            return { ...project, selectedProviders: providers };
          }
          return project;
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }

        return { selectedProviders: providers, projects: updatedProjects };
      });
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),

    getCurrentProject: () => {
      const state = get();
      return state.projects.find(p => p.id === state.currentProjectId) || null;
    },
  };
});
