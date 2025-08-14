
import { useState, useEffect, useCallback } from 'react';
import { Lead } from '../types';

const LEADS_STORAGE_KEY = 'crm_leads_v2';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
      setLeads(storedLeads ? JSON.parse(storedLeads) : []);
    } catch (err: any) {
      setError("Failed to load leads from local storage.");
      console.error(err);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) { // Don't save on initial empty state
      try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
      } catch (err) {
        console.error("Failed to save leads to localStorage", err);
        setError("Failed to save leads.");
      }
    }
  }, [leads, isLoaded]);

  const addLead = useCallback((lead: Lead) => {
    setLeads(prev => [...prev, lead]);
  }, []);

  const updateLead = useCallback((updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  }, []);

  const deleteLead = useCallback((leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
  }, []);

  return { leads, addLead, updateLead, deleteLead, isLoaded, error };
};
