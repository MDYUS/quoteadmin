
import { useState, useEffect, useCallback } from 'react';
import { Lead } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake } from '../utils';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw new Error(dbError.message);
      setLeads(toCamel(data) || []);
    } catch (err: any) {
      setError(`Failed to load leads: ${err.message}`);
      console.error(err);
      throw err; // Re-throw for initial load error handling
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchLeads().catch(() => {
      // Error is already set and thrown by fetchLeads,
      // this catch block prevents an unhandled promise rejection error in the console.
    });
  }, [fetchLeads]);

  const addLead = useCallback(async (lead: Lead) => {
    const { id, ...leadData } = lead;
    const { data, error: dbError } = await supabase
      .from('leads')
      .insert(toSnake(leadData))
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    if (data) {
      await fetchLeads();
    }
  }, [fetchLeads]);

  const updateLead = useCallback(async (updatedLead: Lead) => {
    const { error: dbError } = await supabase
      .from('leads')
      .update(toSnake(updatedLead))
      .eq('id', updatedLead.id);

    if (dbError) throw new Error(dbError.message);
    await fetchLeads();
  }, [fetchLeads]);

  const deleteLead = useCallback(async (leadId: string) => {
    const { count, error: dbError } = await supabase.from('leads').delete({ count: 'exact' }).eq('id', leadId);
    
    if (dbError) {
        throw new Error(dbError.message);
    }

    if (count === 0) {
        throw new Error("Deletion failed. The lead might not exist or you may not have permission to delete it.");
    }

    await fetchLeads();
  }, [fetchLeads]);

  return { leads, addLead, updateLead, deleteLead, isLoaded, error };
};