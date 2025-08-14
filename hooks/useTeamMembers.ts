
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';

const TEAM_MEMBERS_STORAGE_KEY = 'crm_team_members_v2';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const storedMembers = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
      return storedMembers ? JSON.parse(storedMembers) : [];
    } catch (error) {
      console.error("Failed to parse team members from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(teamMembers));
    } catch (error) {
      console.error("Failed to save team members to localStorage", error);
    }
  }, [teamMembers]);

  const addTeamMember = useCallback((member: TeamMember) => {
    setTeamMembers(prev => [...prev, member]);
  }, []);

  const updateTeamMember = useCallback((updatedMember: TeamMember) => {
    setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  }, []);

  const deleteTeamMember = useCallback((memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);

  return { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember };
};
