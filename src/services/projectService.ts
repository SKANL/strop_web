import { fetchFromApi } from './api';
import { mockProjects, mockProjectsWithStats } from '@/lib/mock';
import type { Project, ProjectWithStats } from '@/lib/mock/types';

export const projectService = {
  getProjects: async () => {
    return fetchFromApi(() => mockProjectsWithStats);
  },

  getProjectById: async (id: string) => {
    return fetchFromApi(() => {
      const project = mockProjectsWithStats.find(p => p.id === id);
      if (!project) throw new Error(`Project with ID ${id} not found`);
      return project;
    });
  },

  createProject: async (project: Partial<Project>) => {
    return fetchFromApi(() => {
      // Simulation of creation
      return { ...project, id: `proj-${Date.now()}` } as Project;
    });
  }
};
