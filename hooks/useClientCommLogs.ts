
import { useState, useEffect, useCallback } from 'react';
import { ClientCommLog } from '../types';

const LOGS_STORAGE_KEY = 'crm_client_comm_logs_v2';

export const useClientCommLogs = () => {
  const [logs, setLogs] = useState<ClientCommLog[]>(() => {
    try {
      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      return storedLogs ? JSON.parse(storedLogs) : [];
    } catch (error) {
      console.error("Failed to parse client logs from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Failed to save client logs to localStorage", error);
    }
  }, [logs]);

  const addLog = useCallback((log: ClientCommLog) => {
    setLogs(prev => [...prev, log]);
  }, []);

  const updateLog = useCallback((updatedLog: ClientCommLog) => {
    setLogs(prev => prev.map(l => l.id === updatedLog.id ? updatedLog : l));
  }, []);

  const deleteLog = useCallback((logId: string) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
  }, []);

  return { logs, addLog, updateLog, deleteLog };
};
