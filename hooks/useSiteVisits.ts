
import { useState, useEffect, useCallback } from 'react';
import { SiteVisit } from '../types';

const SITE_VISITS_STORAGE_KEY = 'crm_site_visits_v2';

export const useSiteVisits = () => {
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() => {
    try {
      const storedVisits = localStorage.getItem(SITE_VISITS_STORAGE_KEY);
      return storedVisits ? JSON.parse(storedVisits) : [];
    } catch (error) {
      console.error("Failed to parse site visits from localStorage", error);
      return [];
    }
  });
  
  const sortVisits = (visits: SiteVisit[]) => {
      return [...visits].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }
  
  useEffect(() => {
    try {
      localStorage.setItem(SITE_VISITS_STORAGE_KEY, JSON.stringify(siteVisits));
    } catch (error) {
      console.error("Failed to save site visits to localStorage", error);
    }
  }, [siteVisits]);

  const addVisit = useCallback((visit: SiteVisit) => {
    setSiteVisits(prev => sortVisits([...prev, visit]));
  }, []);

  const updateVisit = useCallback((updatedVisit: SiteVisit) => {
    setSiteVisits(prev => sortVisits(prev.map(v => v.id === updatedVisit.id ? updatedVisit : v)));
  }, []);

  const deleteVisit = useCallback((visitId: string) => {
    setSiteVisits(prev => prev.filter(v => v.id !== visitId));
  }, []);

  return { siteVisits, addVisit, updateVisit, deleteVisit };
};
