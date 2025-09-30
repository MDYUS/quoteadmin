import { useState, useEffect, useCallback } from 'react';
import { Payment } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake } from '../utils';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .order('due_date', { ascending: true });

      if (dbError) throw new Error(dbError.message);
      setPayments(toCamel(data) || []);
    } catch (err: any) {
      setError(`Failed to load payments: ${err.message}`);
      console.error(err);
      throw err;
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchPayments().catch(() => {});
  }, [fetchPayments]);

  const addPayment = useCallback(async (payment: Payment) => {
    const { id, ...paymentData } = payment;
    const { data, error: dbError } = await supabase
      .from('payments')
      .insert(toSnake(paymentData))
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    if (data) {
      await fetchPayments();
    }
  }, [fetchPayments]);

  const updatePayment = useCallback(async (updatedPayment: Payment) => {
    const { error: dbError } = await supabase
      .from('payments')
      .update(toSnake(updatedPayment))
      .eq('id', updatedPayment.id);

    if (dbError) throw new Error(dbError.message);
    await fetchPayments();
  }, [fetchPayments]);

  const deletePayment = useCallback(async (paymentId: string) => {
    const { count, error: dbError } = await supabase.from('payments').delete({ count: 'exact' }).eq('id', paymentId);
    if (dbError) throw new Error(dbError.message);
    if (count === 0) {
        throw new Error("Deletion failed. The payment might not exist or you may not have permission to delete it.");
    }
    await fetchPayments();
  }, [fetchPayments]);

  return { payments, addPayment, updatePayment, deletePayment, isLoaded, error };
};
