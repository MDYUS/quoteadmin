
import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake } from '../utils';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw new Error(dbError.message);
      setProjects(toCamel(data) || []);
    } catch (err: any) {
      setError(`Failed to load projects: ${err.message}`);
      console.error(err);
      throw err;
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  const addProject = useCallback(async (project: Project) => {
    const { id, ...projectData } = project;
    const { data, error: dbError } = await supabase
      .from('projects')
      .insert(toSnake(projectData))
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    if (data) {
      await fetchProjects();
    }
  }, [fetchProjects]);

  const updateProject = useCallback(async (updatedProject: Project) => {
    const { error: dbError } = await supabase
      .from('projects')
      .update(toSnake(updatedProject))
      .eq('id', updatedProject.id);

    if (dbError) throw new Error(dbError.message);
    await fetchProjects();
  }, [fetchProjects]);

  const deleteProject = useCallback(async (projectId: string) => {
    const { error: dbError } = await supabase.from('projects').delete().eq('id', projectId);
    if (dbError) throw new Error(dbError.message);
    await fetchProjects();
  }, [fetchProjects]);

  return { projects, addProject, updateProject, deleteProject, isLoaded, error };
};