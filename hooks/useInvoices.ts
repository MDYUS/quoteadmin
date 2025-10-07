import { useState, useEffect, useCallback } from 'react';
import { Invoice } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake } from '../utils';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw new Error(dbError.message);
      setInvoices(toCamel(data) || []);
    } catch (err: any) {
      setError(`Failed to load invoices: ${err.message}`);
      console.error(err);
      throw err;
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchInvoices().catch(() => {});
  }, [fetchInvoices]);

  const addInvoice = useCallback(async (invoice: Invoice) => {
    const { id, ...invoiceData } = invoice;
    const { data, error: dbError } = await supabase
      .from('invoices')
      .insert(toSnake(invoiceData))
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    if (data) {
      await fetchInvoices();
    }
  }, [fetchInvoices]);

  const updateInvoice = useCallback(async (updatedInvoice: Invoice) => {
    const { error: dbError } = await supabase
      .from('invoices')
      .update(toSnake(updatedInvoice))
      .eq('id', updatedInvoice.id);

    if (dbError) throw new Error(dbError.message);
    await fetchInvoices();
  }, [fetchInvoices]);

  const deleteInvoice = useCallback(async (invoiceId: string) => {
    const { count, error: dbError } = await supabase.from('invoices').delete({ count: 'exact' }).eq('id', invoiceId);
    if (dbError) throw new Error(dbError.message);
    if (count === 0) {
        throw new Error("Deletion failed. The invoice might not exist or you may not have permission to delete it.");
    }
    await fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, addInvoice, updateInvoice, deleteInvoice, isLoaded, error };
};
