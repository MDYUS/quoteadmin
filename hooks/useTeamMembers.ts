
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake } from '../utils';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('team_members')
        .select('*')
        .order('name', { ascending: true });

      if (dbError) throw new Error(dbError.message);
      setTeamMembers(toCamel(data) || []);
    } catch (err: any) {
      setError(`Failed to load team members: ${err.message}`);
      console.error(err);
      throw err;
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers().catch(() => {});
  }, [fetchTeamMembers]);


  const addTeamMember = useCallback(async (member: TeamMember) => {
    const { id, ...memberData } = member;
    const { data, error: dbError } = await supabase
      .from('team_members')
      .insert(toSnake(memberData))
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    if (data) {
      await fetchTeamMembers();
    }
  }, [fetchTeamMembers]);

  const updateTeamMember = useCallback(async (updatedMember: TeamMember) => {
    const { error: dbError } = await supabase
      .from('team_members')
      .update(toSnake(updatedMember))
      .eq('id', updatedMember.id);

    if (dbError) throw new Error(dbError.message);
    await fetchTeamMembers();
  }, [fetchTeamMembers]);

  const deleteTeamMember = useCallback(async (memberId: string) => {
    const { count, error: dbError } = await supabase.from('team_members').delete({ count: 'exact' }).eq('id', memberId);
    if (dbError) throw new Error(dbError.message);
    if (count === 0) {
        throw new Error("Deletion failed. The team member might not exist or you may not have permission to delete it.");
    }
    await fetchTeamMembers();
  }, [fetchTeamMembers]);

  return { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, isLoaded, error };
};