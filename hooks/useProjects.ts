
import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';

const PROJECTS_STORAGE_KEY = 'crm_projects_v2';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return storedProjects ? JSON.parse(storedProjects) : [];
    } catch (error) {
      console.error("Failed to parse projects from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects to localStorage", error);
    }
  }, [projects]);

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [...prev, project]);
  }, []);

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  }, []);

  return { projects, addProject, updateProject, deleteProject };
};
