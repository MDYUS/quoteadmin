
import { useState, useEffect, useCallback } from 'react';
import { SiteVisit } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake } from '../utils';

export const useSiteVisits = () => {
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('site_visits')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (dbError) throw new Error(dbError.message);
      setSiteVisits(toCamel(data) || []);
    } catch (err: any) {
      setError(`Failed to load site visits: ${err.message}`);
      console.error(err);
      throw err;
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchVisits().catch(() => {});
  }, [fetchVisits]);

  const addVisit = useCallback(async (visit: SiteVisit) => {
    const { id, ...visitData } = visit;
    const { data, error: dbError } = await supabase
      .from('site_visits')
      .insert(toSnake(visitData))
      .select()
      .single();
    
    if (dbError) throw new Error(dbError.message);
    if (data) {
      // Refetch to maintain sort order
      await fetchVisits();
    }
  }, [fetchVisits]);

  const updateVisit = useCallback(async (updatedVisit: SiteVisit) => {
    const { error: dbError } = await supabase
      .from('site_visits')
      .update(toSnake(updatedVisit))
      .eq('id', updatedVisit.id);
      
    if (dbError) throw new Error(dbError.message);
    // Refetch to maintain sort order
    await fetchVisits();
  }, [fetchVisits]);

  const deleteVisit = useCallback(async (visitId: string) => {
    const { count, error: dbError } = await supabase.from('site_visits').delete({ count: 'exact' }).eq('id', visitId);
    if (dbError) throw new Error(dbError.message);
    if (count === 0) {
        throw new Error("Deletion failed. The visit might not exist or you may not have permission to delete it.");
    }
    await fetchVisits();
  }, [fetchVisits]);

  return { siteVisits, addVisit, updateVisit, deleteVisit, isLoaded, error };
};