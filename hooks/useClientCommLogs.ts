
import { useState, useEffect, useCallback } from 'react';
import { ClientCommLog } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake } from '../utils';

export const useClientCommLogs = () => {
  const [logs, setLogs] = useState<ClientCommLog[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('client_comm_logs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (dbError) throw new Error(dbError.message);
      setLogs(toCamel(data) || []);
    } catch (err: any) {
      setError(`Failed to load client logs: ${err.message}`);
      console.error(err);
      throw err;
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  useEffect(() => {
    fetchLogs().catch(() => {});
  }, [fetchLogs]);

  const addLog = useCallback(async (log: ClientCommLog) => {
    const { id, ...logData } = log;
    const { data, error: dbError } = await supabase
      .from('client_comm_logs')
      .insert(toSnake(logData))
      .select()
      .single();
      
    if (dbError) throw new Error(dbError.message);
    if (data) {
      await fetchLogs();
    }
  }, [fetchLogs]);

  const updateLog = useCallback(async (updatedLog: ClientCommLog) => {
    const { error: dbError } = await supabase
      .from('client_comm_logs')
      .update(toSnake(updatedLog))
      .eq('id', updatedLog.id);
      
    if (dbError) throw new Error(dbError.message);
    await fetchLogs();
  }, [fetchLogs]);

  const deleteLog = useCallback(async (logId: string) => {
    const { count, error: dbError } = await supabase.from('client_comm_logs').delete({ count: 'exact' }).eq('id', logId);
    if (dbError) throw new Error(dbError.message);
    if (count === 0) {
        throw new Error("Deletion failed. The log might not exist or you may not have permission to delete it.");
    }
    await fetchLogs();
  }, [fetchLogs]);

  return { logs, addLog, updateLog, deleteLog, isLoaded, error };
};